"use client";

import React, { useState } from "react";
import { Calculator, Check, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

interface ProcedurePrice {
  id: string;
  name: string;
  marketPrice: number;
  convenioDiscountPercent: number;
  fonasaEstimateCoverage: number;
  isapreEstimateCoverage: number;
  category: string;
  notes: string;
}

const PROCEDURES: ProcedurePrice[] = [
  {
    id: "evaluacion",
    name: "Evaluación Diagnóstica + Radiografía Digital",
    marketPrice: 35000,
    convenioDiscountPercent: 100, // 100% bonificado en membresía anual
    fonasaEstimateCoverage: 5000,
    isapreEstimateCoverage: 12000,
    category: "Diagnóstico",
    notes: "Cámara intraoral y Rx periapical de alta resolución."
  },
  {
    id: "limpieza",
    name: "Limpieza con Ultrasonido (Destartraje + Profilaxis)",
    marketPrice: 55000,
    convenioDiscountPercent: 50,
    fonasaEstimateCoverage: 8000,
    isapreEstimateCoverage: 20000,
    category: "Prevención",
    notes: "Remoción de sarro supragingival y pulido con flúor."
  },
  {
    id: "resina",
    name: "Restauración Estética Resina (Tapadura 1 cara)",
    marketPrice: 65000,
    convenioDiscountPercent: 40,
    fonasaEstimateCoverage: 12000,
    isapreEstimateCoverage: 25000,
    category: "Restauradora",
    notes: "Resina nanohíbrida del color exacto del diente."
  },
  {
    id: "blanqueamiento",
    name: "Blanqueamiento Led Clínico en Box",
    marketPrice: 190000,
    convenioDiscountPercent: 35,
    fonasaEstimateCoverage: 0,
    isapreEstimateCoverage: 0,
    category: "Estética",
    notes: "Aclaramiento en 1 sesión de 60 min sin dañar esmalte."
  },
  {
    id: "invisalign",
    name: "Ortodoncia Invisible Invisalign (Control Mensual)",
    marketPrice: 85000,
    convenioDiscountPercent: 30,
    fonasaEstimateCoverage: 0,
    isapreEstimateCoverage: 25000,
    category: "Ortodoncia",
    notes: "Alineadores transparentes certificados con Dr. Lugo."
  },
  {
    id: "implante",
    name: "Implante de Titanio Osteointegrado",
    marketPrice: 650000,
    convenioDiscountPercent: 25,
    fonasaEstimateCoverage: 0,
    isapreEstimateCoverage: 120000,
    category: "Implantología",
    notes: "Perno de titanio grado médico con cirugía guiada."
  },
  {
    id: "endodoncia",
    name: "Endodoncia Mecanizada (Tratamiento de Conducto)",
    marketPrice: 180000,
    convenioDiscountPercent: 30,
    fonasaEstimateCoverage: 25000,
    isapreEstimateCoverage: 70000,
    category: "Especialidad",
    notes: "Instrumentación rotatoria con odontólogo especialista."
  }
];

export function DentalPricingCalculator() {
  const [selectedProcedureId, setSelectedProcedureId] = useState<string>("evaluacion");
  const [prevision, setPrevision] = useState<"particular" | "fonasa" | "isapre">("isapre");
  const [hasConvenio, setHasConvenio] = useState<boolean>(true);

  const procedure = PROCEDURES.find((p) => p.id === selectedProcedureId) || PROCEDURES[0];

  // Calculations
  const market = procedure.marketPrice;
  const convenioDiscountAmount = hasConvenio ? Math.round(market * (procedure.convenioDiscountPercent / 100)) : 0;
  
  let previsionCoverageAmount = 0;
  if (prevision === "fonasa") {
    previsionCoverageAmount = procedure.fonasaEstimateCoverage;
  } else if (prevision === "isapre") {
    previsionCoverageAmount = procedure.isapreEstimateCoverage;
  }

  // Final estimate copay
  const estimatedCopay = Math.max(0, market - convenioDiscountAmount - previsionCoverageAmount);
  const totalSavings = (market - estimatedCopay);

  const handleBookWithPrice = () => {
    const bookingEl = document.getElementById("agendar");
    if (bookingEl) {
      bookingEl.scrollIntoView({ behavior: "smooth" });
      window.dispatchEvent(
        new CustomEvent("behappy_triage_selected", {
          detail: { treatmentName: procedure.name }
        })
      );
    }
  };

  return (
    <section className="py-20 bg-white text-[#141413] border-b border-[#e5e0d5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="space-y-3 text-center max-w-3xl mx-auto">
          <span className="text-[11px] font-mono tracking-[0.24em] text-[#78736a] uppercase block">
            HERRAMIENTA DE TRANSPARENCIA MÉDICA
          </span>
          <h2 className="text-3xl sm:text-5xl font-normal tracking-[-0.03em] text-[#141413]">
            Simulador de Arancel & Copago
          </h2>
          <p className="text-sm sm:text-base text-[#66635d] font-light leading-relaxed">
            Sin presupuestos sorpresa. Calcula el copago estimado de tu prestación según tu sistema de salud y el descuento del Convenio Familiar BeHappy.
          </p>
        </div>

        {/* Calculator Widget Box */}
        <div className="border border-[#e5e0d5] bg-[#faf8f5] p-6 sm:p-10 rounded-[2px] shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Controls Column (Left) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1: Previsión */}
            <div className="space-y-2">
              <label className="block text-[11px] font-mono tracking-wider uppercase text-[#141413] font-bold">
                1. Selecciona tu Sistema de Previsión
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "isapre", label: "Isapre (Reembolso)" },
                  { id: "fonasa", label: "Fonasa (MLE)" },
                  { id: "particular", label: "Particular" }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPrevision(item.id as any)}
                    className={`py-2.5 px-2 text-xs font-mono rounded-[2px] border transition text-center ${
                      prevision === item.id
                        ? "bg-[#141413] text-[#faf8f5] border-[#141413] font-bold"
                        : "bg-white text-[#141413] border-[#ded9cd] hover:border-[#141413]"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Procedimiento */}
            <div className="space-y-2">
              <label className="block text-[11px] font-mono tracking-wider uppercase text-[#141413] font-bold">
                2. Prestación o Tratamiento Odontológico
              </label>
              <select
                value={selectedProcedureId}
                onChange={(e) => setSelectedProcedureId(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-[#ded9cd] text-[#141413] text-xs font-mono rounded-[2px] focus:outline-none focus:border-[#141413]"
              >
                {PROCEDURES.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} · ({p.category})
                  </option>
                ))}
              </select>
              <span className="text-[11px] text-[#78736a] font-light block">
                {procedure.notes}
              </span>
            </div>

            {/* Step 3: Convenio Toggle */}
            <div className="p-4 bg-white border border-[#ded9cd] rounded-[2px] flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-[#141413] block">
                  Aplicar Convenio Dental Familiar BeHappy
                </span>
                <span className="text-[11px] text-[#66635d] font-light block">
                  Membresía anual con ahorro del 20% al 60% en todos los aranceles.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setHasConvenio(!hasConvenio)}
                className={`px-4 py-1.5 text-xs font-mono uppercase font-bold rounded-[2px] transition ${
                  hasConvenio
                    ? "bg-emerald-600 text-white"
                    : "bg-neutral-200 text-neutral-700"
                }`}
              >
                {hasConvenio ? "✓ Activo" : "Inactivo"}
              </button>
            </div>

            {/* Payment facilities tags */}
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-[#78736a] pt-2">
              <span>💳 Hasta 12 cuotas sin interés con Transbank / Webpay</span>
              <span>·</span>
              <span>📄 Boleta médica electrónica para seguro complementario</span>
            </div>

          </div>

          {/* Results Summary Ledger (Right) */}
          <div className="lg:col-span-5 bg-white border border-[#141413] p-6 sm:p-7 rounded-[2px] space-y-6 shadow-sm">
            <div className="border-b border-[#f0ede6] pb-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#78736a] block">
                ESTIMACIÓN FINANCIERA · SUECIA 3580
              </span>
              <h3 className="text-lg font-normal text-[#141413] leading-snug">
                {procedure.name}
              </h3>
            </div>

            {/* Price lines */}
            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex justify-between text-[#78736a]">
                <span>Arancel Referencial Mercado:</span>
                <span className="line-through">${market.toLocaleString("es-CL")} CLP</span>
              </div>

              {hasConvenio && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Bonificación Convenio ({procedure.convenioDiscountPercent}%):</span>
                  <span>- ${convenioDiscountAmount.toLocaleString("es-CL")} CLP</span>
                </div>
              )}

              {previsionCoverageAmount > 0 && (
                <div className="flex justify-between text-blue-700 font-medium">
                  <span>Cobertura Estimada ({prevision.toUpperCase()}):</span>
                  <span>- ${previsionCoverageAmount.toLocaleString("es-CL")} CLP</span>
                </div>
              )}

              <div className="pt-3 border-t border-[#141413] flex items-baseline justify-between">
                <div>
                  <span className="text-xs uppercase font-mono font-bold text-[#141413] block">
                    Copago Estimado Final:
                  </span>
                  <span className="text-[10px] text-[#78736a] font-light">
                    Sujeto a confirmación clínica en box
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-2xl sm:text-3xl font-bold font-mono text-[#141413] block">
                    ${estimatedCopay.toLocaleString("es-CL")}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-600 block">
                    Ahorro total: ${totalSavings.toLocaleString("es-CL")} CLP
                  </span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleBookWithPrice}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 bg-[#141413] hover:bg-black text-[#faf8f5] text-xs font-mono tracking-widest uppercase font-bold transition rounded-[2px]"
              >
                <span>Agendar esta Prestación</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
