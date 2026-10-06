"use client";

import React, { useState } from "react";
import { TREATMENTS, CATEGORIES, Treatment } from "@/data/treatments";
import { createWhatsAppUrl } from "@/data/clinicInfo";
import { MessageCircle, ArrowUpRight } from "lucide-react";

export function TreatmentsSection() {
  const [activeCategory, setActiveCategory] = useState<string>("Todos");

  const filteredTreatments =
    activeCategory === "Todos"
      ? TREATMENTS
      : TREATMENTS.filter((t) => t.category === activeCategory);

  const handleSelectTreatment = (treatment: Treatment) => {
    const el = document.getElementById("agendar");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="tratamientos" className="py-24 bg-[#faf8f5] text-[#141413] border-b border-[#e5e0d5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Editorial Header */}
        <div className="space-y-3">
          <span className="text-[11px] font-mono tracking-[0.22em] text-[#78736a] uppercase block">
            CATÁLOGO CLÍNICO & PROCEDIMIENTOS · SUECIA 3580
          </span>
          <h2 className="text-3xl sm:text-5xl font-normal tracking-[-0.03em] text-[#141413]">
            Tratamientos Odontológicos
          </h2>
          <p className="text-sm sm:text-base text-[#66635d] font-light max-w-2xl leading-relaxed">
            Desde prevención periódica y ortodoncia invisible hasta implantología avanzada y rehabilitación completa. Protocolos médicos estandarizados y sin dolor.
          </p>
        </div>

        {/* Filter Categories Bar (Editorial Hairline Tabs) */}
        <div className="flex flex-wrap gap-2 pt-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-mono tracking-wider uppercase transition-colors ${
                activeCategory === cat
                  ? "bg-[#141413] text-[#faf8f5] border border-[#141413]"
                  : "bg-white border border-[#e5e0d5] text-[#66635d] hover:border-[#141413] hover:text-[#141413]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Treatments Grid (Clean Architectural Ledger) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTreatments.map((treatment) => (
            <div
              key={treatment.id}
              className="border border-[#e5e0d5] bg-white p-6 hover:border-[#141413] transition-colors flex flex-col justify-between group"
            >
              <div className="space-y-4">
                {/* Meta Top Line */}
                <div className="flex items-center justify-between border-b border-[#f0ede6] pb-3">
                  <span className="text-[10px] font-mono tracking-[0.18em] text-[#78736a] uppercase">
                    {treatment.category}
                  </span>
                  {treatment.popular && (
                    <span className="text-[9px] font-mono tracking-widest text-[#141413] uppercase border border-[#ded9cd] px-2 py-0.5 bg-[#faf8f5]">
                      Alta Demanda
                    </span>
                  )}
                </div>

                {/* Treatment Title */}
                <h3 className="text-lg font-normal tracking-tight text-[#141413]">
                  {treatment.name}
                </h3>

                {/* Description */}
                <p className="text-xs text-[#5d5952] font-light leading-relaxed">
                  {treatment.shortDescription}
                </p>

                {/* Benefits List */}
                <ul className="space-y-1.5 text-xs text-[#5d5952] font-light pt-2 border-t border-[#f0ede6]">
                  {treatment.benefits.slice(0, 3).map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#141413] font-mono text-[10px] select-none">✓</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>

                {/* Indicated For */}
                <div className="p-3 bg-[#faf8f5] border border-[#e5e0d5] text-[11px] text-[#5d5952] font-light">
                  <strong className="text-[#141413] font-mono text-[10px] tracking-wider uppercase block mb-0.5">
                    Indicación Médica:
                  </strong>
                  {treatment.recommendedFor}
                </div>
              </div>

              {/* Action Desk */}
              <div className="pt-5 mt-5 border-t border-[#f0ede6] flex items-center justify-between gap-3">
                <button
                  onClick={() => handleSelectTreatment(treatment)}
                  className="flex-1 py-2.5 px-3 text-xs font-mono tracking-wider uppercase bg-[#141413] text-[#faf8f5] hover:bg-black transition text-center font-medium"
                >
                  Agendar Consulta
                </button>

                <a
                  href={createWhatsAppUrl(`Hola Centro Dental BeHappy, me interesa consultar detalles sobre el tratamiento de ${treatment.name}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 border border-[#e5e0d5] hover:border-[#141413] hover:bg-[#faf8f5] text-[#141413] transition"
                  title="Consultar por WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
