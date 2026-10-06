import { Metadata } from "next";
import { InsuranceSection } from "@/components/dental/InsuranceSection";
import { AppointmentBookingSection } from "@/components/dental/AppointmentBookingSection";

export const metadata: Metadata = {
  title: "Precios, Convenios y Aranceles | Centro Dental BeHappy Ñuñoa",
  description:
    "Precios transparentes, Seguro Dental BeHappy con cobertura del 20% al 60% y opciones de financiamiento en cuotas sin interés y reembolso en Isapres.",
};

export default function PreciosPage() {
  return (
    <div className="bg-[#faf8f5] text-[#141413]">
      {/* Editorial Header */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-3 border-b border-[#e5e0d5]">
        <span className="text-[11px] font-mono tracking-[0.24em] text-[#78736a] uppercase block">
          POLÍTICA ECONÓMICA · TRANSPARENCIA CLÍNICA
        </span>
        <h1 className="text-4xl sm:text-6xl font-normal tracking-[-0.03em] text-[#141413]">
          Precios, Financiamiento y Convenios
        </h1>
        <p className="text-base text-[#66635d] font-light max-w-2xl leading-relaxed">
          En Centro Dental BeHappy creemos en la transparencia médica: diagnósticos honestos, presupuestos cerrados y opciones de financiamiento para que el costo no sea una barrera.
        </p>
      </div>

      {/* 3 Pillars in Clean Architectural Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-[#e5e0d5]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 border border-[#e5e0d5] bg-white divide-y md:divide-y-0 md:divide-x divide-[#e5e0d5]">
          
          <div className="p-8 space-y-4 hover:bg-[#faf8f5] transition-colors">
            <span className="text-[10px] font-mono tracking-[0.2em] text-[#78736a] uppercase block">
              01 · FACILIDADES DE PAGO
            </span>
            <h3 className="text-xl font-normal tracking-tight text-[#141413]">
              Cuotas Sin Interés
            </h3>
            <p className="text-xs sm:text-sm text-[#5d5952] font-light leading-relaxed">
              Pague sus tratamientos con tarjetas de crédito bancarias en cuotas sin interés según promociones activas (Transbank / Webpay Plus).
            </p>
            <ul className="space-y-1.5 text-xs font-mono text-[#78736a] pt-3 border-t border-[#f0ede6]">
              <li>✓ Débito y Crédito (Visa, Mastercard, Amex)</li>
              <li>✓ Transferencias electrónicas inmediatas</li>
              <li>✓ Boleta médica electrónica oficial</li>
            </ul>
          </div>

          <div className="p-8 space-y-4 hover:bg-[#faf8f5] transition-colors">
            <span className="text-[10px] font-mono tracking-[0.2em] text-[#78736a] uppercase block">
              02 · AFILIACIÓN FAMILIAR
            </span>
            <h3 className="text-xl font-normal tracking-tight text-[#141413]">
              Seguro Propio BeHappy
            </h3>
            <p className="text-xs sm:text-sm text-[#5d5952] font-light leading-relaxed">
              Membresía dental anual para pacientes frecuentes y familias con descuentos acumulativos del 20% al 60% en prestaciones clínicas.
            </p>
            <ul className="space-y-1.5 text-xs font-mono text-[#78736a] pt-3 border-t border-[#f0ede6]">
              <li>✓ Año 1: 20% ~ 30% cobertura</li>
              <li>✓ Año 2: 40% cobertura integral</li>
              <li>✓ Año 3+: hasta 60% en arancel clínico</li>
            </ul>
          </div>

          <div className="p-8 space-y-4 hover:bg-[#faf8f5] transition-colors">
            <span className="text-[10px] font-mono tracking-[0.2em] text-[#78736a] uppercase block">
              03 · PREVISIÓN PRIVADA
            </span>
            <h3 className="text-xl font-normal tracking-tight text-[#141413]">
              Isapres & Seguros
            </h3>
            <p className="text-xs sm:text-sm text-[#5d5952] font-light leading-relaxed">
              Emitimos la documentación clínica completa para que solicite el reembolso en su Isapre o seguro de salud complementario.
            </p>
            <ul className="space-y-1.5 text-xs font-mono text-[#78736a] pt-3 border-t border-[#f0ede6]">
              <li>✓ Colmena, Banmédica, Cruz Blanca, Consalud</li>
              <li>✓ Seguros Bice, Metlife, Consorcio, Chilena</li>
              <li>✓ Informes y recetas timbradas</li>
            </ul>
          </div>

        </div>
      </section>

      {/* Insurance Breakdown */}
      <InsuranceSection />

      {/* Booking Desk */}
      <AppointmentBookingSection />
    </div>
  );
}
