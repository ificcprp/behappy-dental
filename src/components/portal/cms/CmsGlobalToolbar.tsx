"use client";

import React from "react";
import {
  Save,
  RotateCcw,
  ExternalLink,
  History,
  CheckCircle,
  FileText,
  Clock
} from "lucide-react";

interface CmsGlobalToolbarProps {
  currentStatus?: "draft" | "published";
  versionTag?: string;
  lastUpdated?: string;
  onSaveDraft: () => void;
  onPublish: () => void;
  onOpenHistory: () => void;
  onReset: () => void;
}

export function CmsGlobalToolbar({
  currentStatus = "published",
  versionTag = "v2.0 Producción",
  lastUpdated,
  onSaveDraft,
  onPublish,
  onOpenHistory,
  onReset,
}: CmsGlobalToolbarProps) {
  return (
    <div className="border border-[#222228] bg-[#121216] p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      {/* Estado y Versión Activa */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              currentStatus === "published"
                ? "bg-emerald-400 animate-pulse"
                : "bg-amber-400"
            }`}
          />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
            {currentStatus === "published" ? "EN PRODUCCIÓN" : "BORRADOR ACTIVO"}
          </span>
        </div>

        <span className="text-neutral-600 hidden sm:inline">|</span>

        <div className="flex items-center gap-1.5 text-[11px] font-mono text-neutral-400 bg-[#18181f] px-2.5 py-1 border border-[#2b2b34]">
          <FileText className="w-3.5 h-3.5 text-purple-400" />
          <span>{versionTag}</span>
        </div>

        {lastUpdated && (
          <div className="flex items-center gap-1 text-[10px] font-mono text-neutral-500">
            <Clock className="w-3 h-3" />
            <span>
              Último guardado: {new Date(lastUpdated).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        )}
      </div>

      {/* Botones de Acción */}
      <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
        {/* Historial / Rollback */}
        <button
          onClick={onOpenHistory}
          className="px-3 py-2 border border-[#2b2b34] hover:border-neutral-500 text-neutral-300 font-mono text-xs uppercase tracking-wider transition flex items-center gap-1.5"
          title="Ver versiones publicadas y auditoría de cambios"
        >
          <History className="w-3.5 h-3.5 text-blue-400" />
          <span>Historial / Rollback</span>
        </button>

        {/* Guardar Borrador */}
        <button
          onClick={onSaveDraft}
          className="px-3 py-2 border border-[#2b2b34] hover:border-amber-400 text-neutral-300 hover:text-amber-300 font-mono text-xs uppercase tracking-wider transition flex items-center gap-1.5"
          title="Guardar cambios localmente sin alterar la versión publicada"
        >
          <Save className="w-3.5 h-3.5 text-amber-400" />
          <span>Guardar Borrador</span>
        </button>

        {/* Publicar en Producción */}
        <button
          onClick={onPublish}
          className="px-4 py-2 bg-white text-black font-bold font-mono text-xs uppercase tracking-wider hover:bg-neutral-200 transition flex items-center gap-1.5 shadow"
          title="Publicar versión oficial y sincronizar en Supabase"
        >
          <CheckCircle className="w-3.5 h-3.5 text-black" />
          <span>Publicar Cambios</span>
        </button>

        {/* Restablecer Valores Oficiales */}
        <button
          onClick={onReset}
          className="px-3 py-2 border border-[#2b2b34] hover:border-red-500/70 text-neutral-400 hover:text-red-400 font-mono text-xs uppercase tracking-wider transition flex items-center gap-1.5"
          title="Restablecer contenido predeterminado oficial de BeHappy Dental"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Restablecer</span>
        </button>

        {/* Ver Sitio Web en Vivo */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-2 border border-[#2b2b34] hover:border-white text-neutral-300 hover:text-white font-mono text-xs uppercase tracking-wider transition flex items-center gap-1.5"
          title="Abrir web pública en pestaña nueva"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Ver Web</span>
        </a>
      </div>
    </div>
  );
}
