"use client";

import React, { useState, useRef } from "react";
import { X, CheckCircle2, Printer, ShieldCheck, PenTool, RotateCcw, AlertTriangle } from "lucide-react";
import { InformedConsent } from "@/types/auth";
import { CLINIC_INFO } from "@/data/clinicInfo";

interface InformedConsentModalProps {
  patientName: string;
  patientRut?: string;
  doctorName?: string;
  initialProcedure?: "cirugia_exodoncia" | "endodoncia" | "implantes" | "ortodoncia" | "estetica";
  onClose: () => void;
  onConsentSigned?: (consent: InformedConsent) => void;
}

const CONSENT_TEMPLATES = {
  cirugia_exodoncia: {
    title: "Consentimiento Informado para Cirugía Bucal & Extracción Dental",
    kicker: "PROTOCOLO QUIRÚRGICO DE EXODONCIA · MINSAL & LEY 20.584",
    description:
      "Procedimiento quirúrgico destinado a la remoción de piezas dentales comprometidas, restos radiculares o terceros molares (muelas del juicio).",
    risks: [
      "Molestia o dolor post-quirúrgico controlable con la analgesia prescrita.",
      "Inflamación facial, edema y posible hematoma en las primeras 48 a 72 horas.",
      "Alveolitis (infección/inflamación del alvéolo) en caso de pérdida prematura del coágulo por fumar o escupir.",
      "Parestesia o adormecimiento transitorio en labio o lengua por proximidad anatómica al nervio dentario inferior (infrecuente).",
      "Necesidad eventual de sutura y retiro de puntos a los 7 días.",
    ],
    postOpCare:
      "Morder la gasa firmemente por 30-45 minutos. No escupir, no fumar, no ingerir bebidas calientes ni alcohólicas por 48 horas. Dieta blanda fría y reposo relativo.",
  },
  endodoncia: {
    title: "Consentimiento Informado para Tratamiento de Endodoncia Mecanizada",
    kicker: "TERAPIA ENDODÓNTICA AVANZADA · LEY 20.584",
    description:
      "Tratamiento para desinfectar y obturar el sistema de conductos radiculares de la pieza dental ante pulpitis irreversible o necrosis pulpar.",
    risks: [
      "Sensibilidad a la masticación en los días posteriores a la instrumentación.",
      "Anatomía radicular compleja o calcificaciones que requieran sesiones complementarias.",
      "Riesgo de fractura coronaria de la pieza desvitalizada si no se rehabilita con incrustación o corona definitiva oportunamente.",
    ],
    postOpCare:
      "Evitar masticar alimentos duros con la pieza tratada hasta que se instale la restauración definitiva. Tomar analgésicos según receta médica.",
  },
  implantes: {
    title: "Consentimiento Informado para Cirugía de Implantes Dentales de Titanio",
    kicker: "IMPLANTOLOGÍA OSTEOINTEGRADA · LEY 20.584",
    description:
      "Inserción de fijación de titanio biocompatible grado médico en el hueso maxilar o mandibular para sustituir la raíz biológica ausente.",
    risks: [
      "Riesgo de no-osteointegración biológica del implante (tasa global < 3% en no fumadores).",
      "Inflamación y hematoma local esperado post-colocación.",
      "Necesidad de injerto óseo o biomaterial complementario si la densidad o volumen óseo lo amerita.",
    ],
    postOpCare:
      "Higiene oral estricta con clorhexidina 0.12%. Prohibición absoluta de tabaco durante la cicatrización ósea. Dieta blanda 10 días.",
  },
  ortodoncia: {
    title: "Consentimiento Informado para Ortodoncia & Alineadores Invisalign®",
    kicker: "ORTODONCIA CLÍNICA & ALINEACIÓN · LEY 20.584",
    description:
      "Tratamiento de alineación y corrección oclusal mediante alineadores transparentes termoplásticos o brackets de baja fricción.",
    risks: [
      "Molestia o presión dental los primeros 2 a 3 días posteriores al cambio de alineador o ajuste.",
      "Posible recaída o recidiva si el paciente no utiliza los retenedores nocturnos post-tratamiento de forma rigurosa.",
      "Riesgo de descalcificaciones o manchas si no se mantiene una técnica de cepillado e higiene interproximal impecable.",
    ],
    postOpCare:
      "Uso de alineadores mínimo 22 horas al día (retirar solo para comer y cepillarse). Asistir a controles periódicos según indicación del especialista tratante.",
  },
  estetica: {
    title: "Consentimiento Informado para Aclaramiento Dental & Estética en Box",
    kicker: "ODONTOLOGÍA ESTÉTICA & BLANQUEAMIENTO · LEY 20.584",
    description:
      "Procedimiento clínico de fotoactivación LED para aclaramiento del esmalte dental o aplicación de carillas/resinas directas de alta gama.",
    risks: [
      "Sensibilidad dental transitoria al frío o calor durante las 24 a 48 horas posteriores.",
      "Leve irritación gingival reversible si el gel blanqueador contacta el margen de la encía.",
      "Las tapaduras, resinas y coronas previas no cambian de color con el blanqueamiento y podrían requerir recambio posterior.",
    ],
    postOpCare:
      "Dieta blanca estricta durante 72 horas: no consumir café, té, vino tinto, mate, bebidas cola, salsas rojas ni tabaco.",
  },
};

