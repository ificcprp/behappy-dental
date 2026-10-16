"use client";

import React from "react";
import { CLINIC_INFO } from "@/data/clinicInfo";
import { PhoneCall, MapPin, Clock, Mail, Navigation } from "lucide-react";

interface ContactLocationEditorProps {
  clinicInfo: typeof CLINIC_INFO;
  onUpdateClinicInfo: (updated: typeof CLINIC_INFO) => void;
  onSave: () => void;
}

export function ContactLocationEditor({
  clinicInfo,
  onUpdateClinicInfo,
  onSave,
}: ContactLocationEditorProps) {
  const current = clinicInfo || CLINIC_INFO;

  const handleContactChange = (field: keyof typeof CLINIC_INFO.contact, value: string) => {
    onUpdateClinicInfo({
      ...current,
      contact: {
        ...current.contact,
        [field]: value,
      },
    });
  };

  const handleHoursChange = (field: keyof typeof CLINIC_INFO.hours, value: string) => {
    onUpdateClinicInfo({
      ...current,
      hours: {
        ...current.hours,
        [field]: value,
      },
    });
  };

  const handleAddressChange = (value: string) => {
    onUpdateClinicInfo({
      ...current,
      address: {
        ...current.address,
        full: value,
      },
    });
  };

  return (
    <div className="border border-[#222228] bg-[#121216] p-6 space-y-6">
      <div className="border-b border-[#222228] pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-base font-normal text-white flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-amber-400" />
            <span>Canales Oficiales, Ubicación & Horarios de Box</span>
          </h3>
          <p className="text-xs text-neutral-400 font-light mt-0.5">
            Datos de contacto oficiales que alimentan el footer, navbar, mapa y enlaces de agendamiento.
          </p>
        </div>
        <span className="text-[10px] font-mono text-amber-400 border border-amber-800/60 bg-amber-950/30 px-2.5 py-1">
          SECCIÓN 7 · CORE DATA
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
            WhatsApp Visible al Público
          </label>
          <input
            type="text"
            value={current.contact?.phone || "+56 9 4757 8597"}
            onChange={(e) => handleContactChange("phone", e.target.value)}
            className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
            Número Internacional Limpio (Links WhatsApp API)
          </label>
          <input
            type="text"
            value={current.contact?.whatsappNumber || "56947578597"}
            onChange={(e) => handleContactChange("whatsappNumber", e.target.value)}
            className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1 flex items-center gap-1">
            <Mail className="w-3.5 h-3.5 text-neutral-500" />
            <span>Correo Electrónico Oficial</span>
          </label>
          <input
            type="email"
            value={current.contact?.email || "contacto@behappydental.cl"}
            onChange={(e) => handleContactChange("email", e.target.value)}
            className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-neutral-500" />
            <span>Dirección Oficial de la Clínica</span>
          </label>
          <input
            type="text"
            value={current.address?.full || "Suecia 3580, of. 304, Ñuñoa, Santiago"}
            onChange={(e) => handleAddressChange(e.target.value)}
            className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-neutral-500" />
            <span>Horario Lunes a Viernes</span>
          </label>
          <input
            type="text"
            value={current.hours?.weekdays || "09:00 - 20:00 hrs"}
            onChange={(e) => handleHoursChange("weekdays", e.target.value)}
            className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-neutral-500" />
            <span>Horario Sábados</span>
          </label>
          <input
            type="text"
            value={current.hours?.saturday || "09:00 - 14:00 hrs"}
            onChange={(e) => handleHoursChange("saturday", e.target.value)}
            className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono"
          />
        </div>
      </div>

      {/* Metro & Location guide hint */}
      <div className="p-3 bg-[#15151b] border border-[#222228] flex items-center gap-2 text-xs font-mono text-neutral-400">
        <Navigation className="w-4 h-4 text-purple-400 shrink-0" />
        <span>
          Referencia de acceso: <strong>Metro Chile España (Línea 3)</strong> a 150 metros. Suecia casi esquina Simón Bolívar.
        </span>
      </div>

      <div className="pt-2 flex justify-end">
        <button
          onClick={onSave}
          className="px-6 py-2.5 bg-white text-black font-bold font-mono text-xs uppercase tracking-wider hover:bg-neutral-200 transition"
        >
          Guardar Canales & Horarios
        </button>
      </div>
    </div>
  );
}
