"use client";

import React from "react";
import { X, Printer, ShieldCheck, FileCheck, Stethoscope } from "lucide-react";
import { ClinicalRecord, UserProfile } from "@/types/auth";
import { CLINIC_INFO } from "@/data/clinicInfo";

interface ClinicalDocumentModalProps {
  record: ClinicalRecord;
  patient?: UserProfile | null;
  onClose: () => void;
}

export function ClinicalDocumentModal({
  record,
  patient,
  onClose,
}: ClinicalDocumentModalProps) {
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const patientName = patient?.fullName || record.patientId || "Paciente BeHappy";
  const patientRut = patient?.rut || "Sin RUT";
  const patientPrevision = patient?.prevision || "Fonasa / Isapre";
  const folioCode = `BH-MED-${record.id.slice(-6).toUpperCase()}`;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-300 rounded-lg max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8 print:p-0 print:border-none print:shadow-none print:m-0">
        
        {/* Modal Controls (Hidden in print) */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-mono tracking-widest text-slate-700 uppercase font-bold">
              DOCUMENTO MÉDICO LEGAL AUDITABLE (LEY 20.584 CHILE)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-mono uppercase tracking-wider rounded transition flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-900 rounded transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE LEGAL DOCUMENT CONTAINER */}
        <div className="space-y-6 text-[#141413]">
          
          {/* Institutional Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono tracking-[0.22em] text-slate-500 uppercase block">
                REPÚBLICA DE CHILE · SUPERINTENDENCIA DE SALUD
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                CENTRO DENTAL BEHAPPY
              </h2>
              <p className="text-xs font-mono text-slate-600">
                RUT: 77.412.980-3 · Sede Central: Suecia 3580, OF. 304, Ñuñoa, Santiago
              </p>
              <p className="text-[11px] font-mono text-slate-500">
                Tel: +56 9 4757 8597 · Email: contacto@behappydental.cl · www.behappydental.cl
              </p>
            </div>

            <div className="text-right font-mono text-xs space-y-0.5">
              <span className="text-[10px] uppercase text-slate-400 block tracking-widest">FOLIO CLÍNICO</span>
              <span className="text-sm font-bold text-slate-900 block">{folioCode}</span>
              <span className="text-[11px] text-slate-600 block">Fecha: {record.date}</span>
            </div>
          </div>

          {/* Patient Identification Card */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded text-xs font-mono space-y-2">
            <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold block">
              IDENTIFICACIÓN DEL PACIENTE TITULAR
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <span className="text-slate-500 block text-[10px]">NOMBRE COMPLETO:</span>
                <strong className="text-slate-900 block text-xs">{patientName}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">RUT O PASAPORTE:</span>
                <strong className="text-slate-900 block text-xs">{patientRut}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">PREVISIÓN / SALUD:</span>
                <strong className="text-slate-900 block text-xs">{patientPrevision}</strong>
              </div>
            </div>
          </div>

          {/* Attending Professional */}
          <div className="border border-slate-200 p-3.5 rounded text-xs font-mono flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold block">
                ODONTÓLOGO TRATANTE
              </span>
              <span className="text-sm font-bold text-slate-900">{record.doctorName}</span>
              <span className="text-[11px] text-slate-500 block">Cirujano Dentista · Registro SIS Acreditado</span>
            </div>
            <div className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold rounded">
              Acreditación Vigente ✓
            </div>
          </div>

          {/* Clinical Evolution & SOAP Section */}
          <div className="space-y-4 text-xs font-mono">
            
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block">
                1. DIAGNÓSTICO CLÍNICO ODONTOLÓGICO (CIE-10 / FDI)
              </span>
              <div className="p-3 bg-white border border-slate-300 rounded text-slate-900 font-medium">
                {record.diagnosis}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block">
                2. PROCEDIMIENTO REALIZADO & NOTA DE EVOLUCIÓN
              </span>
              <div className="p-3 bg-white border border-slate-300 rounded text-slate-800 leading-relaxed font-light">
                {record.treatmentPerformed}
              </div>
            </div>

            {/* Electronic Prescription Box */}
            {record.prescription && (
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-teal-800 font-bold block">
                  3. RECETA MÉDICA & INDICACIONES TERAPÉUTICAS POST-OPERATORIAS
                </span>
                <div className="p-4 bg-teal-50/50 border border-teal-200 rounded text-slate-900 space-y-2">
                  <p className="text-xs font-medium">{record.prescription}</p>
                  <p className="text-[10px] text-slate-500 font-light italic">
                    Indicaciones de uso obligatorio. En caso de reacción adversa o dolor persistente, contactar a la central médica de Suecia 3580.
                  </p>
                </div>
              </div>
            )}

            {/* Next Clinical Control */}
            {record.nextStep && (
              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded text-xs">
                <span className="text-slate-600">Próximo Control Clínico Programado:</span>
                <strong className="text-slate-900">{record.nextStep}</strong>
              </div>
            )}

          </div>

          {/* Legal Signatures & Stamp */}
          <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-xs font-mono">
            <div className="space-y-1">
              <div className="h-14 border-b border-dashed border-slate-300 flex items-end justify-center pb-1">
                <span className="text-[10px] text-slate-400 italic font-sans font-light">Firma Electrónica Acreditada</span>
              </div>
              <span className="font-bold text-slate-900 block">{record.doctorName}</span>
              <span className="text-[10px] text-slate-500 block">Cirujano Dentista · Centro Dental BeHappy</span>
            </div>

            <div className="space-y-1">
              <div className="h-14 border-b border-dashed border-slate-300 flex items-end justify-center pb-1">
                <span className="text-[10px] text-slate-400 italic font-sans font-light">Timbre Oficial de Sede</span>
              </div>
              <span className="font-bold text-slate-900 block">Dirección Técnica BeHappy</span>
              <span className="text-[10px] text-slate-500 block">Suecia 3580, OF. 304, Ñuñoa</span>
            </div>
          </div>

          {/* Legal Disclaimers */}
          <div className="text-[9px] font-mono text-slate-400 text-center pt-2">
            Documento emitido en conformidad con la Ley Nº 20.584 que regula los derechos y deberes que tienen las personas en relación con acciones vinculadas a su atención en salud. Válido para presentación ante Isapres y Seguros Complementarios de Salud en Chile.
          </div>

        </div>

      </div>
    </div>
  );
}
