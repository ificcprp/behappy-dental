"use client";

import React, { useState, useEffect } from "react";
import { History, X, Check, RotateCcw, AlertTriangle, Clock, User } from "lucide-react";

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
    } catch (err: any) {
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#121216] border border-[#2b2b34] max-w-2xl w-full p-6 space-y-4 max-h-[85vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#222228] pb-3">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="text-base font-bold text-white">Historial de Versiones & Auditoría</h3>
              <p className="text-xs text-neutral-400 font-light">
                Registro inmutable de publicaciones y puntos de restauración (Rollback)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-950/40 border border-red-800 text-red-200 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Content list */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {loading ? (
            <div className="py-12 text-center text-xs font-mono text-neutral-500">
              Consultando registro de versiones en Supabase...
            </div>
          ) : versions.length === 0 ? (
            <div className="py-12 text-center text-neutral-400 text-xs font-mono space-y-2">
              <p>Aún no hay versiones archivadas en la tabla `cms_versions`.</p>
              <p className="text-[11px] text-neutral-500">
                Al hacer clic en &quot;Publicar Cambios&quot; se generará automáticamente tu primera versión con firma y timestamp.
              </p>
            </div>
          ) : (
            versions.map((ver) => (
              <div
                key={ver.id}
                className={`p-3.5 border transition ${
                  ver.is_active_production
                    ? "border-emerald-500/80 bg-emerald-950/10"
                    : "border-[#222228] bg-[#18181f] hover:border-[#3a3a44]"
                } flex flex-col sm:flex-row sm:items-center justify-between gap-3`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-white">
                      {ver.version_tag}
                    </span>
                    {ver.is_active_production ? (
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-950 border border-emerald-600 text-emerald-400 font-bold uppercase">
                        Versión Activa
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-neutral-900 border border-neutral-700 text-neutral-400 uppercase">
                        Histórico
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-neutral-300 font-light">
                    {ver.change_summary || "Sin resumen de cambios especificado"}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-neutral-500 pt-0.5">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(ver.created_at).toLocaleString("es-CL")}
                    </span>
                    {ver.user_email && (
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {ver.user_email}
                      </span>
                    )}
                  </div>
                </div>

                {!ver.is_active_production && (
                  <button
                    onClick={() => handleRollback(ver.id, ver.version_tag)}
                    disabled={restoringId === ver.id}
                    className="px-3 py-1.5 border border-neutral-700 hover:border-amber-400 text-neutral-300 hover:text-amber-300 font-mono text-[11px] uppercase transition flex items-center gap-1.5 shrink-0 disabled:opacity-50"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>{restoringId === ver.id ? "Restaurando..." : "Restaurar"}</span>
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        <div className="pt-3 border-t border-[#222228] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-neutral-700 hover:border-neutral-500 text-neutral-300 text-xs font-mono uppercase transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
