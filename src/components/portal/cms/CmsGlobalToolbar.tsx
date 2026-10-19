"use client";

import React from "react";
import {
  Save,
  RotateCcw,
  ExternalLink,
  History,
  CheckCircle,
  FileText,
  Clock,
  Palette,
  Download,
  Upload,
} from "lucide-react";

interface CmsGlobalToolbarProps {
  currentStatus?: "draft" | "published";
  versionTag?: string;
  lastUpdated?: string;
  colorScheme?: "blanco" | "negro" | "sistema";
  onSaveDraft: () => void;
  onPublish: () => void;
  onOpenHistory: () => void;
  onReset: () => void;
  onExportBackup?: () => void;
  onImportBackup?: (jsonString: string) => void;
}

export function CmsGlobalToolbar({
  currentStatus = "published",
  versionTag = "v2.0 Producción",
  lastUpdated,
  colorScheme = "blanco",
  onSaveDraft,
  onPublish,
  onOpenHistory,
  onReset,
  onExportBackup,
  onImportBackup,
}: CmsGlobalToolbarProps) {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content && onImportBackup) {
        onImportBackup(content);
      }
    };
    reader.readAsText(file);
    // Reset file input value
    e.target.value = "";
  };
  return (
    <div className="border border-slate-200 bg-white rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
      {/* Estado y Versión Activa */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              currentStatus === "published"
                ? "bg-emerald-500 animate-pulse"
                : "bg-amber-500"
            }`}
          />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
            {currentStatus === "published" ? "EN PRODUCCIÓN" : "BORRADOR ACTIVO"}
          </span>
        </div>

        <span className="text-slate-300 hidden sm:inline">|</span>

        <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-700 bg-slate-50 px-2.5 py-1 border border-slate-200 rounded">
          <FileText className="w-3.5 h-3.5 text-purple-600" />
          <span>{versionTag}</span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-700 bg-slate-50 px-2.5 py-1 border border-slate-200 rounded">
          <Palette className="w-3.5 h-3.5 text-purple-600" />
          <span className="capitalize">Tema: {colorScheme}</span>
        </div>

        {lastUpdated && (
          <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500">
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
          className="px-3 py-1.5 border border-slate-200 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 font-mono text-xs uppercase tracking-wider rounded transition flex items-center gap-1.5 shadow-2xs"
          title="Ver versiones publicadas y auditoría de cambios"
        >
          <History className="w-3.5 h-3.5 text-blue-600" />
          <span>Historial / Rollback</span>
        </button>

        {/* Guardar Borrador */}
        <button
          onClick={onSaveDraft}
          className="px-3 py-1.5 border border-slate-200 hover:border-amber-400 bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-800 font-mono text-xs uppercase tracking-wider rounded transition flex items-center gap-1.5 shadow-2xs"
          title="Guardar cambios localmente sin alterar la versión publicada"
        >
          <Save className="w-3.5 h-3.5 text-amber-600" />
          <span>Guardar Borrador</span>
        </button>

        {/* Publicar en Producción */}
        <button
          onClick={onPublish}
          className="px-4 py-1.5 bg-slate-900 text-white font-bold font-mono text-xs uppercase tracking-wider hover:bg-black rounded transition flex items-center gap-1.5 shadow-xs"
          title="Publicar versión oficial y sincronizar en Supabase"
        >
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span>Publicar Cambios</span>
        </button>

        {/* Restablecer Valores Oficiales */}
        <button
          onClick={onReset}
          className="px-3 py-1.5 border border-slate-200 hover:border-rose-300 bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-700 font-mono text-xs uppercase tracking-wider rounded transition flex items-center gap-1.5 shadow-2xs"
          title="Restablecer contenido predeterminado oficial de BeHappy Dental"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Restablecer</span>
        </button>

        {/* Exportar Respaldo JSON */}
        {onExportBackup && (
          <button
            onClick={onExportBackup}
            className="px-3 py-1.5 border border-slate-200 hover:border-blue-400 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-mono text-xs uppercase tracking-wider rounded transition flex items-center gap-1.5 shadow-2xs"
            title="Descargar copia de seguridad completa en archivo .json"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Exportar JSON</span>
          </button>
        )}

        {/* Restaurar Respaldo JSON */}
        {onImportBackup && (
          <>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 border border-slate-200 hover:border-purple-400 bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-700 font-mono text-xs uppercase tracking-wider rounded transition flex items-center gap-1.5 shadow-2xs"
              title="Restaurar copia de seguridad desde un archivo .json"
            >
              <Upload className="w-3.5 h-3.5 text-purple-600" />
              <span className="hidden sm:inline">Restaurar JSON</span>
            </button>
          </>
        )}

        {/* Ver Sitio Web en Vivo */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 border border-slate-200 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 font-mono text-xs uppercase tracking-wider rounded transition flex items-center gap-1.5 shadow-2xs"
          title="Abrir web pública en pestaña nueva"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Ver Web</span>
        </a>
      </div>
    </div>
  );
}
