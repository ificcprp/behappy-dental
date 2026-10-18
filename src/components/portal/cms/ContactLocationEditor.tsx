"use client";

import React from "react";
import { CLINIC_INFO } from "@/data/clinicInfo";
import { PhoneCall, MapPin, Clock, Mail, Navigation } from "lucide-react";

interface ContactLocationEditorProps {
  clinicInfo: typeof CLINIC_INFO;
  onUpdateClinicInfo: (updated: typeof CLINIC_INFO) => void;
  onSave: () => void;
}

function deriveAddress(address: typeof CLINIC_INFO.address): typeof CLINIC_INFO.address {
  const full = [address.street, address.commune, address.city, address.region, address.country]
    .filter((part) => part && part.trim() !== "")
    .join(", ");
  const mapQuery = `${address.street}${address.commune ? ", " + address.commune : ""}`.trim();
  const directQuery = `${address.street} ${address.commune} ${address.city}`.trim();

  return {
    ...address,
    full,
    googleMapsEmbedUrl: mapQuery
      ? `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&t=m&z=15&ie=UTF8&output=embed`
      : address.googleMapsEmbedUrl,
    googleMapsDirectUrl: directQuery
      ? `https://maps.google.com/?q=${encodeURIComponent(directQuery)}`
      : address.googleMapsDirectUrl,
  };
}

export function ContactLocationEditor({
  clinicInfo,
  onUpdateClinicInfo,
  onSave,
}: ContactLocationEditorProps) {
  const current = clinicInfo || CLINIC_INFO;

  const handleContactChange = (field: keyof typeof CLINIC_INFO.contact, value: string) => {
    const nextContact = {
      ...current.contact,
      [field]: value,
    };
    if (field === "phone") {
      nextContact.phoneClean = value.replace(/[^0-9]/g, "");
    }
    if (field === "whatsappNumber") {
      nextContact.whatsappNumber = value.replace(/[^0-9]/g, "");
    }
    onUpdateClinicInfo({
      ...current,
      contact: nextContact,
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

  const handleAddressPartChange = (
    field: "street" | "commune" | "city" | "country",
    value: string
  ) => {
    onUpdateClinicInfo({
      ...current,
      address: deriveAddress({
        ...current.address,
        [field]: value,
      }),
    });
  };

  const handleAddressFullChange = (value: string) => {
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
            Teléfono Visible al Público
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
          <p className="text-[10px] text-slate-500 font-light mt-1">
            Este número alimenta todos los botones de WhatsApp del sitio (navbar, tratamientos, club, presupuestos y botón flotante).
          </p>
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
          <label className="block text-[11px] font-mono text-slate-600 uppercase mb-1 font-bold">
            Instagram Oficial (URL)
          </label>
          <input
            type="text"
            value={current.contact?.instagram || ""}
            onChange={(e) => handleContactChange("instagram", e.target.value)}
            placeholder="https://www.instagram.com/dentalbehappynunoa"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono rounded focus:bg-white focus:border-slate-800 outline-none"
          />
        </div>
      </div>

      <div className="space-y-4 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-slate-400" />
          <h4 className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider">
            Dirección Oficial de la Clínica
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-mono text-slate-600 uppercase mb-1 font-bold">
              Calle y Número / Oficina
            </label>
            <input
              type="text"
              value={current.address?.street || ""}
              placeholder="Suecia 3580, OF. 304"
              onChange={(e) => handleAddressPartChange("street", e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded focus:bg-white focus:border-slate-800 outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-600 uppercase mb-1 font-bold">
              Comuna
            </label>
            <input
              type="text"
              value={current.address?.commune || ""}
              placeholder="Ñuñoa"
              onChange={(e) => handleAddressPartChange("commune", e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded focus:bg-white focus:border-slate-800 outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-600 uppercase mb-1 font-bold">
              Ciudad
            </label>
            <input
              type="text"
              value={current.address?.city || ""}
              placeholder="Santiago"
              onChange={(e) => handleAddressPartChange("city", e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded focus:bg-white focus:border-slate-800 outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-600 uppercase mb-1 font-bold">
              País
            </label>
            <input
              type="text"
              value={current.address?.country || ""}
              placeholder="Chile"
              onChange={(e) => handleAddressPartChange("country", e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded focus:bg-white focus:border-slate-800 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-mono text-slate-600 uppercase mb-1 font-bold">
            Dirección Completa Publicada (footer, mapa y ficha)
          </label>
          <input
            type="text"
            value={current.address?.full || ""}
            onChange={(e) => handleAddressFullChange(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded focus:bg-white focus:border-slate-800 outline-none"
          />
          <p className="text-[10px] text-slate-500 font-light mt-1">
            Se autogenera al editar calle, comuna, ciudad y país. Puedes ajustarla manualmente si necesitas un formato especial.
          </p>
        </div>
      </div>

      <div className="space-y-4 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400" />
          <h4 className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider">
            Horarios de Atención
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-mono text-slate-600 uppercase mb-1 font-bold">
              Lunes a Viernes
            </label>
            <input
              type="text"
              value={current.hours?.weekdays || ""}
              placeholder="Lunes ~ Viernes: 10:00 - 20:00"
              onChange={(e) => handleHoursChange("weekdays", e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono rounded focus:bg-white focus:border-slate-800 outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-600 uppercase mb-1 font-bold">
              Sábado
            </label>
            <input
              type="text"
              value={current.hours?.saturday || ""}
              placeholder="Sábado: 10:00 - 18:00"
              onChange={(e) => handleHoursChange("saturday", e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono rounded focus:bg-white focus:border-slate-800 outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-600 uppercase mb-1 font-bold">
              Domingos y Feriados
            </label>
            <input
              type="text"
              value={current.hours?.sunday || ""}
              placeholder="Domingos y feriados: Cerrado"
              onChange={(e) => handleHoursChange("sunday", e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono rounded focus:bg-white focus:border-slate-800 outline-none"
            />
          </div>
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
