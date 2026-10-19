"use client";

import React from "react";
import { CMSWhatsappBooking, DEFAULT_WHATSAPP_BOOKING } from "@/lib/cmsStore";
import { MessageCircle, ShieldCheck, CreditCard, Clock, Phone, RefreshCw, Send, Eye } from "lucide-react";

interface WhatsappBookingEditorProps {
  whatsappBooking: CMSWhatsappBooking;
  onUpdateWhatsappBooking: (updated: CMSWhatsappBooking) => void;
  triggerToast?: (msg: string) => void;
}

export function WhatsappBookingEditor({
  whatsappBooking,
  onUpdateWhatsappBooking,
  triggerToast,
}: WhatsappBookingEditorProps) {
  const current = whatsappBooking || DEFAULT_WHATSAPP_BOOKING;

  const handleChange = <K extends keyof CMSWhatsappBooking>(field: K, value: CMSWhatsappBooking[K]) => {
    onUpdateWhatsappBooking({
      ...current,
      [field]: value,
    });
  };

  const handleReset = () => {
    if (confirm("¿Restablecer todas las plantillas y reglas de WhatsApp a los valores originales?")) {
      onUpdateWhatsappBooking(DEFAULT_WHATSAPP_BOOKING);
      if (triggerToast) triggerToast("✓ Reglas de WhatsApp restauradas");
    }
  };

  // Preview generated WhatsApp message
  const previewMessage = current.bookingConfirmationTemplate
    .replace("{paciente}", "Camila González")
    .replace("{tratamiento}", "Evaluación Diagnóstica")
    .replace("{doctor}", "Dr. Johnny Lugo")
    .replace("{fecha}", "24 de Octubre")
    .replace("{horario}", "11:30 hrs")
    .replace("{telefono}", "+56 9 8765 4321");

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="border border-[#222228] bg-[#121216] p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="text-base font-normal text-white flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Centro de WhatsApp, Conversión & Reglas de Agendamiento</span>
          </h3>
          <p className="text-xs text-neutral-400 font-light mt-0.5">
            Configuración de números de recepción, plantillas de mensajes y políticas de abono previo online.
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
        {/* Left: Settings Form (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Section: Canales Telefónicos */}
          <div className="border border-[#222228] bg-[#121216] p-5 space-y-4">
            <h4 className="text-xs font-mono text-emerald-400 uppercase tracking-wider flex items-center gap-2 border-b border-[#222228] pb-2">
              <Phone className="w-3.5 h-3.5" />
              <span>1. Números Oficiales de Recepción</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                  WhatsApp Principal (Agendamiento & Web)
                </label>
                <input
                  type="text"
                  value={current.whatsappNumber}
                  onChange={(e) => handleChange("whatsappNumber", e.target.value.replace(/\D/g, ""))}
                  placeholder="56947578597"
                  className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-emerald-400 text-xs font-mono focus:border-emerald-500 outline-none"
                />
                <span className="text-[10px] text-neutral-500 font-mono mt-1 block">
                  Formato internacional sin signos: 56947578597
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                  WhatsApp Urgencias / Guardia
                </label>
                <input
                  type="text"
                  value={current.emergencyWhatsappNumber}
                  onChange={(e) => handleChange("emergencyWhatsappNumber", e.target.value.replace(/\D/g, ""))}
                  placeholder="56947578597"
                  className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono focus:border-emerald-500 outline-none"
                />
                <span className="text-[10px] text-neutral-500 font-mono mt-1 block">
                  Para fines de semana o guardia médica
                </span>
              </div>
            </div>
          </div>

          {/* Section: Plantillas de Mensajes */}
          <div className="border border-[#222228] bg-[#121216] p-5 space-y-4">
            <h4 className="text-xs font-mono text-emerald-400 uppercase tracking-wider flex items-center gap-2 border-b border-[#222228] pb-2">
              <Send className="w-3.5 h-3.5" />
              <span>2. Plantillas de Mensajes Clínicos</span>
            </h4>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                  Mensaje del Botón Flotante General
                </label>
                <input
                  type="text"
                  value={current.floatingButtonMessage}
                  onChange={(e) => handleChange("floatingButtonMessage", e.target.value)}
                  placeholder="Hola Centro Dental BeHappy, me gustaría coordinar una hora de atención."
                  className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase">
                    Plantilla Confirmación de Cita Web
                  </label>
                  <span className="text-[10px] font-mono text-neutral-500">
                    Variables: &#123;paciente&#125;, &#123;tratamiento&#125;, &#123;doctor&#125;, &#123;fecha&#125;, &#123;horario&#125;, &#123;telefono&#125;
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={current.bookingConfirmationTemplate}
                  onChange={(e) => handleChange("bookingConfirmationTemplate", e.target.value)}
                  className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs focus:border-emerald-500 outline-none resize-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                  Plantilla Cotización / Más Información de Tratamiento
                </label>
                <input
                  type="text"
                  value={current.quoteTemplate}
                  onChange={(e) => handleChange("quoteTemplate", e.target.value)}
                  placeholder="Hola Centro Dental BeHappy, me gustaría recibir más información y cotizar el tratamiento de *{tratamiento}*."
                  className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs focus:border-emerald-500 outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section: Reglas de Abono y Franjas Horarias */}
          <div className="border border-[#222228] bg-[#121216] p-5 space-y-4">
            <h4 className="text-xs font-mono text-emerald-400 uppercase tracking-wider flex items-center gap-2 border-b border-[#222228] pb-2">
              <CreditCard className="w-3.5 h-3.5" />
              <span>3. Reglas de Abono Webpay (Flow) & Franjas</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                  Monto de Abono para Garantizar Box (CLP)
                </label>
                <input
                  type="number"
                  step={1000}
                  min={0}
                  value={current.depositAmount}
                  onChange={(e) => handleChange("depositAmount", Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono focus:border-emerald-500 outline-none"
                />
                <span className="text-[10px] text-neutral-500 font-mono mt-1 block">
                  Actual: ${current.depositAmount.toLocaleString("es-CL")} CLP
                </span>
              </div>

              <div className="flex flex-col justify-center">
                <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-2">
                  Política de Abono Online
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-200">
                  <input
                    type="checkbox"
                    checked={current.depositRequired}
                    onChange={(e) => handleChange("depositRequired", e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 rounded"
                  />
                  <span>Exigir abono obligatorio para agendar</span>
                </label>
                <span className="text-[10px] text-neutral-500 mt-1">
                  {current.depositRequired
                    ? "El paciente debe pagar el abono para registrar la cita."
                    : "El abono es opcional; el paciente puede confirmar directamente por WhatsApp."}
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                  Franja Horaria Mañana
                </label>
                <input
                  type="text"
                  value={current.timeSlotMorningText}
                  onChange={(e) => handleChange("timeSlotMorningText", e.target.value)}
                  placeholder="Mañana: 10:00 - 14:00"
                  className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                  Franja Horaria Tarde
                </label>
                <input
                  type="text"
                  value={current.timeSlotAfternoonText}
                  onChange={(e) => handleChange("timeSlotAfternoonText", e.target.value)}
                  placeholder="Tarde: 14:00 - 20:00"
                  className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono focus:border-emerald-500 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Interactive WhatsApp Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
            <span className="flex items-center gap-1.5 uppercase tracking-wider text-emerald-400 font-bold">
              <Eye className="w-3.5 h-3.5" />
              Previsualización Chat WhatsApp
            </span>
            <span className="text-[10px] text-neutral-500">Destino: +{current.whatsappNumber}</span>
          </div>

          {/* Smartphone WhatsApp Simulator */}
          <div className="bg-[#0b141a] border border-[#222e35] rounded-xl overflow-hidden shadow-2xl">
            {/* WhatsApp Header */}
            <div className="bg-[#202c33] p-3 flex items-center gap-3 border-b border-[#222e35]">
              <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
                BH
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-white truncate">Centro Dental BeHappy</div>
                <div className="text-[10px] text-emerald-400 font-mono">En línea · Suecia 3580</div>
              </div>
            </div>

            {/* Chat Body */}
            <div className="p-4 space-y-3 min-h-[260px] bg-[radial-gradient(#1f2c34_1px,transparent_1px)] [background-size:16px_16px] flex flex-col justify-end">
              {/* Patient Message Bubble */}
              <div className="self-end max-w-[85%] bg-[#005c4b] text-white p-3 rounded-lg rounded-tr-none text-xs leading-relaxed space-y-1 shadow-md">
                <p className="whitespace-pre-line font-sans">{previewMessage}</p>
                <div className="text-[9px] text-emerald-200 text-right font-mono flex items-center justify-end gap-1">
                  <span>10:42</span>
                  <span>✓✓</span>
                </div>
              </div>

              {/* Bot / Receptionist Response preview */}
              <div className="self-start max-w-[85%] bg-[#202c33] text-neutral-200 p-3 rounded-lg rounded-tl-none text-xs leading-relaxed shadow-md">
                <p>
                  ¡Hola Camila! Recibimos tu solicitud para Evaluación Diagnóstica con el Dr. Johnny Lugo. En breve te contactamos para confirmar tu box dental.
                </p>
                <div className="text-[9px] text-neutral-400 text-right font-mono">10:43</div>
              </div>
            </div>

            {/* Simulator Footer */}
            <div className="bg-[#202c33] p-2.5 text-center text-[10px] font-mono text-neutral-400 border-t border-[#222e35]">
              Abono configurado: ${current.depositAmount.toLocaleString("es-CL")} CLP ({current.depositRequired ? "Obligatorio" : "Opcional"})
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
