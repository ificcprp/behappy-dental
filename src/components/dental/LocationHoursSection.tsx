"use client";

import React from "react";
import { CLINIC_INFO } from "@/data/clinicInfo";
import { ArrowUpRight } from "lucide-react";

export function LocationHoursSection() {
  return (
    <section id="ubicacion" className="py-24 bg-[#faf8f5] text-[#141413] border-b border-[#e5e0d5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="space-y-3">
          <span className="text-[11px] font-mono tracking-[0.22em] text-[#78736a] uppercase block">
            LOCALIZACIÓN, HORARIOS Y ACCESIBILIDAD
          </span>
          <h2 className="text-3xl sm:text-5xl font-normal tracking-[-0.03em] text-[#141413]">
            Ubicación y Consulta
          </h2>
          <p className="text-sm sm:text-base text-[#66635d] font-light max-w-2xl leading-relaxed">
            Visítanos en Suecia 3580, oficina 304, Ñuñoa. Edificio médico con estacionamiento y conectividad inmediata a red de Metro.
          </p>
        </div>

        {/* 3-Column Architectural Triptych */}
        <div className="grid grid-cols-1 lg:grid-cols-12 border border-[#e5e0d5] bg-white divide-y lg:divide-y-0 lg:divide-x divide-[#e5e0d5]">
          
          {/* Column 1: Horarios */}
          <div className="lg:col-span-4 p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-[10px] font-mono tracking-[0.2em] text-[#78736a] uppercase block">
                01 · JORNADA CLÍNICA
              </span>
              <h3 className="text-xl font-normal tracking-tight text-[#141413]">
                Horarios de Atención
              </h3>
              <div className="space-y-2.5 text-xs sm:text-sm text-[#5d5952] font-light leading-relaxed pt-2">
                <div className="flex justify-between py-1 border-b border-[#f0ede6]">
                  <span>Lunes ~ Viernes</span>
                  <span className="font-mono text-[#141413] font-bold">10:00 - 20:00</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#f0ede6]">
                  <span>Sábado</span>
                  <span className="font-mono text-[#141413] font-bold">10:00 - 18:00</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Domingos y Feriados</span>
                  <span className="font-mono text-[#78736a]">Cerrado</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-[#78736a] font-light">
              Atención médica programada y urgencias dentales durante el horario hábil.
            </p>
          </div>

          {/* Column 2: Google Maps Embed */}
          <div className="lg:col-span-5 p-4 sm:p-6 bg-[#faf8f5]">
            <div className="w-full h-[280px] sm:h-[320px] overflow-hidden border border-[#e5e0d5] bg-[#f0ede6]">
              <iframe
                src={CLINIC_INFO.address.googleMapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación Centro Dental BeHappy Ñuñoa"
                className="w-full h-full filter contrast-[1.03]"
              />
            </div>
          </div>

          {/* Column 3: Dirección & Accesibilidad */}
          <div className="lg:col-span-3 p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-[10px] font-mono tracking-[0.2em] text-[#78736a] uppercase block">
                02 · DIRECCIÓN POSTAL
              </span>
              <h3 className="text-xl font-normal tracking-tight text-[#141413]">
                Sede Ñuñoa
              </h3>
              <div className="text-xs sm:text-sm text-[#5d5952] font-light space-y-1">
                <p className="font-medium text-[#141413]">Suecia 3580, OF. 304</p>
                <p>Ñuñoa, Santiago, Chile</p>
                <p className="text-[11px] text-[#78736a] pt-2">
                  Referencia: Av. Suecia entre Eliodoro Yáñez y Pocuro / Simón Bolívar. A pasos de Metro Chile España (L3).
                </p>
              </div>
            </div>

            <div>
              <a
                href={CLINIC_INFO.address.googleMapsDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-mono tracking-wider uppercase text-[#141413] font-semibold underline underline-offset-4 decoration-1"
              >
                Abrir en Google Maps <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