export function InformedConsentModal({
  patientName,
  patientRut = "",
  doctorName = "Doctor Tratante",
  initialProcedure = "cirugia_exodoncia",
  onClose,
  onConsentSigned,
}: InformedConsentModalProps) {
  const [procedure, setProcedure] = useState<keyof typeof CONSENT_TEMPLATES>(initialProcedure);
  const [signatureMode, setSignatureMode] = useState<"drawn" | "digital">("digital");
  const [digitalAcceptance, setDigitalAcceptance] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const [signatureDate, setSignatureDate] = useState(
    new Date().toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  );

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const currentTemplate = CONSENT_TEMPLATES[procedure];

  // Canvas drawing handlers (mouse & touch)
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.stroke();
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const touch = e.touches[0];
    if (!touch) return;
    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const touch = e.touches[0];
    if (!touch) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.stroke();
  };

  const handleTouchEnd = () => {
    setIsDrawing(false);
  };

  const handleClearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleConfirmSignature = () => {
    setIsSigned(true);
    let signatureUrl: string | undefined = undefined;
    if (canvasRef.current) {
      try {
        signatureUrl = canvasRef.current.toDataURL("image/png");
      } catch (err) {
        console.warn("Error converting signature canvas:", err);
      }
    }

    if (onConsentSigned) {
      onConsentSigned({
        id: `BH-CI-${Date.now().toString(36).toUpperCase()}`,
        patientId: "paciente_activo",
        patientName,
        patientRut,
        doctorName,
        procedureType: procedure,
        title: currentTemplate.title,
        signedDate: signatureDate,
        signatureDataUrl: signatureUrl,
        status: "firmado",
      });
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-300 rounded-lg max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8 print:p-0 print:border-none print:shadow-none print:m-0">
        
        {/* Modal Controls (Hidden in Print) */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest text-slate-700 uppercase font-bold">
              DOCUMENTO MÉDICO LEGAL OBLIGATORIO · LEY 20.584 CHILE
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 bg-white border border-slate-300 hover:border-slate-800 text-slate-800 text-xs font-mono uppercase tracking-wider rounded transition flex items-center gap-1.5 shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-800 rounded transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Procedure Selector Pill Bar (Hidden in Print) */}
        <div className="flex flex-wrap gap-1.5 print:hidden border-b border-slate-100 pb-3">
          {(Object.keys(CONSENT_TEMPLATES) as (keyof typeof CONSENT_TEMPLATES)[]).map((key) => {
            const isSelected = procedure === key;
            const names: Record<string, string> = {
              cirugia_exodoncia: "Cirugía & Exodoncia",
              endodoncia: "Endodoncia",
              implantes: "Implantes Titanio",
              ortodoncia: "Invisalign / Ortodoncia",
              estetica: "Blanqueamiento & Estética",
            };
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setProcedure(key);
                  setIsSigned(false);
                }}
                className={`px-3 py-1.5 rounded text-xs font-mono uppercase tracking-wider transition ${
                  isSelected
                    ? "bg-slate-900 text-white font-bold shadow-xs"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                {names[key]}
              </button>
            );
          })}
        </div>

        {/* PRINTABLE LEGAL CONSENT CONTAINER */}
        <div className="space-y-6 text-[#141413]">
          
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono tracking-[0.24em] text-slate-500 uppercase block">
                {currentTemplate.kicker}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                {currentTemplate.title}
              </h2>
              <p className="text-xs font-mono text-slate-600">
                Centro Dental BeHappy SpA · Suecia 3580, OF. 304, Ñuñoa · SIS: 16.128.940-K
              </p>
            </div>

            <div className="text-right font-mono text-xs shrink-0">
              <span className="text-[10px] text-slate-400 block uppercase">FECHA EMISIÓN</span>
              <span className="font-bold text-slate-900">{signatureDate.split(",")[0]}</span>
            </div>
          </div>

          {/* Parties Identification */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded text-xs font-mono grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <span className="text-slate-400 uppercase text-[10px] block">PACIENTE TITULAR:</span>
              <strong className="text-slate-900 text-xs">{patientName}</strong>
              <span className="text-slate-500 block text-[11px]">RUT: {patientRut}</span>
            </div>
            <div>
              <span className="text-slate-400 uppercase text-[10px] block">ODONTÓLOGO RESPONSABLE:</span>
              <strong className="text-slate-900 text-xs">{doctorName}</strong>
              <span className="text-slate-500 block text-[11px]">Cirujano Dentista · Centro Dental BeHappy</span>
            </div>
          </div>

          {/* Description & Objective */}
          <div className="space-y-2 text-xs leading-relaxed">
            <span className="font-mono text-[10px] uppercase font-bold text-slate-700 tracking-wider block">
              1. NATURALEZA Y OBJETIVO DEL PROCEDIMIENTO:
            </span>
            <p className="text-slate-700 font-light">{currentTemplate.description}</p>
          </div>

          {/* Risks & Adverse Effects */}
          <div className="space-y-2 text-xs leading-relaxed">
            <span className="font-mono text-[10px] uppercase font-bold text-slate-700 tracking-wider block">
              2. RIESGOS INHERENTES Y POSIBLES MOLESTIAS (DECLARACIÓN LEY 20.584):
            </span>
            <ul className="space-y-1.5 list-disc list-inside text-slate-700 font-light pl-1">
              {currentTemplate.risks.map((risk, idx) => (
                <li key={idx}>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Post-Op Care */}
          <div className="bg-slate-50 p-4 border border-slate-200 rounded text-xs space-y-1">
            <span className="font-mono text-[10px] uppercase font-bold text-slate-800 tracking-wider block">
              3. CUIDADOS POST-OPERATORIOS Y ADVERTENCIAS CLÍNICAS:
            </span>
            <p className="text-slate-700 font-light leading-relaxed">{currentTemplate.postOpCare}</p>
          </div>

          {/* Legal Acceptance Declaration */}
          <div className="border border-slate-300 p-4 rounded text-xs space-y-3 bg-white">
            <span className="font-mono text-[10px] uppercase font-bold text-slate-900 tracking-wider block">
              4. DECLARACIÓN DE VOLUNTAD DEL PACIENTE:
            </span>
            <p className="text-slate-700 font-light leading-relaxed italic text-[11px]">
              "Declaro que el profesional tratante me ha explicado en lenguaje claro la naturaleza de la intervención indicada, sus alternativas, riesgos y pronóstico. He tenido la oportunidad de formular todas las preguntas necesarias, las cuales han sido respondidas satisfactoriamente. Por lo tanto, en pleno uso de mis facultades y en conformidad con la Ley Nº 20.584, manifiesto libre y voluntariamente mi consentimiento para la realización de dicho procedimiento odontológico."
            </p>

            {/* Verification Checkbox */}
            {!isSigned && (
              <label className="flex items-center gap-2 pt-2 border-t border-slate-100 cursor-pointer print:hidden">
                <input
                  type="checkbox"
                  checked={digitalAcceptance}
                  onChange={(e) => setDigitalAcceptance(e.target.checked)}
                  className="w-4 h-4 text-slate-900 rounded border-slate-300 focus:ring-slate-900"
                />
                <span className="text-xs font-mono text-slate-800">
                  He leído, comprendo y acepto los términos de este consentimiento clínico.
                </span>
              </label>
            )}
          </div>

          {/* Digital Signature Pad / Status */}
          <div className="pt-2">
            {isSigned ? (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded text-xs font-mono space-y-2">
                <div className="flex items-center gap-2 text-emerald-900 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>CONSENTIMIENTO INFORMADO FIRMADO ELECTRÓNICAMENTE ✓</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-emerald-800">
                  <span>Firmante: {patientName} (RUT {patientRut})</span>
                  <span>Marca Temporal: {signatureDate}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3 print:hidden">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500 uppercase text-[10px] font-bold">
                    Firma Manuscrita del Paciente en Sillón (Opcional):
                  </span>
                  <button
                    type="button"
                    onClick={handleClearSignature}
                    className="text-slate-400 hover:text-slate-800 flex items-center gap-1 text-[10px]"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Limpiar Trazo</span>
                  </button>
                </div>

                <div className="border border-slate-300 rounded bg-slate-50/50">
                  <canvas
                    ref={canvasRef}
                    width={500}
                    height={100}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    className="w-full h-24 cursor-crosshair touch-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Professional Stamp / Signature Area */}
          <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-xs font-mono">
            <div className="space-y-1">
              <div className="h-12 border-b border-dashed border-slate-300 flex items-end justify-center pb-1">
                {isSigned ? (
                  <span className="text-xs font-bold font-mono text-emerald-800">
                    Firmado por {patientName}
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400 italic">Firma del Paciente / Representante</span>
                )}
              </div>
              <span className="font-bold text-slate-900 block">{patientName}</span>
              <span className="text-[10px] text-slate-500 block">RUT: {patientRut}</span>
            </div>

            <div className="space-y-1">
              <div className="h-12 border-b border-dashed border-slate-300 flex items-end justify-center pb-1">
                <span className="text-xs font-bold font-mono text-slate-800">
                  Firma Electrónica Acreditada
                </span>
              </div>
              <span className="font-bold text-slate-900 block">{doctorName}</span>
              <span className="text-[10px] text-slate-500 block">Cirujano Dentista · Centro Dental BeHappy</span>
            </div>
          </div>

          {/* Action Bar (Print Hidden) */}
          {!isSigned && (
            <div className="pt-4 flex items-center justify-end gap-3 print:hidden border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 rounded text-xs font-mono uppercase text-slate-600 hover:border-slate-800"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={!digitalAcceptance}
                onClick={handleConfirmSignature}
                className="px-6 py-2.5 bg-slate-900 hover:bg-black text-white font-mono text-xs uppercase tracking-wider font-bold rounded flex items-center gap-1.5 shadow-sm transition disabled:opacity-40 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Firmar y Guardar en Ficha</span>
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
