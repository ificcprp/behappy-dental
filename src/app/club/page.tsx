import { Metadata } from "next";
import { MembershipPlansSection } from "@/components/dental/MembershipPlansSection";
import { DentalPricingCalculator } from "@/components/dental/DentalPricingCalculator";
import { AppointmentBookingSection } from "@/components/dental/AppointmentBookingSection";
import { ShieldCheck, ArrowUpRight, CheckCircle2, Heart } from "lucide-react";
import { createWhatsAppUrl } from "@/data/clinicInfo";

export const metadata: Metadata = {
  title: "Club BeHappy | Planes de Membresía y Suscripción Dental Familiar Ñuñoa",
  description:
    "Suscripción dental con débito automático PAC/PAT vía Flow.cl. 2 limpiezas anuales $0 copago, set de radiografías digitales y hasta 50% de arancel preferente en Ñuñoa.",
};

export default function ClubPage() {
  return (
    <div className="bg-[#faf8f5] text-[#141413]">
      
      {/* Editorial Hero Header */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-4 border-b border-[#e5e0d5]">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#f0ede6] border border-[#e5e0d5] text-[11px] font-mono tracking-[0.22em] text-[#78736a] uppercase">
          <ShieldCheck className="w-3.5 h-3.5 text-[#141413]" />
          ODONTOLOGÍA RECURRENTE & TRANSPARENTE
        </div>
        <h1 className="text-4xl sm:text-6xl font-normal tracking-[-0.03em] text-[#141413]">
          Planes y Membresías Club BeHappy
        </h1>
        <p className="text-base sm:text-lg text-[#66635d] font-light max-w-3xl leading-relaxed">
          Diseñado para quienes buscan cuidar su sonrisa y la de su familia con un costo mensual fijo y predecible. Sin copagos imprevistos, sin letra chica y con atención personalizada en Suecia 3580, Ñuñoa.
        </p>

        {/* 3 Quick Bullets */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#e5e0d5]">
          <div className="flex items-center gap-2 text-xs font-mono text-[#403e3a]">
            <CheckCircle2 className="w-4 h-4 text-[#2e7d32]" />
            <span>2 Limpiezas y Radiografías con $0 copago</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#403e3a]">
            <CheckCircle2 className="w-4 h-4 text-[#2e7d32]" />
            <span>Débito automático mensual con Flow.cl</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#403e3a]">
            <CheckCircle2 className="w-4 h-4 text-[#2e7d32]" />
            <span>Sin permanencia obligatoria · Cancela libremente</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Membership Plans (Live CMS Reactive) */}
      <MembershipPlansSection />

      {/* Copay & Previsión Calculator for specific treatments */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-b border-[#e5e0d5]">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="space-y-2">
            <span className="text-[11px] font-mono tracking-[0.22em] text-[#78736a] uppercase block">
              SIMULADOR DE TRATAMIENTOS ADICIONALES
            </span>
            <h2 className="text-2xl sm:text-3xl font-normal tracking-tight text-[#141413]">
              Calcula el arancel preferente con tu membresía activa
            </h2>
            <p className="text-xs sm:text-sm text-[#66635d] font-light max-w-2xl leading-relaxed">
              Los miembros del Club BeHappy acceden a un 40% a 55% de arancel preferente en resinas, ortodoncia, endodoncia e implantes. Compara el costo con y sin previsión.
            </p>
          </div>

          <DentalPricingCalculator />
        </div>
      </section>

      {/* Booking and Contact Section */}
      <AppointmentBookingSection />
    </div>
  );
}
