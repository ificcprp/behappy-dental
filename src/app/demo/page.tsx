"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { DEFAULT_ACCOUNTS, setCurrentSession, requestServerSession } from "@/lib/authService";
import { UserRole } from "@/types/auth";
import { AuthNavbarHeader } from "@/components/auth/AuthNavbarHeader";
import {
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  Users,
  LayoutDashboard,
  Sparkles,
  CheckCircle2,
  Lock
} from "lucide-react";

export default function DemoPage() {
  const router = useRouter();

  const handleLaunchRole = async (role: UserRole) => {
    const account = DEFAULT_ACCOUNTS.find((a) => a.role === role);
    if (account) {
      setCurrentSession(account);
      // Demo sessions get a read-only portal token (no write access to real data)
      await requestServerSession(account.email, { demo: true });
      router.push(`/portal?role=${role}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#141413] flex flex-col">
      <AuthNavbarHeader onBackUrl="/" />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 sm:py-16 space-y-10">
        
        {/* Header Presentation */}
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#f0ede6] border border-[#ded8cb] text-[10px] font-mono tracking-widest uppercase text-[#78736a]">
            <Sparkles className="w-3.5 h-3.5 text-[#0284c7]" />
            <span>Suite de Demostración · Plataforma Clínica BeHappy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-[#141413]">
            Entorno de Presentación <span className="font-serif italic text-neutral-800">Interactivo</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#66635d] font-light leading-relaxed">
            Explora las capacidades completas del sistema seleccionando cualquiera de los 4 perfiles clínicos y operativos. Ingreso instantáneo en 1 clic.
          </p>
        </div>

        {/* 4 Roles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* 01 · Dirección & CEO */}
          <div className="bg-white border border-[#e5e0d5] p-6 space-y-4 hover:border-[#141413] transition rounded-xs flex flex-col justify-between shadow-2xs">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#0284c7]">
                <span className="font-bold">01 · DIRECCIÓN & CEO</span>
                <LayoutDashboard className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-normal text-[#141413]">Rol Administrador (CMS)</h2>
              <p className="text-xs text-[#66635d] font-light leading-relaxed">
                Editor integral de contenidos de la web en vivo, ajuste de precios, planes del Club BeHappy, auditoría y métricas de recaudación.
              </p>
            </div>
            <button
              onClick={() => handleLaunchRole("admin")}
              className="w-full py-2.5 px-3 bg-[#141413] hover:bg-black text-white text-xs font-mono uppercase tracking-wider rounded-xs flex items-center justify-center gap-2 transition"
            >
              <span>Explorar como Admin</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 02 · Clínica & Doctor */}
          <div className="bg-white border border-[#e5e0d5] p-6 space-y-4 hover:border-[#141413] transition rounded-xs flex flex-col justify-between shadow-2xs">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#059669]">
                <span className="font-bold">02 · EQUIPO MÉDICO</span>
                <Stethoscope className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-normal text-[#141413]">Rol Doctor(a)</h2>
              <p className="text-xs text-[#66635d] font-light leading-relaxed">
                Agenda de box, notas de evolución clínica SOAP, odontograma 3D anatómico interactivo y emisión de consentimientos informados.
              </p>
            </div>
            <button
              onClick={() => handleLaunchRole("doctor")}
              className="w-full py-2.5 px-3 bg-[#141413] hover:bg-black text-white text-xs font-mono uppercase tracking-wider rounded-xs flex items-center justify-center gap-2 transition"
            >
              <span>Explorar como Doctor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 03 · Front-Desk */}
          <div className="bg-white border border-[#e5e0d5] p-6 space-y-4 hover:border-[#141413] transition rounded-xs flex flex-col justify-between shadow-2xs">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#b45309]">
                <span className="font-bold">03 · FRONT-DESK</span>
                <Users className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-normal text-[#141413]">Rol Recepción</h2>
              <p className="text-xs text-[#66635d] font-light leading-relaxed">
                Admisión rápida de pacientes, confirmación de citas del día, registro de pagos Flow/Webpay y coordinación de walk-ins.
              </p>
            </div>
            <button
              onClick={() => handleLaunchRole("recepcion")}
              className="w-full py-2.5 px-3 bg-[#141413] hover:bg-black text-white text-xs font-mono uppercase tracking-wider rounded-xs flex items-center justify-center gap-2 transition"
            >
              <span>Explorar Recepción</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 04 · Paciente */}
          <div className="bg-white border border-[#e5e0d5] p-6 space-y-4 hover:border-[#141413] transition rounded-xs flex flex-col justify-between shadow-2xs">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#4b5563]">
                <span className="font-bold">04 · EXTERNO</span>
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-normal text-[#141413]">Rol Paciente</h2>
              <p className="text-xs text-[#66635d] font-light leading-relaxed">
                Vista de mis citas agendadas, presupuesto transparente descargable, odontograma personal, convenios activos y consentimientos firmados.
              </p>
            </div>
            <button
              onClick={() => handleLaunchRole("paciente")}
              className="w-full py-2.5 px-3 bg-[#141413] hover:bg-black text-white text-xs font-mono uppercase tracking-wider rounded-xs flex items-center justify-center gap-2 transition"
            >
              <span>Explorar como Paciente</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Back to real login */}
        <div className="pt-6 border-t border-[#ece7de] text-center space-y-2">
          <p className="text-xs text-[#78736a]">
            ¿Deseas acceder con credenciales reales de paciente o staff?
          </p>
          <a
            href="/login"
            className="text-xs font-mono uppercase tracking-wider text-[#141413] hover:underline font-bold"
          >
            Ir al Acceso Oficial (/login) →
          </a>
        </div>

      </main>
    </div>
  );
}
