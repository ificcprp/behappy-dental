import { Metadata } from "next";
import { AppointmentBookingSection } from "@/components/dental/AppointmentBookingSection";
import { LocationHoursSection } from "@/components/dental/LocationHoursSection";

export const metadata: Metadata = {
  title: "Contacto y Sede | Centro Dental BeHappy Ñuñoa",
  description:
    "Comunícate con Centro Dental BeHappy en Ñuñoa. Dirección en Suecia 3580, OF. 304. Teléfono y WhatsApp +56 9 4757 8597 y correo ceobehappy@gmail.com.",
};

export default function ContactoPage() {
  return (
    <div className="bg-[#faf8f5] text-[#141413]">
      
      {/* Editorial Header */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-3 border-b border-[#e5e0d5]">
        <span className="text-[11px] font-mono tracking-[0.24em] text-[#78736a] uppercase block">
          CANALES OFICIALES & ADMISIÓN · SUECIA 3580
        </span>
        <h1 className="text-4xl sm:text-6xl font-normal tracking-[-0.03em] text-[#141413]">
          Contacto y Admisión Clínica
        </h1>
        <p className="text-base text-[#66635d] font-light max-w-2xl leading-relaxed">
          Comuníquese con nuestra secretaría médica para resolver inquietudes diagnósticas, solicitar presupuestos de ortodoncia o programar su atención sin esperas.
        </p>
      </div>

      {/* Unified Location & Hours Architectural Triptych */}
      <LocationHoursSection />

      {/* Appointment Desk */}
      <AppointmentBookingSection />
    </div>
  );
}
