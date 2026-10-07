"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getCMSData, CMSData, CMSWelcomeSection, DEFAULT_WELCOME_SECTION } from "@/lib/cmsStore";

export function RealCardsAndWelcomeSection() {
  const [welcomeData, setWelcomeData] = useState<CMSWelcomeSection>(DEFAULT_WELCOME_SECTION);

  useEffect(() => {
    const cms = getCMSData();
    if (cms?.welcomeSection) {
      setWelcomeData(cms.welcomeSection);
    }

    const handleUpdate = (e: Event) => {
      const custom = (e as CustomEvent<CMSData>).detail;
      if (custom?.welcomeSection) {
        setWelcomeData(custom.welcomeSection);
      } else {
        const fresh = getCMSData();
        if (fresh?.welcomeSection) setWelcomeData(fresh.welcomeSection);
      }
    };

    window.addEventListener("behappy_cms_updated", handleUpdate);
    return () => window.removeEventListener("behappy_cms_updated", handleUpdate);
  }, []);

  const cards = welcomeData.cards && welcomeData.cards.length === 4 ? welcomeData.cards : DEFAULT_WELCOME_SECTION.cards;
  const newPatient = welcomeData.newPatient || DEFAULT_WELCOME_SECTION.newPatient;

  return (
    <section className="bg-[#faf8f5] text-[#141413] border-b border-[#e5e0d5]">
      
      {/* 4-Column Reticular Grid (Matching Reference ENCARGOS / CUATRO PILARES) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-14">
        
        {/* Section Intro */}
        <div className="space-y-2 mb-10">
          <span className="text-[11px] font-mono tracking-[0.22em] text-[#6d6961] uppercase block">
            {welcomeData.kicker || "ACCESOS Y PILARES INSTITUCIONALES"}
          </span>
          <h2 className="text-xl sm:text-2xl font-normal tracking-tight text-[#141413]">
            {welcomeData.title || "Un solo centro, todas las disciplinas de la salud dental."}
          </h2>
          <p className="text-xs sm:text-sm text-[#66635d] font-light max-w-2xl leading-relaxed">
            {welcomeData.subtitle || "Consulte según su necesidad clínica. El método BeHappy no improvisa: diagnóstico digital, protocolo bioseguro y presupuesto claro desde la primera consulta."}
          </p>
        </div>

        {/* 4 Grid Columns with Fine Border Dividers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-l border-b border-[#e5e0d5]">
          
          {/* Card 1 */}
          <div className="p-7 flex flex-col justify-between border-r border-[#e5e0d5] hover:bg-[#f3efe6] transition-colors group">
            <div className="space-y-4">
              <div className="h-14 flex items-center">
                <svg className="w-16 h-8 text-[#141413]" viewBox="0 0 64 32" fill="none" stroke="currentColor">
                  <circle cx="12" cy="16" r="8" strokeWidth="1" />
                  <circle cx="12" cy="16" r="2" fill="currentColor" />
                  <line x1="20" y1="16" x2="44" y2="16" strokeWidth="1" strokeDasharray="2 2" />
                  <circle cx="52" cy="16" r="8" strokeWidth="1" fill="#e5e0d5" />
                  <circle cx="52" cy="16" r="3" fill="currentColor" />
                </svg>
              </div>

              <div>
                <span className="text-[10px] font-mono tracking-[0.2em] text-[#78736a] uppercase block mb-1">
                  {cards[0].number} · {cards[0].tag}
                </span>
                <h3 className="text-base font-medium tracking-tight text-[#141413] leading-snug">
                  {cards[0].title}
                </h3>
                <p className="text-xs text-[#66635d] font-light mt-2 leading-relaxed">
                  {cards[0].description}
                </p>
              </div>
            </div>

            <a
              href={cards[0].linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-1 text-[11px] font-mono tracking-wider uppercase text-[#141413] font-semibold underline underline-offset-4 decoration-1 group-hover:text-neutral-900 transition"
            >
              {cards[0].linkText} <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 2 */}
          <div className="p-7 flex flex-col justify-between border-r border-[#e5e0d5] hover:bg-[#f3efe6] transition-colors group">
            <div className="space-y-4">
              <div className="h-14 flex items-center">
                <svg className="w-16 h-8 text-[#141413]" viewBox="0 0 64 32" fill="none" stroke="currentColor">
                  <path d="M8 24 C18 12, 28 28, 40 14 C48 8, 56 16, 56 16" strokeWidth="1" />
                  <rect x="36" y="6" width="16" height="18" strokeWidth="1" fill="#faf8f5" />
                  <line x1="40" y1="11" x2="48" y2="11" strokeWidth="1" />
                  <line x1="40" y1="15" x2="46" y2="15" strokeWidth="1" />
                </svg>
              </div>

              <div>
                <span className="text-[10px] font-mono tracking-[0.2em] text-[#78736a] uppercase block mb-1">
                  {cards[1].number} · {cards[1].tag}
                </span>
                <h3 className="text-base font-medium tracking-tight text-[#141413] leading-snug">
                  {cards[1].title}
                </h3>
                <p className="text-xs text-[#66635d] font-light mt-2 leading-relaxed">
                  {cards[1].description}
                </p>
              </div>
            </div>

            <Link
              href={cards[1].linkUrl}
              className="mt-6 inline-flex items-center gap-1 text-[11px] font-mono tracking-wider uppercase text-[#141413] font-semibold underline underline-offset-4 decoration-1 transition"
            >
              {cards[1].linkText}
            </Link>
          </div>

          {/* Card 3 */}
          <div className="p-7 flex flex-col justify-between border-r border-[#e5e0d5] hover:bg-[#f3efe6] transition-colors group">
            <div className="space-y-4">
              <div className="h-14 flex items-center font-serif text-sm tracking-wide text-[#141413]">
                <span className="italic font-normal">
                  Protocolo <span className="text-xs font-mono">2026</span> = <sup>(Dx + 3D)</sup>&frasl;<sub>Prevención</sub>
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono tracking-[0.2em] text-[#78736a] uppercase block mb-1">
                  {cards[2].number} · {cards[2].tag}
                </span>
                <h3 className="text-base font-medium tracking-tight text-[#141413] leading-snug">
                  {cards[2].title}
                </h3>
                <p className="text-xs text-[#66635d] font-light mt-2 leading-relaxed">
                  {cards[2].description}
                </p>
              </div>
            </div>

            <Link
              href={cards[2].linkUrl}
              className="mt-6 inline-flex items-center gap-1 text-[11px] font-mono tracking-wider uppercase text-[#141413] font-semibold underline underline-offset-4 decoration-1 transition"
            >
              {cards[2].linkText}
            </Link>
          </div>

          {/* Card 4 */}
          <div className="p-7 flex flex-col justify-between border-r border-[#e5e0d5] hover:bg-[#f3efe6] transition-colors group">
            <div className="space-y-4">
              <div className="h-14 flex items-center">
                <svg className="w-14 h-10 text-[#141413]" viewBox="0 0 56 40" fill="none" stroke="currentColor">
                  <rect x="4" y="4" width="48" height="32" strokeWidth="1" />
                  <line x1="20" y1="4" x2="20" y2="36" strokeWidth="1" />
                  <line x1="36" y1="4" x2="36" y2="36" strokeWidth="1" />
                  <line x1="4" y1="20" x2="52" y2="20" strokeWidth="1" />
                  <circle cx="28" cy="20" r="4" fill="currentColor" />
                </svg>
              </div>

              <div>
                <span className="text-[10px] font-mono tracking-[0.2em] text-[#78736a] uppercase block mb-1">
                  {cards[3].number} · {cards[3].tag}
                </span>
                <h3 className="text-base font-medium tracking-tight text-[#141413] leading-snug">
                  {cards[3].title}
                </h3>
                <p className="text-xs text-[#66635d] font-light mt-2 leading-relaxed">
                  {cards[3].description}
                </p>
              </div>
            </div>

            <a
              href={cards[3].linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-1 text-[11px] font-mono tracking-wider uppercase text-[#141413] font-semibold underline underline-offset-4 decoration-1 transition"
            >
              {cards[3].linkText}
            </a>
          </div>

        </div>

      </div>

      {/* "¿Nuevo como paciente? Contáctenos hoy mismo" */}
      <div className="border-t border-[#e5e0d5] py-20 bg-[#f5f2eb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Copy */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-[11px] font-mono tracking-[0.2em] text-[#78736a] uppercase block">
                {newPatient.tag || "PRIMERA ATENCIÓN & ADMISIÓN"}
              </span>

              <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-[#141413] leading-tight whitespace-pre-line">
                {newPatient.title || "¿Nuevo como paciente?\nContáctenos hoy mismo"}
              </h2>

              <div className="space-y-3 text-sm text-[#5d5952] font-light leading-relaxed">
                <p>
                  {newPatient.description1 || "Cámbiate a nosotros fácilmente. Gestiona y mantén tu salud dental."}
                </p>
                <p>
                  {newPatient.description2 || "Escríbenos directamente para recibir detalles personalizados y resolver tus dudas clínicas."}
                </p>
              </div>

              <div className="pt-2">
                <a
                  href={newPatient.buttonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-7 py-3.5 rounded-[2px] bg-[#141413] text-[#faf8f5] hover:bg-black text-xs font-mono tracking-[0.16em] uppercase font-bold transition shadow-sm"
                >
                  {newPatient.buttonText || "Enviar mensaje por WhatsApp"}
                </a>
              </div>
            </div>

            {/* Right Photo: Real Clinic Interior Box */}
            <div className="lg:col-span-7">
              <div className="relative w-full h-[340px] sm:h-[440px] rounded-[2px] overflow-hidden border border-[#ded9cd] bg-[#e8e4db] shadow-sm">
                <Image
                  src={newPatient.image || "/images/clinic-interior.jpg"}
                  alt="Instalaciones clínicas y box de atención en Centro Dental BeHappy Ñuñoa"
                  fill
                  className="object-cover filter contrast-[1.03]"
                  sizes="(max-width: 1024px) 100vw, 700px"
                />
                <div className="absolute bottom-3 right-3 bg-[#141413]/85 text-[#f5f2eb] px-3 py-1.5 text-[10px] font-mono tracking-widest uppercase">
                  {newPatient.imageCaption || "Box Dental · Suecia 3580, Ñuñoa"}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

    </section>
  );
}
