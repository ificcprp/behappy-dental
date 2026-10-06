"use client";

import React, { useState } from "react";
import Image from "next/image";
import { TREATMENTS, CATEGORIES, Treatment } from "@/data/treatments";
import { createWhatsAppUrl } from "@/data/clinicInfo";
import { MessageCircle, Calendar, X, Check, ArrowRight } from "lucide-react";

export function RealTreatmentsGrid() {
  const [activeCategory, setActiveCategory] = useState<string>("Todos");
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);

  const filteredTreatments =
    activeCategory === "Todos"
      ? TREATMENTS
      : TREATMENTS.filter((t) => t.category === activeCategory);

  const handleBookTreatment = (treatment: Treatment) => {
    setSelectedTreatment(null);
    const bookingEl = document.getElementById("agendar");
    if (bookingEl) {
      bookingEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Header Title & Subtitle matching the screenshot */}
        <div className="text-center space-y-3 pt-4 pb-2">
          <h1 className="text-4xl sm:text-6xl font-normal tracking-[-0.02em] text-white">
            Tratamientos
          </h1>
          <p className="text-base sm:text-lg text-neutral-400 font-light max-w-2xl mx-auto">
            Explora nuestros tratamientos y procesos de cuidado
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 pb-4 border-b border-neutral-900">
          {CATEGORIES.map((cat) => {
            const count =
              cat === "Todos"
                ? TREATMENTS.length
                : TREATMENTS.filter((t) => t.category === cat).length;
            const isActive = activeCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-xs font-mono tracking-wider uppercase transition-all duration-200 flex items-center gap-2 rounded-full border ${
                  isActive
                    ? "bg-white text-black border-white font-semibold shadow-sm"
                    : "bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white hover:border-neutral-600"
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? "bg-black text-white" : "bg-neutral-800 text-neutral-400"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* 4-Column Responsive Grid matching Real Site Screenshots */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
          {filteredTreatments.map((treatment) => (
            <div
              key={treatment.id}
              id={treatment.slug}
              onClick={() => setSelectedTreatment(treatment)}
              className="group cursor-pointer flex flex-col justify-between bg-[#0a0a0c] border border-neutral-800/80 hover:border-neutral-500 rounded-sm overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/60"
            >
              <div>
                {/* Treatment Image */}
                <div className="relative w-full h-[190px] sm:h-[200px] bg-neutral-900 overflow-hidden">
                  <Image
                    src={treatment.image}
                    alt={treatment.name}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Card Content */}
                <div className="p-4 sm:p-5 space-y-2">
                  {/* Category Tag */}
                  <span className="text-[10px] sm:text-[11px] font-mono tracking-wider text-neutral-400 font-semibold uppercase block">
                    {treatment.tag}
                  </span>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white group-hover:text-purple-300 transition-colors">
                    {treatment.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed line-clamp-3">
                    {treatment.shortDescription}
                  </p>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="px-4 sm:px-5 pb-4 pt-2 flex items-center justify-between text-xs text-neutral-400 group-hover:text-white border-t border-neutral-900/60 transition-colors">
                <span className="text-[11px] font-mono tracking-wider">Ver información clínica</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for Treatment Details */}
        {selectedTreatment && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setSelectedTreatment(null)}
          >
            <div
              className="relative w-full max-w-2xl bg-[#111115] border border-neutral-800 rounded-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col text-white"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Close Button */}
              <button
                onClick={() => setSelectedTreatment(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-white hover:text-black transition"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Hero Image */}
              <div className="relative w-full h-[220px] sm:h-[260px] bg-neutral-900 flex-shrink-0">
                <Image
                  src={selectedTreatment.image}
                  alt={selectedTreatment.name}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 700px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111115] via-transparent to-black/40" />
                <div className="absolute bottom-4 left-6 right-6">
                  <span className="text-[11px] font-mono tracking-widest text-purple-400 uppercase font-semibold">
                    {selectedTreatment.tag}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                    {selectedTreatment.name}
                  </h2>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6">
                <div>
                  <h4 className="text-xs font-mono tracking-widest text-neutral-400 uppercase mb-2">
                    Resumen del Procedimiento
                  </h4>
                  <p className="text-sm sm:text-base text-neutral-200 font-light leading-relaxed">
                    {selectedTreatment.fullDescription}
                  </p>
                </div>

                {/* Benefits */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-mono tracking-widest text-neutral-400 uppercase">
                    Beneficios Principales
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {selectedTreatment.benefits.map((benefit, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2.5 p-2.5 rounded bg-neutral-900/60 border border-neutral-800 text-xs text-neutral-300"
                      >
                        <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended For */}
                <div className="p-4 rounded bg-neutral-900/80 border border-neutral-800 space-y-1">
                  <span className="text-[11px] font-mono tracking-wider text-neutral-400 uppercase block">
                    Indicación Médica:
                  </span>
                  <p className="text-xs sm:text-sm text-neutral-200 font-light">
                    {selectedTreatment.recommendedFor}
                  </p>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="p-6 bg-[#0c0c0e] border-t border-neutral-800/80 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleBookTreatment(selectedTreatment)}
                  className="flex-1 py-3 px-4 bg-white text-black font-semibold text-xs font-mono uppercase tracking-wider rounded hover:bg-neutral-200 transition flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Agendar Consulta Online</span>
                </button>

                <a
                  href={createWhatsAppUrl(
                    `Hola Centro Dental BeHappy, me gustaría consultar detalles sobre el tratamiento de ${selectedTreatment.name}.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 bg-[#25D366] text-white font-semibold text-xs font-mono uppercase tracking-wider rounded hover:bg-[#20ba5a] transition flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Consultar por WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
