"use client";

import React from "react";
import { AlertCircle, Sparkles, Smile, ShieldCheck, HeartPulse, ArrowRight } from "lucide-react";

interface TriageOption {
  id: string;
  icon: React.ReactNode;
  tag: string;
  title: string;
  subtitle: string;
  treatmentName: string;
  doctorRecommendation: string;
  badge: string;
}

export function ClinicalTriageSection() {
  const options: TriageOption[] = [
    {
      id: "urgencia",
      icon: <AlertCircle className="w-5 h-5 text-rose-600" />,
      tag: "SÍNTOMA: DOLOR O MOLESTIA",
      title: "Dolor dental o urgencia",
      subtitle: "Sensibilidad aguda, inflamación o diente quebrado que requiere atención prioritaria.",
      treatmentName: "Extracción Dental / Endodoncia",
      doctorRecommendation: "Evaluación inmediata en box",
      badge: "Prioridad Clínica"
    },
    {
      id: "invisalign",
      icon: <Smile className="w-5 h-5 text-teal-600" />,
      tag: "OBJETIVO: ALINEACIÓN INVISIBLE",
      title: "Quiero enderezar mis dientes",
      subtitle: "Tratamiento con alineadores transparentes Invisalign sin brackets metálicos.",
      treatmentName: "Invisalign",
      doctorRecommendation: "Dr. Johnny Lugo (Ortodoncista)",
      badge: "Certificación Oficial"
    },
    {
      id: "estetica",
      icon: <Sparkles className="w-5 h-5 text-amber-600" />,
      tag: "OBJETIVO: ESTÉTICA & COLOR",
      title: "Blanquear y armonizar mi sonrisa",
      subtitle: "Aclaramiento dental seguro en sillón o diseño estético con resinas de alta gama.",
      treatmentName: "Blanqueamiento Dental",
      doctorRecommendation: "Dra. Keila Rodríguez González",
      badge: "Estética Avanzada"
    },
    {
      id: "implante",
      icon: <ShieldCheck className="w-5 h-5 text-blue-600" />,
      tag: "SÍNTOMA: DIENTE AUSENTE",
      title: "Recuperar un diente perdido",
      subtitle: "Implantes de titanio que reemplazan la raíz biológica con masticación 100% natural.",
      treatmentName: "Implantes Dentales",
      doctorRecommendation: "Dr. Juan José Herrera (Cirujano)",
      badge: "Osteointegración"
    },
    {
      id: "prevencion",
      icon: <HeartPulse className="w-5 h-5 text-emerald-600" />,
      tag: "OBJETIVO: MANTENCIÓN ANUAL",
      title: "Limpieza y chequeo preventivo",
      subtitle: "Diagnóstico con radiografía digital y destartraje con ultrasonido sin dolor.",
      treatmentName: "Revisión Dental",
      doctorRecommendation: "Cuerpo Médico BeHappy",
      badge: "100% Bonificable"
    }
  ];

  const handleSelectTriage = (treatmentName: string) => {
    const bookingEl = document.getElementById("agendar");
    if (bookingEl) {
      bookingEl.scrollIntoView({ behavior: "smooth" });
      // Notify custom event so booking form preselects this
      window.dispatchEvent(new CustomEvent("behappy_triage_selected", { detail: { treatmentName } }));
    }
  };

  return (
    <section className="bg-white text-[#141413] py-20 px-4 sm:px-6 lg:px-8 border-b border-[#e5e0d5]">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#e5e0d5] pb-6">
          <div className="space-y-2">
            <span className="text-[11px] font-mono tracking-[0.22em] text-[#78736a] uppercase block">
              TRIAGE ODONTOLÓGICO RÁPIDO · ORIENTACIÓN AL PACIENTE
            </span>
            <h2 className="text-3xl sm:text-4xl font-normal tracking-[-0.03em] text-[#141413]">
              ¿Qué podemos resolver hoy en tu sonrisa?
            </h2>
            <p className="text-xs sm:text-sm text-[#66635d] font-light max-w-xl">
              Selecciona tu motivo de consulta para asignarte al especialista idóneo y preparar el box dental antes de tu llegada.
            </p>
          </div>

          <span className="text-[11px] font-mono text-[#78736a] shrink-0">
            5 RUTAS DE ATENCIÓN DIRECTA
          </span>
        </div>

        {/* 5-Column Responsive Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {options.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelectTriage(item.treatmentName)}
              className="p-5 border border-[#e5e0d5] bg-[#faf8f5] hover:bg-white hover:border-[#141413] hover:shadow-md transition-all text-left flex flex-col justify-between space-y-4 group rounded-[2px] cursor-pointer"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-white rounded border border-[#e5e0d5]">
                    {item.icon}
                  </div>
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white border border-[#e5e0d5] text-[#141413]">
                    {item.badge}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#78736a] block">
                    {item.tag}
                  </span>
                  <h3 className="text-sm font-medium text-[#141413] leading-snug group-hover:underline">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#66635d] font-light leading-relaxed pt-1">
                    {item.subtitle}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#e5e0d5] flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-[#141413] font-semibold group-hover:text-black">
                <span>Elegir esta atención</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}
