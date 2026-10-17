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
    <div className="border border-slate-200 bg-white p-6 rounded-lg shadow-xs space-y-6">
      <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-amber-500" />
            <span>Canales Oficiales, Ubicación & Horarios de Box</span>
          </h3>
          <p className="text-xs text-slate-600 font-light mt-0.5">
            Datos de contacto oficiales que alimentan el footer, navbar, mapa y enlaces de agendamiento.
          </p>
        </div>
        <span className="text-[10px] font-mono text-amber-800 border border-amber-200 bg-amber-50 px-2.5 py-1 rounded font-bold uppercase">
          SECCIÓN 7 · CORE DATA
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] font-mono text-slate-600 uppercase mb-1 font-bold">
            WhatsApp Visible al Público
          </label>
          <input
            type="text"
            value={current.contact?.phone || "+56 9 4757 8597"}
            onChange={(e) => handleContactChange("phone", e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono rounded focus:bg-white focus:border-slate-800 outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono text-slate-600 uppercase mb-1 font-bold">
            Número Internacional Limpio (Links WhatsApp API)
          </label>
          <input
            type="text"
            value={current.contact?.whatsappNumber || "56947578597"}
            onChange={(e) => handleContactChange("whatsappNumber", e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono rounded focus:bg-white focus:border-slate-800 outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono text-slate-600 uppercase mb-1 flex items-center gap-1 font-bold">
            <Mail className="w-3.5 h-3.5 text-slate-400" />
            <span>Correo Electrónico Oficial</span>
          </label>
          <input
            type="email"
            value={current.contact?.email || "contacto@behappydental.cl"}
            onChange={(e) => handleContactChange("email", e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono rounded focus:bg-white focus:border-slate-800 outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono text-slate-600 uppercase mb-1 flex items-center gap-1 font-bold">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>Dirección Oficial de la Clínica</span>
          </label>
          <input
            type="text"
            value={current.address?.full || "Suecia 3580, of. 304, Ñuñoa, Santiago"}
            onChange={(e) => handleAddressChange(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded focus:bg-white focus:border-slate-800 outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono text-slate-600 uppercase mb-1 flex items-center gap-1 font-bold">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Horario Lunes a Viernes</span>
          </label>
          <input
            type="text"
            value={current.hours?.weekdays || "09:00 - 20:00 hrs"}
            onChange={(e) => handleHoursChange("weekdays", e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono rounded focus:bg-white focus:border-slate-800 outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono text-slate-600 uppercase mb-1 flex items-center gap-1 font-bold">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Horario Sábados</span>
          </label>
          <input
            type="text"
            value={current.hours?.saturday || "09:00 - 14:00 hrs"}
            onChange={(e) => handleHoursChange("saturday", e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono rounded focus:bg-white focus:border-slate-800 outline-none"
          />
        </div>
      </div>

      {/* Metro & Location guide hint */}
      <div className="p-3 bg-purple-50 border border-purple-200 rounded-md flex items-center gap-2 text-xs font-mono text-purple-900">
        <Navigation className="w-4 h-4 text-purple-600 shrink-0" />
        <span>
          Referencia de acceso: <strong>Metro Chile España (Línea 3)</strong> a 150 metros. Suecia casi esquina Simón Bolívar.
        </span>
      </div>

      <div className="pt-2 flex justify-end">
        <button
          onClick={onSave}
          className="px-6 py-2.5 bg-slate-900 text-white font-bold font-mono text-xs uppercase tracking-wider rounded hover:bg-slate-800 transition shadow-xs cursor-pointer"
        >
          Guardar Canales & Horarios
        </button>
      </div>
    </div>
  );
}
