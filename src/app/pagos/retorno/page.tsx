"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  MessageCircle,
  FileText,
  Printer,
  ShieldCheck,
  ArrowRight,
  AlertCircle
} from "lucide-react";
import { CLINIC_INFO, createWhatsAppUrl } from "@/data/clinicInfo";

interface PaymentDetails {
  status: number;
  flowOrder: number | string;
  commerceOrder: string;
  amount: number;
  subject: string;
  payer: string;
  patientName?: string;
  date: string;
  isSimulated?: boolean;
}

function RetornoPagoContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const isSimulatedParam = searchParams.get("simulated") === "true";
  const orderParam = searchParams.get("order");
  const amountParam = searchParams.get("amount");
  const subjectParam = searchParams.get("subject");
  const patientParam = searchParams.get("patient");
  const emailParam = searchParams.get("email");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payment, setPayment] = useState<PaymentDetails | null>(null);

  useEffect(() => {
    if (!token && !orderParam) {
      setError("No se detectó un token de pago o número de orden válido.");
      setLoading(false);
      return;
    }

    if (isSimulatedParam || (token && token.startsWith("FLOW_SIM_"))) {
      setPayment({
        status: 2,
        flowOrder: `SIM-${Math.floor(100000 + Math.random() * 900000)}`,
        commerceOrder: orderParam || "BH-RESERVA-01",
        amount: Number(amountParam || 10000),
        subject: subjectParam || "Abono de Reserva Dental en Box",
        payer: emailParam || "contacto@behappydental.cl",
        patientName: patientParam || "Paciente BeHappy",
        date: new Date().toLocaleDateString("es-CL", {
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        isSimulated: true,
      });
      setLoading(false);
      return;
    }

    // Consultar estado real a la API
    async function fetchStatus() {
      try {
        const res = await fetch(`/api/pagos/flow/status?token=${token}`);
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "No se pudo verificar el estado en Flow.");
        }

        setPayment({
          status: data.status,
          flowOrder: data.flowOrder,
          commerceOrder: data.commerceOrder || orderParam || "BH-WEB",
          amount: data.amount,
          subject: data.subject,
          payer: data.payer,
          patientName: patientParam || "Paciente BeHappy",
          date: new Date().toLocaleDateString("es-CL", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          isSimulated: false,
        });
      } catch (err: any) {
        setError(err.message || "Error al verificar la transacción.");
      } finally {
        setLoading(false);
      }
    }

    fetchStatus();
  }, [token, isSimulatedParam, orderParam, amountParam, subjectParam, patientParam, emailParam]);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 px-4 bg-[#faf8f5]">
        <div className="w-10 h-10 border-2 border-[#141413] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-mono tracking-widest uppercase text-[#78736a]">
          Validando comprobante con Flow.cl...
        </p>
      </div>
    );
  }

  if (error || !payment) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 px-4 bg-[#faf8f5] text-center max-w-lg mx-auto">
        <AlertCircle className="w-12 h-12 text-rose-600" />
        <h1 className="text-2xl font-normal text-[#141413]">No se pudo validar el pago</h1>
        <p className="text-xs text-[#66635d] font-light leading-relaxed">
          {error || "La transacción no pudo ser verificada. Si el dinero fue descontado de su cuenta, contacte a nuestro equipo de recepción con el comprobante bancario."}
        </p>
        <div className="pt-4 flex gap-3">
          <Link
            href="/"
            className="px-5 py-2.5 bg-[#141413] text-white text-xs font-mono uppercase tracking-wider"
          >
            Volver al Inicio
          </Link>
          <a
            href={createWhatsAppUrl("Hola, tuve un inconveniente con el pago online en el sitio web.")}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 border border-[#141413] text-[#141413] text-xs font-mono uppercase tracking-wider"
          >
            Asistencia WhatsApp
          </a>
        </div>
      </div>
    );
  }

  const isSuccess = payment.status === 2;

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 bg-[#faf8f5] min-h-[85vh] text-[#141413]">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Success Card Voucher */}
        <div className="bg-white border border-[#141413] p-8 sm:p-10 shadow-sm relative space-y-8">
          
          {/* Header */}
          <div className="flex items-start justify-between border-b border-[#e5e0d5] pb-6 gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono tracking-[0.24em] text-[#78736a] uppercase block">
                COMPROBANTE DE PAGO CLÍNICO ELECTRÓNICO
              </span>
              <h1 className="text-2xl sm:text-3xl font-normal tracking-tight text-[#141413]">
                {isSuccess ? "¡Pago Confirmado Exitosamente!" : "Estado de Transacción"}
              </h1>
              <p className="text-xs font-mono text-[#66635d]">
                Centro Dental BeHappy SpA · Suecia 3580, OF. 304, Ñuñoa
              </p>
            </div>

            <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-7 h-7 text-emerald-600" />
            </div>
          </div>

          {/* Simulation Alert Badge if applicable */}
          {payment.isSimulated && (
            <div className="bg-amber-50 border border-amber-200 p-3 rounded text-[11px] font-mono text-amber-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                <strong>Modo Simulación Resiliente Flow:</strong> Comprobante generado para entorno de demostración y pruebas sin cobro real bancario.
              </span>
            </div>
          )}

          {/* Voucher Ledger */}
          <div className="space-y-4 text-xs font-mono divide-y divide-[#f0ede6]">
            
            <div className="flex justify-between items-center pt-2">
              <span className="text-[#78736a] uppercase">Folio Flow / Transacción:</span>
              <span className="font-bold text-[#141413]">#{payment.flowOrder}</span>
            </div>

            <div className="flex justify-between items-center pt-3">
              <span className="text-[#78736a] uppercase">Orden de Comercio:</span>
              <span className="text-[#141413]">{payment.commerceOrder}</span>
            </div>

            <div className="flex justify-between items-center pt-3">
              <span className="text-[#78736a] uppercase">Concepto / Prestación:</span>
              <span className="font-medium text-[#141413] text-right max-w-xs">{payment.subject}</span>
            </div>

            <div className="flex justify-between items-center pt-3">
              <span className="text-[#78736a] uppercase">Paciente / Titular:</span>
              <span className="text-[#141413]">{payment.patientName || payment.payer}</span>
            </div>

            <div className="flex justify-between items-center pt-3">
              <span className="text-[#78736a] uppercase">Correo de Confirmación:</span>
              <span className="text-[#141413]">{payment.payer}</span>
            </div>

            <div className="flex justify-between items-center pt-3">
              <span className="text-[#78736a] uppercase">Fecha de Emisión:</span>
              <span className="text-[#141413]">{payment.date}</span>
            </div>

            <div className="flex justify-between items-baseline pt-4 border-t-2 border-[#141413]">
              <div>
                <span className="text-xs uppercase font-bold text-[#141413] block">Total Pagado:</span>
                <span className="text-[10px] text-emerald-700 font-mono">Medio de pago Webpay Plus / Flow CLP</span>
              </div>
              <span className="text-2xl sm:text-3xl font-bold font-mono text-[#141413]">
                ${payment.amount.toLocaleString("es-CL")} CLP
              </span>
            </div>

          </div>

          {/* Clinical Instructions */}
          <div className="bg-[#faf8f5] border border-[#e5e0d5] p-5 space-y-2 text-xs">
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#78736a] block">
              INSTRUCCIONES PARA TU VISITA EN SUECIA 3580:
            </span>
            <ul className="space-y-1.5 text-[#55524d] font-light leading-relaxed">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#141413] shrink-0 mt-0.5" />
                <span>Presentarte 10 minutos antes en Suecia 3580, Oficina 304, Ñuñoa.</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-[#141413] shrink-0 mt-0.5" />
                <span>Tu box y profesional tratante ya cuentan con tu reserva confirmada en sistema.</span>
              </li>
              <li className="flex items-start gap-2">
                <FileText className="w-3.5 h-3.5 text-[#141413] shrink-0 mt-0.5" />
                <span>Si tienes radiografías previas de los últimos 6 meses, puedes traerlas físicamente o compartirlas por WhatsApp.</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handlePrint}
              type="button"
              className="flex-1 py-3 px-4 border border-[#141413] text-[#141413] hover:bg-[#141413] hover:text-white font-mono text-xs uppercase tracking-wider font-semibold transition flex items-center justify-center gap-2"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir Comprobante</span>
            </button>

            <a
              href={createWhatsAppUrl(
                `¡Hola Centro Dental BeHappy! Acabo de realizar el pago del comprobante #${payment.flowOrder} (${payment.subject}). Deseo validar la hora con recepción.`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs uppercase tracking-wider font-semibold transition flex items-center justify-center gap-2 shadow-sm"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Avisar por WhatsApp</span>
            </a>
          </div>

          <div className="pt-2 text-center">
            <Link
              href="/portal"
              className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#141413] hover:underline"
            >
              <span>Ir a mi Ficha en Portal BeHappy OS</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}

export default function RetornoPagoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 px-4 bg-[#faf8f5]">
          <div className="w-10 h-10 border-2 border-[#141413] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-mono tracking-widest uppercase text-[#78736a]">
            Cargando confirmación de pago...
          </p>
        </div>
      }
    >
      <RetornoPagoContent />
    </Suspense>
  );
}
