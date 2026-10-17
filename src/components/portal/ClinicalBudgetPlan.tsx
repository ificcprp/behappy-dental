"use client";

import React, { useMemo } from "react";
import { OdontogramTooth, DentalBudget, BudgetItem } from "@/types/auth";
import {
  FileText,
  Printer,
  CreditCard,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  Clock,
  Layers,
  X
} from "lucide-react";
import { CLINIC_INFO, createWhatsAppUrl } from "@/data/clinicInfo";

interface ClinicalBudgetPlanProps {
  odontogram: OdontogramTooth[];
  patientName: string;
  patientRut?: string;
  patientEmail?: string;
  patientPhone?: string;
  convenioLevel?: string;
  onClose?: () => void;
  onPayWithFlow?: (amount: number, subject: string) => void;
}

export function ClinicalBudgetPlan({
  odontogram,
  patientName,
  patientRut = "",
  patientEmail = "",
  patientPhone = "",
  convenioLevel = "40%",
  onClose,
  onPayWithFlow,
}: ClinicalBudgetPlanProps) {
  // Derivación matemática del presupuesto a partir del Odontograma
  const budget: DentalBudget = useMemo(() => {
    const items: BudgetItem[] = [
      {
        id: "item-diag",
        procedureName: "Evaluación Diagnóstica Integral + Set Rx Periapical Digital",
        phase: "fase1_preventiva",
        basePrice: 35000,
        convenioDiscount: 35000, // 100% Bonificado en membresía BeHappy
        finalCopay: 0,
        notes: "Cámara intraoral HD y radiología computarizada sin costo.",
      },
      {
        id: "item-prev",
        procedureName: "Destartraje Supragingival y Profilaxis con Ultrasonido",
        phase: "fase1_preventiva",
        basePrice: 55000,
        convenioDiscount: 27500, // 50% descuento
        finalCopay: 27500,
        notes: "Remoción de biopelícula y pulido coronario con flúor.",
      },
    ];

    // Recorremos las piezas del odontograma con patología o indicación
    odontogram.forEach((tooth) => {
      if (tooth.status === "caries") {
        items.push({
          id: `item-caries-${tooth.toothNumber}`,
          toothNumber: tooth.toothNumber,
          procedureName: `Restauración Estética Resina Nanohíbrida (Pieza #${tooth.toothNumber})`,
          phase: "fase2_curativa",
          basePrice: 65000,
          convenioDiscount: 26000, // 40%
          finalCopay: 39000,
          notes: "Grabado ácido, adhesivo universal y resina color natural.",
        });
      } else if (tooth.status === "corona") {
        items.push({
          id: `item-corona-${tooth.toothNumber}`,
          toothNumber: tooth.toothNumber,
          procedureName: `Corona Cerámica Libre de Metal Zirconio (Pieza #${tooth.toothNumber})`,
          phase: "fase3_rehabilitadora",
          basePrice: 280000,
          convenioDiscount: 84000, // 30%
          finalCopay: 196000,
          notes: "Preparación biológica, muñón y cementación de alta fijación.",
        });
      } else if (tooth.status === "implante") {
        items.push({
          id: `item-implante-${tooth.toothNumber}`,
          toothNumber: tooth.toothNumber,
          procedureName: `Implante Titanio Osteointegrado Grado Médico (Pieza #${tooth.toothNumber})`,
          phase: "fase3_rehabilitadora",
          basePrice: 650000,
          convenioDiscount: 162500, // 25%
          finalCopay: 487500,
          notes: "Perno intraóseo guiado + tornillo de cicatrización.",
        });
      } else if (tooth.status === "extraccion_indicada") {
        items.push({
          id: `item-exodoncia-${tooth.toothNumber}`,
          toothNumber: tooth.toothNumber,
          procedureName: `Exodoncia Quirúrgica Compleja / Simple (Pieza #${tooth.toothNumber})`,
          phase: "fase2_curativa",
          basePrice: 45000,
          convenioDiscount: 18000, // 40%
          finalCopay: 27000,
          notes: "Anestesia local sin dolor y sutura reabsorbible.",
        });
      }
    });

    const totalBasePrice = items.reduce((acc, it) => acc + it.basePrice, 0);
    const totalDiscount = items.reduce((acc, it) => acc + it.convenioDiscount, 0);
    const totalCopay = items.reduce((acc, it) => acc + it.finalCopay, 0);

    return {
      id: `BH-PTO-${Date.now().toString(36).toUpperCase()}`,
      patientId: "paciente_activo",
      patientName,
      patientRut,
      date: new Date().toLocaleDateString("es-CL", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
      items,
      totalBasePrice,
      totalDiscount,
      totalCopay,
      status: "propuesto",
    };
  }, [odontogram, patientName, patientRut]);

  const fase1 = budget.items.filter((it) => it.phase === "fase1_preventiva");
  const fase2 = budget.items.filter((it) => it.phase === "fase2_curativa");
  const fase3 = budget.items.filter((it) => it.phase === "fase3_rehabilitadora");

  const abonoInicial30 = Math.round(budget.totalCopay * 0.3);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const whatsappMessage = `Hola Centro Dental BeHappy, soy ${patientName}. He revisado mi presupuesto dental #${budget.id} por un copago final estimado de $${budget.totalCopay.toLocaleString("es-CL")} CLP (${budget.items.length} prestaciones). Deseo coordinar el inicio de la Fase 1.`;

  return (
    <div className="bg-white border border-slate-300 rounded-lg p-6 sm:p-8 space-y-6 shadow-sm print:p-0 print:border-none print:shadow-none">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-mono tracking-[0.24em] text-teal-800 uppercase font-bold">
              PLAN DE TRATAMIENTO CLÍNICO & PRESUPUESTO INTEGRADO
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Presupuesto Odontológico Derivado del Odontograma
          </h2>
          <p className="text-xs font-mono text-slate-500">
            Folio Oficial: {budget.id} · Generado el {budget.date} · Validez arancelaria: 30 días corridos
          </p>
        </div>

        <div className="flex items-center gap-2 print:hidden">
          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-2 border border-slate-300 hover:border-slate-800 bg-white text-slate-800 text-xs font-mono uppercase tracking-wider rounded transition flex items-center gap-1.5 shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir / PDF</span>
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-800 rounded transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Patient & Beneficiary Data */}
      <div className="bg-slate-50 border border-slate-200 p-4 rounded text-xs font-mono grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <span className="text-slate-400 block text-[10px] uppercase">PACIENTE TITULAR:</span>
          <strong className="text-slate-900 block text-xs">{patientName}</strong>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px] uppercase">RUT / IDENTIFICACIÓN:</span>
          <strong className="text-slate-900 block text-xs">{patientRut}</strong>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px] uppercase">COBERTURA CONVENIO:</span>
          <strong className="text-emerald-700 block text-xs">Club BeHappy Activo ({convenioLevel})</strong>
        </div>
      </div>

      {/* Itemized Phases Breakdown */}
      <div className="space-y-6 text-xs font-mono">
        
        {/* FASE 1: PREVENTIVA */}
        {fase1.length > 0 && (
          <div className="border border-slate-200 rounded overflow-hidden">
            <div className="bg-slate-100/80 px-4 py-2 border-b border-slate-200 flex items-center justify-between text-slate-800">
              <span className="font-bold uppercase tracking-wider text-[11px]">
                FASE 1 · DIAGNÓSTICO, HIGIENE & TERAPIA BÁSICA
              </span>
              <span className="text-[10px] text-slate-500">{fase1.length} Prestaciones</span>
            </div>
            <div className="divide-y divide-slate-100">
              {fase1.map((item) => (
                <div key={item.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/50">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-slate-900 text-xs block">{item.procedureName}</span>
                    <span className="text-[10px] text-slate-500 font-light block">{item.notes}</span>
                  </div>
                  <div className="text-right sm:shrink-0 font-mono">
                    <span className="text-slate-400 text-[10px] line-through block">
                      ${item.basePrice.toLocaleString("es-CL")}
                    </span>
                    <span className="font-bold text-slate-900 text-xs block">
                      ${item.finalCopay.toLocaleString("es-CL")} CLP
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FASE 2: CURATIVA (CARIES / EXODONCIAS) */}
        {fase2.length > 0 && (
          <div className="border border-slate-200 rounded overflow-hidden">
            <div className="bg-amber-50 px-4 py-2 border-b border-amber-200 flex items-center justify-between text-amber-950">
              <span className="font-bold uppercase tracking-wider text-[11px]">
                FASE 2 · TERAPIA CURATIVA & ELIMINACIÓN DE FOCOS INFECCIOSOS
              </span>
              <span className="text-[10px] text-amber-800">{fase2.length} Piezas Comprometidas</span>
            </div>
            <div className="divide-y divide-slate-100">
              {fase2.map((item) => (
                <div key={item.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/50">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 text-xs">{item.procedureName}</span>
                      {item.toothNumber && (
                        <span className="px-1.5 py-0.2 bg-amber-100 text-amber-900 rounded text-[9px] font-bold">
                          FDI #{item.toothNumber}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 font-light block">{item.notes}</span>
                  </div>
                  <div className="text-right sm:shrink-0 font-mono">
                    <span className="text-slate-400 text-[10px] line-through block">
                      ${item.basePrice.toLocaleString("es-CL")}
                    </span>
                    <span className="font-bold text-slate-900 text-xs block">
                      ${item.finalCopay.toLocaleString("es-CL")} CLP
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FASE 3: REHABILITADORA (CORONAS / IMPLANTES) */}
        {fase3.length > 0 && (
          <div className="border border-slate-200 rounded overflow-hidden">
            <div className="bg-teal-50 px-4 py-2 border-b border-teal-200 flex items-center justify-between text-teal-950">
              <span className="font-bold uppercase tracking-wider text-[11px]">
                FASE 3 · REHABILITACIÓN ORAL, IMPLANTES & ESTÉTICA AVANZADA
              </span>
              <span className="text-[10px] text-teal-800">{fase3.length} Procedimientos Complejos</span>
            </div>
            <div className="divide-y divide-slate-100">
              {fase3.map((item) => (
                <div key={item.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/50">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 text-xs">{item.procedureName}</span>
                      {item.toothNumber && (
                        <span className="px-1.5 py-0.2 bg-teal-100 text-teal-900 rounded text-[9px] font-bold">
                          FDI #{item.toothNumber}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 font-light block">{item.notes}</span>
                  </div>
                  <div className="text-right sm:shrink-0 font-mono">
                    <span className="text-slate-400 text-[10px] line-through block">
                      ${item.basePrice.toLocaleString("es-CL")}
                    </span>
                    <span className="font-bold text-slate-900 text-xs block">
                      ${item.finalCopay.toLocaleString("es-CL")} CLP
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Financial Ledger Totals */}
      <div className="bg-slate-900 text-white p-6 rounded-lg space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-slate-800 pb-4 text-xs font-mono">
          <div>
            <span className="text-slate-400 uppercase text-[10px] block">Arancel Mercado Referencial:</span>
            <span className="text-base text-slate-300 line-through">
              ${budget.totalBasePrice.toLocaleString("es-CL")} CLP
            </span>
          </div>

          <div>
            <span className="text-emerald-400 uppercase text-[10px] block">Bonificación Club BeHappy:</span>
            <span className="text-base font-bold text-emerald-400">
              - ${budget.totalDiscount.toLocaleString("es-CL")} CLP
            </span>
          </div>

          <div>
            <span className="text-slate-300 uppercase text-[10px] block">Copago Neto a Pagar:</span>
            <span className="text-2xl sm:text-3xl font-bold font-mono text-white">
              ${budget.totalCopay.toLocaleString("es-CL")} CLP
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <div className="space-y-0.5 text-slate-300 text-[11px]">
            <span>✓ Boleta médica electrónica disponible para reembolso Isapre</span>
            <span className="block">✓ Facilidad de pago: Hasta 12 cuotas sin interés Transbank / Webpay Plus</span>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap gap-2.5 print:hidden">
            {onPayWithFlow ? (
              <button
                type="button"
                onClick={() => onPayWithFlow(abonoInicial30, `Abono Inicial (30%) Presupuesto ${budget.id}`)}
                className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold uppercase tracking-wider rounded transition flex items-center gap-1.5 shadow-sm text-xs cursor-pointer"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Pagar Abono Inicial 30% (${abonoInicial30.toLocaleString("es-CL")})</span>
              </button>
            ) : null}

            <a
              href={createWhatsAppUrl(whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-900 font-bold uppercase tracking-wider rounded transition flex items-center gap-1.5 text-xs shadow-sm"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Aceptar por WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Chilean Medical Disclaimer & Legal Terms */}
      <div className="text-[10px] font-mono text-slate-400 border-t border-slate-100 pt-3 text-center space-y-1">
        <p>
          Centro Dental BeHappy SpA · Suecia 3580, Oficina 304, Ñuñoa, Santiago · Acreditado por Superintendencia de Salud.
        </p>
        <p>
          Este presupuesto clínico constituye una estimación técnico-económica basada en el examen clínico y radiográfico. Válido por 30 días corridos a contar de su fecha de emisión.
        </p>
      </div>

    </div>
  );
}
