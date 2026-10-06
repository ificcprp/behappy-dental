"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export function ConveniosPromosSection() {
  return (
    <section className="bg-[#faf8f5] text-[#141413] py-24 px-4 sm:px-6 lg:px-8 border-b border-[#e5e0d5]">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="space-y-3">
          <span className="text-[11px] font-mono tracking-[0.22em] text-[#78736a] uppercase block">
            CONVENIOS INSTITUCIONALES & BENEFICIOS
          </span>
          <h2 className="text-3xl sm:text-5xl font-normal tracking-[-0.03em] text-[#141413]">
            Conveníos y Promociones
          </h2>
          <p className="text-sm sm:text-base text-[#66635d] font-light max-w-2xl leading-relaxed">
            En Centro Dental BeHappy, ofrecemos convenios, promociones y facilidades de pago para garantizar la continuidad ininterrumpida de su tratamiento.
          </p>
        </div>

        {/* 2 Big Editorial Catalog Items (Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Item 1: Seguro Dental */}
          <div className="flex flex-col justify-between border border-[#e5e0d5] bg-white p-6 sm:p-8 hover:border-[#141413] transition-colors group">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#e5e0d5] pb-3">
                <span className="text-[10px] font-mono tracking-[0.2em] text-[#78736a] uppercase">
                  PL-01 · COBERTURA DENTAL
                </span>
                <span className="text-[11px] font-mono text-[#141413] font-bold">20% ~ 60%</span>
              </div>

              {/* Authentic Photo */}
              <div className="relative w-full h-[240px] sm:h-[280px] bg-[#f5f2eb] overflow-hidden border border-[#e5e0d5]">
                <Image
                  src="/images/promos/seguro-dental.png"
                  alt="Convenio y Seguro Dental BeHappy Ñuñoa"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 550px"
                />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-normal tracking-tight text-[#141413]">
                  Seguro Dental y Convenio Progresivo BeHappy
                </h3>
                <p className="text-xs sm:text-sm text-[#66635d] font-light leading-relaxed">
                  Sistema de afiliación familiar y corporativa que bonifica limpiezas preventivas al 100% y reduce el arancel en ortodoncia, rehabilitación e implantes.
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-[#e5e0d5] mt-6">
              <Link
                href="/precios"
                className="inline-flex w-full items-center justify-center py-3.5 px-6 rounded-[2px] bg-[#141413] text-[#faf8f5] hover:bg-black text-xs font-mono tracking-[0.16em] uppercase font-bold transition shadow-sm"
              >
                Lee Sobre Nuestro Seguro
              </Link>
            </div>
          </div>

          {/* Item 2: Promociones Vigentes */}
          <div className="flex flex-col justify-between border border-[#e5e0d5] bg-white p-6 sm:p-8 hover:border-[#141413] transition-colors group">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#e5e0d5] pb-3">
                <span className="text-[10px] font-mono tracking-[0.2em] text-[#78736a] uppercase">
                  PL-02 · CONDICIONES ACTIVAS
                </span>
                <span className="text-[11px] font-mono text-emerald-800 font-bold">Vigente 2026</span>
              </div>

              {/* Authentic Photo */}
              <div className="relative w-full h-[240px] sm:h-[280px] bg-[#f5f2eb] overflow-hidden border border-[#e5e0d5]">
                <Image
                  src="/images/promos/promos-vigentes.png"
                  alt="Promociones Vigentes Centro Dental BeHappy"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 550px"
                />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-normal tracking-tight text-[#141413]">
                  Promociones de Temporada & Evaluación
                </h3>
                <p className="text-xs sm:text-sm text-[#66635d] font-light leading-relaxed">
                  Acceda a tarifas preferenciales en su primera consulta de diagnóstico integral con radiografías digitales y planes en cuotas sin interés con Transbank.
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-[#e5e0d5] mt-6">
              <Link
                href="/precios#promos"
                className="inline-flex w-full items-center justify-center py-3.5 px-6 rounded-[2px] bg-[#141413] text-[#faf8f5] hover:bg-black text-xs font-mono tracking-[0.16em] uppercase font-bold transition shadow-sm"
              >
                Explora Promociones Vigentes
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
