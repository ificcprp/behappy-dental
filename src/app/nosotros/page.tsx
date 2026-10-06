import { Metadata } from "next";
import Image from "next/image";
import { DoctorsSection } from "@/components/dental/DoctorsSection";
import { AppointmentBookingSection } from "@/components/dental/AppointmentBookingSection";

export const metadata: Metadata = {
  title: "Cuerpo Médico & Filosofía | Centro Dental BeHappy Ñuñoa",
  description:
    "Conoce al equipo de 8 especialistas de Centro Dental BeHappy en Ñuñoa. Más de 13 años de experiencia clínica en ortodoncia, estética dental, implantes y odontopediatría.",
};

export default function NosotrosPage() {
  return (
    <div className="bg-[#faf8f5] text-[#141413]">
      {/* Editorial Header */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-3 border-b border-[#e5e0d5]">
        <span className="text-[11px] font-mono tracking-[0.24em] text-[#78736a] uppercase block">
          TRAYECTORIA INSTITUCIONAL & FILOSOFÍA MÉDICA
        </span>
        <h1 className="text-4xl sm:text-6xl font-normal tracking-[-0.03em] text-[#141413]">
          Cuerpo Médico y Vocación Clínica
        </h1>
        <p className="text-base text-[#66635d] font-light max-w-2xl leading-relaxed">
          Más de 13 años brindando salud bucal y armonía facial en la comuna de Ñuñoa bajo un estándar ético, riguroso y libre de ansiedad.
        </p>
      </div>

      {/* Philosophy Section in Warm Editorial Paper */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-[#e5e0d5]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <span className="text-[10px] font-mono tracking-[0.2em] text-[#78736a] uppercase block">
              HISTORIA & COMPROMISO
            </span>
            <h2 className="text-2xl sm:text-4xl font-normal tracking-tight text-[#141413] leading-tight">
              Más de 13 años de práctica continuada en Suecia 3580, Ñuñoa.
            </h2>
            <div className="space-y-4 text-xs sm:text-sm text-[#5d5952] font-light leading-relaxed">
              <p>
                En <strong className="text-[#141413] font-medium">Centro Dental BeHappy</strong> entendemos que la visita al dentista exige confianza irrestricta. Por ello, cimentamos nuestra práctica en tres pilares: <strong className="text-[#141413]">diagnóstico preciso con imagenología digital</strong>, <strong className="text-[#141413]">procedimientos indoloros</strong> y una relación de continuidad médica con cada paciente.
              </p>
              <p>
                Nuestro directorio médico reúne a 8 especialistas de posgrado con dedicación exclusiva en ortodoncia invisible Invisalign, implantología ósea guiada, estética restauradora con carillas, endodoncia mecanizada y odontopediatría preventiva.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative h-72 sm:h-80 rounded-[2px] overflow-hidden border border-[#ded9cd] bg-[#e8e4db] shadow-sm">
              <Image
                src="/images/clinic-interior.jpg"
                alt="Instalaciones de Centro Dental BeHappy en Ñuñoa"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-3 right-3 bg-[#141413]/85 text-[#f5f2eb] px-3 py-1.5 text-[10px] font-mono tracking-widest uppercase">
                Box Clínico 01 · Suecia 3580
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Full 8-Doctor Showcase */}
      <DoctorsSection />

      {/* Booking Desk */}
      <AppointmentBookingSection />
    </div>
  );
}
