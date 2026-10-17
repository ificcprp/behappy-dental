"use client";

import React, { useState, useEffect } from "react";
import { History, X, RotateCcw, AlertTriangle, Clock, User } from "lucide-react";

interface VersionItem {
  id: string;
  created_at: string;
  user_email?: string;
  version_tag: string;
  status: string;
  change_summary?: string;
  is_active_production?: boolean;
}

interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestoreSuccess: (restoredData: any) => void;
}

export function VersionHistoryModal({
  isOpen,
  onClose,
  onRestoreSuccess,
}: VersionHistoryModalProps) {
  const [versions, setVersions] = useState<VersionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchVersions();
    }
  }, [isOpen]);

  const fetchVersions = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/cms?history=true");
      const json = await res.json();
      if (json.success && Array.isArray(json.versions)) {
        setVersions(json.versions);
      } else {
        setVersions([]);
      }
    } catch {
      setErrorMsg("No se pudo cargar el historial de versiones.");
    } finally {
      setLoading(false);
    }
  };

  const handleRollback = async (versionId: string, versionTag: string) => {
    if (
      !confirm(
        `¿Estás seguro de restaurar el sitio a la versión "${versionTag}"? Esto reemplazará el contenido publicado actual.`
      )
    ) {
      return;
    }

    setRestoringId(versionId);
    try {
      const res = await fetch("/api/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          __action: "rollback",
          __versionId: versionId,
          __userEmail: "admin@behappydental.cl",
        }),
      });

      const json = await res.json();
      if (json.success && json.restoredPayload) {
        onRestoreSuccess(json.restoredPayload);
        onClose();
      } else {
        alert("Error al restaurar la versión seleccionada.");
      }
    } catch {
      alert("Error de conexión al intentar el rollback.");
    } finally {
      setRestoringId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-lg max-w-2xl w-full p-6 space-y-4 max-h-[85vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-sky-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">Historial de Versiones & Auditoría</h3>
              <p className="text-xs text-slate-600 font-light">
                Registro inmutable de publicaciones y puntos de restauración (Rollback)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 transition p-1 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Content list */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {loading ? (
            <div className="py-12 text-center text-xs font-mono text-slate-500">
              Consultando registro de versiones en Supabase...
            </div>
          ) : versions.length === 0 ? (
            <div className="py-12 text-center text-slate-600 text-xs font-mono space-y-2">
              <p>Aún no hay versiones archivadas en la tabla `cms_versions`.</p>
              <p className="text-[11px] text-slate-500">
                Al hacer clic en &quot;Publicar Cambios&quot; se generará automáticamente tu primera versión con firma y timestamp.
              </p>
            </div>
          ) : (
            versions.map((ver) => (
              <div
                key={ver.id}
                className={`p-3.5 border rounded-lg transition ${
                  ver.is_active_production
                    ? "border-emerald-300 bg-emerald-50/60 ring-1 ring-emerald-300"
                    : "border-slate-200 bg-white hover:border-slate-300"
                } flex flex-col sm:flex-row sm:items-center justify-between gap-3`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900">
                      {ver.version_tag}
                    </span>
                    {ver.is_active_production ? (
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold uppercase rounded">
                        Versión Activa
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-600 uppercase rounded">
                        Histórico
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-700 font-light">
                    {ver.change_summary || "Sin resumen de cambios especificado"}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-slate-500 pt-0.5">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {new Date(ver.created_at).toLocaleString("es-CL")}
                    </span>
                    {ver.user_email && (
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-400" />
                        {ver.user_email}
                      </span>
                    )}
                  </div>
                </div>

                {!ver.is_active_production && (
                  <button
                    onClick={() => handleRollback(ver.id, ver.version_tag)}
                    disabled={restoringId === ver.id}
                    className="px-3 py-1.5 border border-slate-200 hover:border-amber-500 bg-white text-slate-700 hover:text-amber-700 font-mono text-[11px] uppercase rounded transition flex items-center gap-1.5 shrink-0 disabled:opacity-50 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>{restoringId === ver.id ? "Restaurando..." : "Restaurar"}</span>
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-mono uppercase rounded transition cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
