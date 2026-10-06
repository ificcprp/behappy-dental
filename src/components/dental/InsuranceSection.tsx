"use client";

import React from "react";
import { CLINIC_INFO, createWhatsAppUrl } from "@/data/clinicInfo";
import { ArrowUpRight } from "lucide-react";

export function InsuranceSection() {
  return (
    <section id="convenios" className="py-24 bg-[#faf8f5] text-[#141413] border-b border-[#e5e0d5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Editorial Header */}
        <div className="space-y-3">
          <span className="text-[11px] font-mono tracking-[0.22em] text-[#78736a] uppercase block">
            ACCESO ECONÓMICO & COBERTURAS PREFERENCIALES
          </span>
          <h2 className="text-3xl sm:text-5xl font-normal tracking-[-0.03em] text-[#141413]">
            Convenios, Seguro Dental y Facilidades
          </h2>
          <p className="text-sm sm:text-base text-[#66635d] font-light max-w-2xl leading-relaxed">
            Hacemos que su salud bucal sea accesible mediante planes de cobertura preventiva escalonada, facturación institucional y reembolsos inmediatos.
          </p>
        </div>

        {/* 3 Columns Architectural Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 border border-[#e5e0d5] bg-white divide-y md:divide-y-0 md:divide-x divide-[#e5e0d5]">
          
          {/* Card 1: Seguro Propio */}
          <div className="p-8 flex flex-col justify-between space-y-6 hover:bg-[#faf8f5] transition-colors">
            <div className="space-y-4">
              <span className="text-[10px] font-mono tracking-[0.2em] text-[#78736a] uppercase block">
                01 · AFILIACIÓN PREVENTIVA
              </span>
              <h3 className="text-xl font-normal tracking-tight text-[#141413]">
                Seguro Dental BeHappy
              </h3>
              <p className="text-xs sm:text-sm text-[#5d5952] font-light leading-relaxed">
                Membresía dental anual para pacientes frecuentes y grupos familiares con coberturas escalonadas del <strong className="text-[#141413] font-medium">20% al 60%</strong> según permanencia en todos los procedimientos odontológicos.
              </p>
              <ul className="space-y-1.5 text-xs font-mono text-[#78736a] pt-3 border-t border-[#f0ede6]">
                <li>✓ Limpiezas periódicas con bonificación</li>
                <li>✓ Descuentos en ortodoncia e implantes</li>
                <li>✓ Sin deducibles ocultos</li>
              </ul>
            </div>

            <div className="pt-6 border-t border-[#f0ede6]">
              <a
                href={createWhatsAppUrl("Hola Centro Dental BeHappy, me gustaría conocer los detalles y valores del Seguro Dental BeHappy.")}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-1.5 py-3 px-4 bg-[#141413] text-[#faf8f5] hover:bg-black text-xs font-mono tracking-wider uppercase font-medium transition"
              >
                Consultar Beneficios <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Card 2: Convenios Empresas y Colegios */}
          <div className="p-8 flex flex-col justify-between space-y-6 hover:bg-[#faf8f5] transition-colors">
            <div className="space-y-4">
              <span className="text-[10px] font-mono tracking-[0.2em] text-[#78736a] uppercase block">
                02 · ALIANZAS COLECTIVAS
              </span>
              <h3 className="text-xl font-normal tracking-tight text-[#141413]">
                Convenios Corporativos
              </h3>
              <p className="text-xs sm:text-sm text-[#5d5952] font-light leading-relaxed">
                Alianzas especiales para sindicatos, colegios, empresas y organizaciones de Ñuñoa, Providencia y Santiago, con beneficios extensibles a cargas familiares directas.
              </p>
              <ul className="space-y-1.5 text-xs font-mono text-[#78736a] pt-3 border-t border-[#f0ede6]">
                <li>✓ Arancel institucional preferencial</li>
                <li>✓ Charlas preventivas in-company</li>
                <li>✓ Facturación directa bienestar laboral</li>
              </ul>
            </div>

            <div className="pt-6 border-t border-[#f0ede6]">
              <a
                href={createWhatsAppUrl("Hola, represento a una empresa/institución y me gustaría cotizar un convenio dental con BeHappy.")}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-1.5 py-3 px-4 bg-[#141413] text-[#faf8f5] hover:bg-black text-xs font-mono tracking-wider uppercase font-medium transition"
              >
                Convenios Institucionales <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Card 3: Reembolsos y Formas de Pago */}
          <div className="p-8 flex flex-col justify-between space-y-6 hover:bg-[#faf8f5] transition-colors">
            <div className="space-y-4">
              <span className="text-[10px] font-mono tracking-[0.2em] text-[#78736a] uppercase block">
                03 · PREVISIÓN PRIVADA
              </span>
              <h3 className="text-xl font-normal tracking-tight text-[#141413]">
                Reembolso Isapres y Seguros
              </h3>
              <p className="text-xs sm:text-sm text-[#5d5952] font-light leading-relaxed">
                Entregamos informes clínicos detallados y presupuestos timbrados para tramitar reembolsos ante su Isapre o seguro de salud complementario (MetLife, Bice, Chilena, Consorcio).
              </p>
              <ul className="space-y-1.5 text-xs font-mono text-[#78736a] pt-3 border-t border-[#f0ede6]">
                <li>✓ Pago con tarjetas de crédito en cuotas</li>
                <li>✓ Facilidades de financiamiento directo</li>
                <li>✓ Certificados médicos oficiales al día</li>
              </ul>
            </div>

            <div className="pt-6 border-t border-[#f0ede6]">
              <a
                href={createWhatsAppUrl("Hola Centro Dental BeHappy, deseo consultar si atienden con reembolso para mi Isapre o seguro.")}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-1.5 py-3 px-4 bg-[#141413] text-[#faf8f5] hover:bg-black text-xs font-mono tracking-wider uppercase font-medium transition"
              >
                Consultar Reembolso <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
