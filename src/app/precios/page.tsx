import { Metadata } from "next";
import { DentalPricingCalculator } from "@/components/dental/DentalPricingCalculator";
import { AppointmentBookingSection } from "@/components/dental/AppointmentBookingSection";
import { ArrowUpRight, Shield, CreditCard, Receipt } from "lucide-react";
import { createWhatsAppUrl } from "@/data/clinicInfo";

export const metadata: Metadata = {
  title: "Precios, Convenios y Aranceles | Centro Dental BeHappy Ñuñoa",
  description:
    "Precios transparentes y simulador de copago en Ñuñoa. Seguro Dental BeHappy con cobertura del 20% al 60%, cuotas sin interés y reembolso en Isapres.",
};

export default function PreciosPage() {
  return (
    <div className="bg-[#faf8f5] text-[#141413]">
      
      {/* Editorial Header */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-3 border-b border-[#e5e0d5]">
        <span className="text-[11px] font-mono tracking-[0.24em] text-[#78736a] uppercase block">
          POLÍTICA ECONÓMICA · TRANSPARENCIA MÉDICA
        </span>
        <h1 className="text-4xl sm:text-6xl font-normal tracking-[-0.03em] text-[#141413]">
          Precios, Financiamiento y Convenios
        </h1>
        <p className="text-base text-[#66635d] font-light max-w-2xl leading-relaxed">
          En Centro Dental BeHappy creemos en la transparencia médica: diagnósticos honestos, presupuestos cerrados y opciones de financiamiento para que el costo no sea una barrera.
        </p>
      </div>

      {/* Interactive Copay & Previsión Calculator (State-of-the-Art) */}
      <DentalPricingCalculator />

      {/* 3 Pillars in Clean Architectural Grid (Unified without duplicates) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-[#e5e0d5]">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="space-y-2">
            <span className="text-[11px] font-mono tracking-[0.22em] text-[#78736a] uppercase block">
              FACILIDADES & CANALES DE PAGO
            </span>
            <h2 className="text-2xl sm:text-3xl font-normal tracking-tight text-[#141413]">
              Tres pilares de acceso económico sin sorpresas
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 border border-[#e5e0d5] bg-white divide-y md:divide-y-0 md:divide-x divide-[#e5e0d5]">
            
            {/* Pillar 1: Cuotas */}
            <div className="p-8 space-y-4 hover:bg-[#faf8f5] transition-colors flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded border border-[#e5e0d5] bg-[#faf8f5] flex items-center justify-center text-[#141413]">
                  <CreditCard className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono tracking-[0.2em] text-[#78736a] uppercase block">
                  01 · TARJETAS BANCARIAS
                </span>
                <h3 className="text-xl font-normal tracking-tight text-[#141413]">
                  Hasta 12 Cuotas Sin Interés
                </h3>
                <p className="text-xs sm:text-sm text-[#5d5952] font-light leading-relaxed">
                  Financie sus tratamientos de ortodoncia, implantes o estética en cuotas mediante Transbank / Webpay Plus con sus tarjetas de crédito bancarias.
                </p>
                <ul className="space-y-1.5 text-xs font-mono text-[#78736a] pt-3 border-t border-[#f0ede6]">
                  <li>✓ Débito y Crédito (Visa, Mastercard, Amex)</li>
                  <li>✓ Transferencias electrónicas inmediatas</li>
                  <li>✓ Boleta médica electrónica oficial</li>
                </ul>
              </div>

              <div className="pt-4">
                <a
                  href={createWhatsAppUrl("Hola Centro Dental BeHappy, me gustaría consultar por las opciones de financiamiento en cuotas.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-mono tracking-wider uppercase text-[#141413] font-semibold underline underline-offset-4"
                >
                  Consultar cuotas por WhatsApp <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Pillar 2: Seguro BeHappy */}
            <div className="p-8 space-y-4 hover:bg-[#faf8f5] transition-colors flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded border border-[#e5e0d5] bg-[#faf8f5] flex items-center justify-center text-[#141413]">
                  <Shield className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono tracking-[0.2em] text-[#78736a] uppercase block">
                  02 · PLAN FAMILIAR
                </span>
                <h3 className="text-xl font-normal tracking-tight text-[#141413]">
                  Seguro Dental Propio BeHappy
                </h3>
                <p className="text-xs sm:text-sm text-[#5d5952] font-light leading-relaxed">
                  Membresía anual para pacientes frecuentes y familias con descuentos acumulativos del 20% al 60% en prestaciones clínicas, sin letra chica ni copagos abusivos.
                </p>
                <ul className="space-y-1.5 text-xs font-mono text-[#78736a] pt-3 border-t border-[#f0ede6]">
                  <li>✓ Año 1: 20% ~ 30% cobertura</li>
                  <li>✓ Año 2: 40% cobertura integral</li>
                  <li>✓ Año 3+: hasta 60% en arancel clínico</li>
                </ul>
              </div>

              <div className="pt-4">
                <a
                  href={createWhatsAppUrl("Hola Centro Dental BeHappy, deseo activar mi Seguro Dental Familiar.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-mono tracking-wider uppercase text-[#141413] font-semibold underline underline-offset-4"
                >
                  Activar Membresía Familiar <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Pillar 3: Reembolsos Isapre */}
            <div className="p-8 space-y-4 hover:bg-[#faf8f5] transition-colors flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded border border-[#e5e0d5] bg-[#faf8f5] flex items-center justify-center text-[#141413]">
                  <Receipt className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono tracking-[0.2em] text-[#78736a] uppercase block">
                  03 · REEMBOLSO PREVISIONAL
                </span>
                <h3 className="text-xl font-normal tracking-tight text-[#141413]">
                  Isapres & Seguros Complementarios
                </h3>
                <p className="text-xs sm:text-sm text-[#5d5952] font-light leading-relaxed">
                  Emitimos toda la documentación clínica, diagnósticos CIE-10 y presupuestos timbrados para que solicite el reembolso directo en su Isapre o seguro colectivo de empresa.
                </p>
                <ul className="space-y-1.5 text-xs font-mono text-[#78736a] pt-3 border-t border-[#f0ede6]">
                  <li>✓ Colmena, Banmédica, Cruz Blanca, Consalud</li>
                  <li>✓ Seguros Bice, Metlife, Consorcio, Chilena</li>
                  <li>✓ Informes y recetas médicas oficiales</li>
                </ul>
              </div>

              <div className="pt-4">
                <a
                  href={createWhatsAppUrl("Hola Centro Dental BeHappy, necesito consultar por informes de reembolso Isapre.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-mono tracking-wider uppercase text-[#141413] font-semibold underline underline-offset-4"
                >
                  Solicitar informe previsional <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Unified Booking Desk */}
      <AppointmentBookingSection />
    </div>
  );
}
