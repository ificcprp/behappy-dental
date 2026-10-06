import { Metadata } from "next";
import { TreatmentsSection } from "@/components/dental/TreatmentsSection";
import { EspecialidadesTratamientosCarousel } from "@/components/dental/EspecialidadesTratamientosCarousel";
import { AppointmentBookingSection } from "@/components/dental/AppointmentBookingSection";

export const metadata: Metadata = {
  title: "Tratamientos Odontológicos | Centro Dental BeHappy Ñuñoa",
  description:
    "Explora nuestros tratamientos y procesos de cuidado dental en Ñuñoa: Ortodoncia invisible Invisalign, Implantes dentales, Diseño de sonrisa, Endodoncia, Limpieza y Odontopediatría.",
};

export default function TratamientosPage() {
  return (
    <div className="bg-[#faf8f5] text-[#141413]">
      {/* Editorial Header */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-3 border-b border-[#e5e0d5]">
        <span className="text-[11px] font-mono tracking-[0.24em] text-[#78736a] uppercase block">
          CATÁLOGO CLÍNICO & PROCEDIMIENTOS · SUECIA 3580
        </span>
        <h1 className="text-4xl sm:text-6xl font-normal tracking-[-0.03em] text-[#141413]">
          Tratamientos Odontológicos
        </h1>
        <p className="text-base text-[#66635d] font-light max-w-2xl leading-relaxed">
          Explora nuestros protocolos de intervención, especialidades médicas y procesos de cuidado dental en la comuna de Ñuñoa.
        </p>
      </div>

      {/* Visual Clinical Index Carousel */}
      <EspecialidadesTratamientosCarousel />

      {/* Comprehensive Catalog with Category Filters */}
      <TreatmentsSection />

      {/* Appointment Desk */}
      <AppointmentBookingSection />
    </div>
  );
}
