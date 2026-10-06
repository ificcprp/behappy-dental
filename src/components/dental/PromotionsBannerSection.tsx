"use client";

import React from "react";
import Link from "next/link";
import { createWhatsAppUrl } from "@/data/clinicInfo";
import { Shield, Sparkles, ArrowRight } from "lucide-react";

export function PromotionsBannerSection() {
  return (
    <section className="py-20 bg-black text-white border-b border-neutral-900/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header matching official dump */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <p className="text-xs sm:text-sm text-neutral-400 font-light">
            En Centro Dental BeHappy, ofrecemos convenios, promociones, entre otros
          </p>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Conveníos y Promociones
          </h2>
        </div>

        {/* Two Action Cards matching official dump */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          
          {/* Card 1: Lee Sobre Nuestro Seguro */}
          <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-8 flex flex-col justify-between hover:border-[#00968c] transition-all duration-300 group shadow-xl">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#00968c]/10 text-[#00968c] flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Seguro Dental BeHappy
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
                Membresía preventiva familiar con cobertura escalonada del 20% al 60% en aranceles clínicos, sin topes ni letra chica.
              </p>
            </div>

            <div className="pt-8">
              <Link
                href="/precios"
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-neutral-900 group-hover:bg-[#00968c] text-white font-medium text-xs sm:text-sm border border-neutral-700 group-hover:border-[#00968c] transition-all"
              >
                Lee Sobre Nuestro Seguro <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 2: Explora Promociones Vigentes */}
          <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-8 flex flex-col justify-between hover:border-neutral-500 transition-all duration-300 group shadow-xl">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-neutral-800 text-neutral-200 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Promociones de Temporada
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
                Descuentos especiales en evaluación inicial, ortodoncia invisible Invisalign, aclaramiento dental y paquetes familiares en Ñuñoa.
              </p>
            </div>

            <div className="pt-8">
              <a
                href={createWhatsAppUrl("Hola Centro Dental BeHappy, me gustaría conocer las promociones vigentes de este mes.")}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 bg-neutral-900 group-hover:bg-neutral-800 text-white font-medium text-xs sm:text-sm border border-neutral-700 transition-all"
              >
                Explora Promociones Vigentes <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
