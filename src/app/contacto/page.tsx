import { Metadata } from "next";
import { CLINIC_INFO, createWhatsAppUrl } from "@/data/clinicInfo";
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

      {/* 4 Direct Contact Channels (Clean Architectural Grid) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-[#e5e0d5]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-[#e5e0d5] bg-white divide-y sm:divide-y-0 sm:divide-x divide-[#e5e0d5]">
          
          <div className="p-8 space-y-3 hover:bg-[#faf8f5] transition-colors">
            <span className="text-[10px] font-mono tracking-[0.2em] text-[#78736a] uppercase block">
              01 · DIRECCIÓN POSTAL
            </span>
            <h3 className="text-lg font-normal tracking-tight text-[#141413]">Sede Ñuñoa</h3>
            <p className="text-xs text-[#5d5952] font-light leading-relaxed">
              Suecia 3580, OF. 304, Ñuñoa, Santiago de Chile. Metro Chile España (L3).
            </p>
          </div>

          <div className="p-8 space-y-3 hover:bg-[#faf8f5] transition-colors">
            <span className="text-[10px] font-mono tracking-[0.2em] text-[#78736a] uppercase block">
              02 · WHATSAPP DIRECTO
            </span>
            <h3 className="text-lg font-normal tracking-tight text-[#141413]">Atención en Línea</h3>
            <p className="text-xs text-[#5d5952] font-light leading-relaxed">
              <a
                href={createWhatsAppUrl("Hola Centro Dental BeHappy, me gustaría agendar una hora de atención.")}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs font-bold text-[#141413] underline underline-offset-4 decoration-1"
              >
                +56 9 4757 8597 ↗
              </a>
              <span className="block text-[11px] text-[#78736a] pt-1">Respuesta inmediata en horario hábil</span>
            </p>
          </div>

          <div className="p-8 space-y-3 hover:bg-[#faf8f5] transition-colors">
            <span className="text-[10px] font-mono tracking-[0.2em] text-[#78736a] uppercase block">
              03 · CORREO OFICIAL
            </span>
            <h3 className="text-lg font-normal tracking-tight text-[#141413]">Dirección Médica</h3>
            <p className="text-xs text-[#5d5952] font-light leading-relaxed">
              <a
                href="mailto:ceobehappy@gmail.com"
                className="font-mono text-xs text-[#141413] underline underline-offset-4 decoration-1"
              >
                ceobehappy@gmail.com ↗
              </a>
              <span className="block text-[11px] text-[#78736a] pt-1">Presupuestos y convenios empresas</span>
            </p>
          </div>

          <div className="p-8 space-y-3 hover:bg-[#faf8f5] transition-colors">
            <span className="text-[10px] font-mono tracking-[0.2em] text-[#78736a] uppercase block">
              04 · REDES CLÍNICAS
            </span>
            <h3 className="text-lg font-normal tracking-tight text-[#141413]">Instagram Oficial</h3>
            <p className="text-xs text-[#5d5952] font-light leading-relaxed">
              <a
                href="https://www.instagram.com/dentalbehappynunoa"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-[#141413] underline underline-offset-4 decoration-1"
              >
                @dentalbehappynunoa ↗
              </a>
              <span className="block text-[11px] text-[#78736a] pt-1">Casos clínicos y cómo llegar</span>
            </p>
          </div>

        </div>
      </section>

      {/* Location Triptych */}
      <LocationHoursSection />

      {/* Appointment Desk */}
      <AppointmentBookingSection />
    </div>
  );
}
