"use client";

import React from "react";
import { CMSFlashAlert, DEFAULT_FLASH_ALERT } from "@/lib/cmsStore";
import { AlertTriangle, Bell, Eye, CheckCircle, ArrowRight, RefreshCw, Sparkles, Info } from "lucide-react";

interface FlashAlertEditorProps {
  flashAlert: CMSFlashAlert;
  onUpdateFlashAlert: (updated: CMSFlashAlert) => void;
  triggerToast?: (msg: string) => void;
}

export function FlashAlertEditor({
  flashAlert,
  onUpdateFlashAlert,
  triggerToast,
}: FlashAlertEditorProps) {
  const current = flashAlert || DEFAULT_FLASH_ALERT;

  const handleChange = <K extends keyof CMSFlashAlert>(field: K, value: CMSFlashAlert[K]) => {
    onUpdateFlashAlert({
      ...current,
      [field]: value,
    });
  };

  const handleReset = () => {
    if (confirm("¿Deseas restablecer el banner de aviso a los valores por defecto?")) {
      onUpdateFlashAlert(DEFAULT_FLASH_ALERT);
      if (triggerToast) triggerToast("✓ Banner de aviso restablecido");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="border border-[#222228] bg-[#121216] p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="text-base font-normal text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Banner de Contingencias, Feriados & Avisos de Urgencia</span>
          </h3>
          <p className="text-xs text-neutral-400 font-light mt-0.5">
            Publica avisos prioritarios en la cabecera de todo el sitio web para feriados, emergencias o promociones flash.
          </p>
        </div>
        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#18181f] hover:bg-[#22222a] border border-[#2e2e38] text-neutral-300 hover:text-white text-xs font-mono transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Valores por Defecto</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Settings (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Section: Control Maestro On/Off */}
          <div className="border border-[#222228] bg-[#121216] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Estado del Banner en Producción</span>
                </h4>
                <p className="text-xs text-neutral-400 font-light mt-0.5">
                  Al activarlo, se desplegará de inmediato en la parte superior de todas las páginas web.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={current.enabled}
                  onChange={(e) => handleChange("enabled", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#22222a] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>
          </div>

          {/* Section: Tipo de Comunicado */}
          <div className="border border-[#222228] bg-[#121216] p-5 space-y-4">
            <h4 className="text-xs font-mono text-amber-400 uppercase tracking-wider flex items-center gap-2 border-b border-[#222228] pb-2">
              <Bell className="w-3.5 h-3.5" />
              <span>Tipo & Estilo Visual del Aviso</span>
            </h4>

            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleChange("type", "urgency")}
                className={`p-3 text-left border rounded-xs transition ${
                  current.type === "urgency"
                    ? "bg-amber-950/40 border-amber-500 text-amber-300"
                    : "bg-[#18181f] border-[#2b2b34] text-neutral-400 hover:text-white"
                }`}
              >
                <div className="text-xs font-bold font-mono uppercase">Urgencia / Alerta</div>
                <div className="text-[10px] text-neutral-500 mt-1">Ámbar cálido para emergencias o mantención</div>
              </button>

              <button
                type="button"
                onClick={() => handleChange("type", "info")}
                className={`p-3 text-left border rounded-xs transition ${
                  current.type === "info"
                    ? "bg-blue-950/40 border-blue-500 text-blue-300"
                    : "bg-[#18181f] border-[#2b2b34] text-neutral-400 hover:text-white"
                }`}
              >
                <div className="text-xs font-bold font-mono uppercase">Informativo</div>
                <div className="text-[10px] text-neutral-500 mt-1">Azul pizarra para feriados y comunicados</div>
              </button>

              <button
                type="button"
                onClick={() => handleChange("type", "promo")}
                className={`p-3 text-left border rounded-xs transition ${
                  current.type === "promo"
                    ? "bg-emerald-950/40 border-emerald-500 text-emerald-300"
                    : "bg-[#18181f] border-[#2b2b34] text-neutral-400 hover:text-white"
                }`}
              >
                <div className="text-xs font-bold font-mono uppercase">Promoción Flash</div>
                <div className="text-[10px] text-neutral-500 mt-1">Esmeralda para cupos limitados y campañas</div>
              </button>
            </div>
          </div>

          {/* Section: Textos y Botón */}
          <div className="border border-[#222228] bg-[#121216] p-5 space-y-4">
            <h4 className="text-xs font-mono text-amber-400 uppercase tracking-wider flex items-center gap-2 border-b border-[#222228] pb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Contenido y Botón de Enlace</span>
            </h4>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                  Kicker / Badge Superior
                </label>
                <input
                  type="text"
                  value={current.badge}
                  onChange={(e) => handleChange("badge", e.target.value)}
                  placeholder="COMUNICADO CLÍNICO"
                  className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                  Mensaje del Comunicado
                </label>
                <textarea
                  rows={3}
                  value={current.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  placeholder="Escribe el aviso médico o de contingencia..."
                  className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs focus:border-amber-500 outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                    Texto del Botón de Acción
                  </label>
                  <input
                    type="text"
                    value={current.buttonText}
                    onChange={(e) => handleChange("buttonText", e.target.value)}
                    placeholder="Consultar por WhatsApp"
                    className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                    URL o Enlace de Destino
                  </label>
                  <input
                    type="text"
                    value={current.buttonUrl}
                    onChange={(e) => handleChange("buttonUrl", e.target.value)}
                    placeholder="https://api.whatsapp.com/... o /#agendar"
                    className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono focus:border-amber-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Interactive Banner Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
            <span className="flex items-center gap-1.5 uppercase tracking-wider text-amber-400 font-bold">
              <Eye className="w-3.5 h-3.5" />
              Previsualización en Vivo
            </span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${current.enabled ? "bg-emerald-950 text-emerald-400" : "bg-neutral-800 text-neutral-400"}`}>
              {current.enabled ? "ACTIVO" : "INACTIVO"}
            </span>
          </div>

          {/* Banner rendering */}
          <div className="border border-[#222228] bg-[#18181f] p-4 rounded space-y-3 shadow-xl">
            <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
              Aspecto exacto en la web pública:
            </div>

            <div
              className={`p-4 rounded-xs border transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                current.type === "urgency"
                  ? "bg-amber-500/10 border-amber-500/40 text-amber-200"
                  : current.type === "promo"
                  ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-200"
                  : "bg-blue-500/10 border-blue-500/40 text-blue-200"
              }`}
            >
              <div className="space-y-1">
                <span
                  className={`text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 rounded inline-block font-bold ${
                    current.type === "urgency"
                      ? "bg-amber-500/20 text-amber-300"
                      : current.type === "promo"
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-blue-500/20 text-blue-300"
                  }`}
                >
                  {current.badge || "AVISO"}
                </span>
                <p className="text-xs font-medium text-white leading-relaxed">
                  {current.message || "Escribe el contenido del comunicado..."}
                </p>
              </div>

              {current.buttonText && (
                <a
                  href={current.buttonUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-3 py-1.5 rounded-xs text-[11px] font-mono uppercase tracking-wider font-bold transition flex items-center gap-1.5 shrink-0 ${
                    current.type === "urgency"
                      ? "bg-amber-500 text-black hover:bg-amber-400"
                      : current.type === "promo"
                      ? "bg-emerald-500 text-black hover:bg-emerald-400"
                      : "bg-blue-600 text-white hover:bg-blue-500"
                  }`}
                >
                  <span>{current.buttonText}</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
