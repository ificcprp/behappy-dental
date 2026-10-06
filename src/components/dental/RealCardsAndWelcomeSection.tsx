"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { createWhatsAppUrl } from "@/data/clinicInfo";
import { ArrowUpRight } from "lucide-react";

export function RealCardsAndWelcomeSection() {
  return (
    <section className="bg-[#faf8f5] text-[#141413] border-b border-[#e5e0d5]">
      
      {/* 4-Column Reticular Grid (Matching Reference ENCARGOS / CUATRO PILARES) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-14">
        
        {/* Section Intro */}
        <div className="space-y-2 mb-10">
          <span className="text-[11px] font-mono tracking-[0.22em] text-[#6d6961] uppercase block">
            ACCESOS Y PILARES INSTITUCIONALES
          </span>
          <h2 className="text-xl sm:text-2xl font-normal tracking-tight text-[#141413]">
            Un solo centro, todas las disciplinas de la salud dental.
          </h2>
          <p className="text-xs sm:text-sm text-[#66635d] font-light max-w-2xl leading-relaxed">
            Consulte según su necesidad clínica. El método BeHappy no improvisa: diagnóstico digital, protocolo bioseguro y presupuesto claro desde la primera consulta.
          </p>
        </div>

        {/* 4 Grid Columns with Fine Border Dividers */}
        {/* 4 Grid Columns with Fine Border Dividers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-l border-b border-[#e5e0d5]">
          
          {/* Card 1: Conoce cómo llegar (Instagram Reel) */}
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
                  01 · LOCALIZACIÓN & ACCESO
                </span>
                <h3 className="text-base font-medium tracking-tight text-[#141413] leading-snug">
                  Conoce cómo llegar a nuestra clínica
                </h3>
                <p className="text-xs text-[#66635d] font-light mt-2 leading-relaxed">
                  Visítanos en Suecia 3580, of. 304, Ñuñoa. A pasos de Metro Chile España (Línea 3).
                </p>
              </div>
            </div>

            <a
              href="https://www.instagram.com/p/CktaZC8pojP/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-1 text-[11px] font-mono tracking-wider uppercase text-[#141413] font-semibold underline underline-offset-4 decoration-1 group-hover:text-neutral-900 transition"
            >
              Explorar <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 2: Convenio Dental */}
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
                  02 · SISTEMA PREVENTIVO
                </span>
                <h3 className="text-base font-medium tracking-tight text-[#141413] leading-snug">
                  Descubre nuestro convenio dental
                </h3>
                <p className="text-xs text-[#66635d] font-light mt-2 leading-relaxed">
                  Beneficios del convenio, coberturas escalonadas y tarifas preferenciales para toda la familia.
                </p>
              </div>
            </div>

            <Link
              href="/precios"
              className="mt-6 inline-flex items-center gap-1 text-[11px] font-mono tracking-wider uppercase text-[#141413] font-semibold underline underline-offset-4 decoration-1 transition"
            >
              Lee sobre nuestro seguro →
            </Link>
          </div>

          {/* Card 3: Tratamientos */}
          <div className="p-7 flex flex-col justify-between border-r border-[#e5e0d5] hover:bg-[#f3efe6] transition-colors group">
            <div className="space-y-4">
              <div className="h-14 flex items-center font-serif text-sm tracking-wide text-[#141413]">
                <span className="italic font-normal">
                  Protocolo <span className="text-xs font-mono">2026</span> = <sup>(Dx + 3D)</sup>&frasl;<sub>Prevención</sub>
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono tracking-[0.2em] text-[#78736a] uppercase block mb-1">
                  03 · CATÁLOGO CLÍNICO
                </span>
                <h3 className="text-base font-medium tracking-tight text-[#141413] leading-snug">
                  Revisa nuestros tratamientos y servicios dentales
                </h3>
                <p className="text-xs text-[#66635d] font-light mt-2 leading-relaxed">
                  Desde ortodoncia invisible Invisalign e implantes hasta odontopediatría y blanqueamiento.
                </p>
              </div>
            </div>

            <Link
              href="/tratamientos"
              className="mt-6 inline-flex items-center gap-1 text-[11px] font-mono tracking-wider uppercase text-[#141413] font-semibold underline underline-offset-4 decoration-1 transition"
            >
              Ver tratamientos →
            </Link>
          </div>

          {/* Card 4: Especialistas / Derivaciones */}
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
                  04 · EQUIPO ACREDITADO
                </span>
                <h3 className="text-base font-medium tracking-tight text-[#141413] leading-snug">
                  ¿Necesita un especialista? Recibimos derivaciones
                </h3>
                <p className="text-xs text-[#66635d] font-light mt-2 leading-relaxed">
                  8 especialistas registrados en la Superintendencia de Salud con derivaciones en diversas áreas.
                </p>
              </div>
            </div>

            <a
              href={createWhatsAppUrl("Hola Centro Dental BeHappy, me gustaría coordinar una cita con un especialista.")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-1 text-[11px] font-mono tracking-wider uppercase text-[#141413] font-semibold underline underline-offset-4 decoration-1 transition"
            >
              Agenda Aquí →
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
                PRIMERA ATENCIÓN & ADMISIÓN
              </span>

              <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-[#141413] leading-tight">
                ¿Nuevo como paciente?<br />
                Contáctenos hoy mismo
              </h2>

              <div className="space-y-3 text-sm text-[#5d5952] font-light leading-relaxed">
                <p>
                  Cámbiate a nosotros fácilmente. Gestiona y mantén tu salud dental.
                </p>
                <p>
                  Escríbenos directamente para recibir detalles personalizados y resolver tus dudas clínicas.
                </p>
              </div>

              <div className="pt-2">
                <a
                  href={createWhatsAppUrl("Hola Centro Dental BeHappy, soy un nuevo paciente y me gustaría recibir información sobre la primera consulta.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-7 py-3.5 rounded-[2px] bg-[#141413] text-[#faf8f5] hover:bg-black text-xs font-mono tracking-[0.16em] uppercase font-bold transition shadow-sm"
                >
                  Enviar mensaje por WhatsApp
                </a>
              </div>
            </div>

            {/* Right Photo: Real Clinic Interior Box */}
            <div className="lg:col-span-7">
              <div className="relative w-full h-[340px] sm:h-[440px] rounded-[2px] overflow-hidden border border-[#ded9cd] bg-[#e8e4db] shadow-sm">
                <Image
                  src="/images/clinic-interior.jpg"
                  alt="Instalaciones clínicas y box de atención en Centro Dental BeHappy Ñuñoa"
                  fill
                  className="object-cover filter contrast-[1.03]"
                  sizes="(max-width: 1024px) 100vw, 700px"
                />
                <div className="absolute bottom-3 right-3 bg-[#141413]/85 text-[#f5f2eb] px-3 py-1.5 text-[10px] font-mono tracking-widest uppercase">
                  Box Dental · Suecia 3580, Ñuñoa
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

    </section>
  );
}
