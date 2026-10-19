"use client";

import React, { useState } from "react";
import { UserProfile, PatientAppointment } from "@/types/auth";
import { toast } from "sonner";
import {
  CreditCard,
  Crown,
  CheckCircle2,
  Clock,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  DollarSign,
  AlertCircle
} from "lucide-react";

interface FlowClubManagementPanelProps {
  userList: UserProfile[];
  appointments: PatientAppointment[];
}

export function FlowClubManagementPanel({ userList, appointments }: FlowClubManagementPanelProps) {
  const [syncingRut, setSyncingRut] = useState<string | null>(null);

  const clubMembers = userList.filter((u) => u.convenioLevel && u.convenioLevel !== "Ninguno");

  // Calculate flow appointments (abono de reserva de $10.000 o montos de cita)
  const paidAppointments = appointments.filter((a) => a.paymentStatus === "pagado" || a.paymentStatus === "abono_flow");
  const totalFlowRevenue = paidAppointments.reduce((acc, a) => acc + (a.paymentStatus === "abono_flow" ? 10000 : (a.price ?? 35000)), 0);

  const handleSyncConvenio = async (user: UserProfile) => {
    if (!user.rut) {
      toast.error(`El paciente ${user.fullName} no tiene RUT registrado.`);
      return;
    }

    setSyncingRut(user.rut);
    try {
      const res = await fetch("/api/club/convenios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rut: user.rut,
          action: "assign",
        }),
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        toast.success(`Convenio sincronizado en Dentalink para ${user.fullName}`);
      } else {
        toast.info(data.reason || `Sincronización procesada (modo demo o paciente no creado en Dentalink)`);
      }
    } catch {
      toast.error("Error al conectar con el endpoint de convenios");
    } finally {
      setSyncingRut(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest text-emerald-700 uppercase font-bold">
              PASARELA WEB & MEMBRESÍAS RECURRENTES
            </span>
          </div>
          <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Recaudación Flow.cl & Club BeHappy
          </h2>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Cobro en línea de abonos de cita ($10.000 CLP), membresías PAC/PAT y vinculación de convenios a Dentalink
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://www.flow.cl"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-mono uppercase tracking-wider rounded font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <span>Consola Flow.cl</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-1 shadow-2xs">
          <span className="text-[10px] font-mono text-slate-500 uppercase block">Recaudación Abonos Web</span>
          <span className="text-xl font-bold font-mono text-slate-900 block">
            ${totalFlowRevenue.toLocaleString("es-CL")} CLP
          </span>
          <span className="text-[10px] font-mono text-slate-500 block">
            {paidAppointments.length} Abonos confirmados
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-1 shadow-2xs">
          <span className="text-[10px] font-mono text-slate-500 uppercase block">Miembros Club BeHappy</span>
          <span className="text-xl font-bold font-mono text-emerald-600 block">
            {clubMembers.length} Pacientes
          </span>
          <span className="text-[10px] font-mono text-slate-500 block">Con plan de descuento activo</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-1 shadow-2xs">
          <span className="text-[10px] font-mono text-slate-500 uppercase block">Planes Preferentes</span>
          <span className="text-base font-bold font-mono text-slate-900 block">
            {clubMembers.filter((u) => u.convenioLevel === "40%").length} al 40% · {clubMembers.filter((u) => u.convenioLevel === "60%").length} al 60%
          </span>
          <span className="text-[10px] font-mono text-slate-500 block">Aranceles reducidos en sede</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-1 shadow-2xs">
          <span className="text-[10px] font-mono text-slate-500 uppercase block">Pasarela Integrada</span>
          <span className="text-base font-bold font-mono text-slate-900 block">Flow Chile (CLP)</span>
          <span className="text-[10px] font-mono text-slate-500 block">Webpay, Servipag, Mach</span>
        </div>
      </div>

      {/* Club Members Table */}
      <div className="bg-white border border-slate-200 rounded-lg divide-y divide-slate-100 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-amber-500" />
            <span className="font-bold uppercase text-slate-900">
              Pacientes Suscritos al Club BeHappy & Sincronización Dentalink
            </span>
          </div>
          <span className="text-slate-500">{clubMembers.length} Miembros Activos</span>
        </div>

        {clubMembers.length === 0 ? (
          <div className="p-10 text-center text-xs font-mono text-slate-500">
            No hay pacientes con suscripción activa al Club BeHappy en este momento.
          </div>
        ) : (
          clubMembers.map((member) => (
            <div
              key={member.id}
              className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900 text-sm">{member.fullName}</span>
                  <span className="text-xs font-mono text-slate-500">· {member.rut || "Sin RUT"}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Convenio {member.convenioLevel} Descuento
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-mono">
                  {member.email} · {member.phone || "Sin fono"} · Previsión: {member.prevision || "Fonasa"}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleSyncConvenio(member)}
                  disabled={syncingRut === member.rut}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-black text-white text-[11px] font-mono uppercase rounded transition flex items-center gap-1.5 cursor-pointer font-bold"
                  title="Asociar el convenio Club BeHappy a la ficha del paciente en Dentalink"
                >
                  <RefreshCw className={`w-3 h-3 ${syncingRut === member.rut ? "animate-spin" : ""}`} />
                  <span>Sincronizar a Dentalink</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Online Web Booking Deposits ($10.000 CLP Flow) */}
      <div className="bg-white border border-slate-200 rounded-lg divide-y divide-slate-100 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-blue-600" />
            <span className="font-bold uppercase text-slate-900">
              Abonos de Reserva Online (Flow.cl $10.000 CLP)
            </span>
          </div>
          <span className="text-slate-500">{appointments.length} Citas Registradas</span>
        </div>

        {appointments.slice(0, 10).map((apt) => (
          <div
            key={apt.id}
            className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900 text-sm">{apt.patientName}</span>
                <span className="text-xs font-mono text-slate-500">· {apt.treatmentName}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                    apt.paymentStatus === "pagado" || apt.paymentStatus === "abono_flow"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {apt.paymentStatus === "abono_flow" ? "Abono $10.000 Pagado" : apt.paymentStatus || "Pendiente en Box"}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                {apt.date} {apt.time} · Doctor: {apt.doctorName}
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs font-mono font-bold text-slate-900 block">
                {apt.paymentStatus === "abono_flow" ? "$10.000 CLP" : "$0 CLP Online"}
              </span>
              <span className="text-[10px] font-mono text-slate-500 block">
                Saldo restante a cancelar en recepción Dentalink
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
