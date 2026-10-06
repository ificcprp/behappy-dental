"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { DEMO_USERS } from "@/data/portalMockData";
import { UserRole } from "@/types/auth";
import { ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("paciente");

  const handleDemoLogin = (role: UserRole) => {
    const demoUser = DEMO_USERS[role];
    if (demoUser) {
      if (typeof window !== "undefined") {
        localStorage.setItem("behappy_active_user", JSON.stringify(demoUser));
      }
      router.push(`/portal?role=${role}`);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const demoUser = DEMO_USERS[selectedRole];
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "behappy_active_user",
        JSON.stringify({
          ...demoUser,
          email: email || demoUser.email,
        })
      );
    }
    router.push(`/portal?role=${selectedRole}`);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#141413] flex flex-col justify-center py-16 px-4 sm:px-6 lg:px-8">
      
      {/* Brand & Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4">
        <Link href="/" className="inline-block group">
          <div className="relative w-14 h-14 mx-auto rounded-full overflow-hidden bg-white p-0.5 border border-[#ded9cd] shadow-sm group-hover:scale-105 transition-transform">
            <Image
              src="/images/brand/logo.png"
              alt="Centro Dental BeHappy"
              fill
              className="object-cover rounded-full"
            />
          </div>
        </Link>
        <div className="space-y-1">
          <span className="text-[10px] font-mono tracking-[0.24em] text-[#78736a] uppercase block">
            ACCESO SEGURO · PROTOCOLO CLÍNICO
          </span>
          <h1 className="text-2xl sm:text-3xl font-normal tracking-tight text-[#141413]">
            Portal Centro Dental BeHappy
          </h1>
          <p className="text-xs text-[#66635d] font-light">
            Entorno unificado para Pacientes, Doctores, Recepción y Dirección
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md space-y-6">
        
        {/* Quick Demo Role Switcher (Editorial Triptych Style) */}
        <div className="border border-[#e5e0d5] bg-white p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-[#f0ede6] pb-2">
            <span className="text-[10px] font-mono tracking-[0.18em] uppercase text-[#141413] font-bold">
              Acceso Directo por Rol (Modo Demo)
            </span>
            <span className="text-[10px] font-mono text-[#78736a]">1 clic</span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 text-xs font-mono">
            <button
              onClick={() => handleDemoLogin("paciente")}
              className="p-3 border border-[#e5e0d5] bg-[#faf8f5] hover:border-[#141413] text-left transition space-y-1 group"
            >
              <div className="text-[10px] text-[#78736a]">01 · EXTERNO</div>
              <div className="text-xs font-bold text-[#141413] group-hover:underline">Paciente</div>
              <div className="text-[10px] text-[#78736a]">Citas & Odontograma</div>
            </button>

            <button
              onClick={() => handleDemoLogin("doctor")}
              className="p-3 border border-[#e5e0d5] bg-[#faf8f5] hover:border-[#141413] text-left transition space-y-1 group"
            >
              <div className="text-[10px] text-[#78736a]">02 · INTERNO</div>
              <div className="text-xs font-bold text-[#141413] group-hover:underline">Doctor(a)</div>
              <div className="text-[10px] text-[#78736a]">Agenda & Fichas SOAP</div>
            </button>

            <button
              onClick={() => handleDemoLogin("recepcion")}
              className="p-3 border border-[#e5e0d5] bg-[#faf8f5] hover:border-[#141413] text-left transition space-y-1 group"
            >
              <div className="text-[10px] text-[#78736a]">03 · INTERNO</div>
              <div className="text-xs font-bold text-[#141413] group-hover:underline">Recepción</div>
              <div className="text-[10px] text-[#78736a]">Sala Espera & Caja</div>
            </button>

            <button
              onClick={() => handleDemoLogin("admin")}
              className="p-3 border border-[#e5e0d5] bg-[#faf8f5] hover:border-[#141413] text-left transition space-y-1 group"
            >
              <div className="text-[10px] text-[#78736a]">04 · DIRECTIVO</div>
              <div className="text-xs font-bold text-[#141413] group-hover:underline">Admin / CEO</div>
              <div className="text-[10px] text-[#78736a]">KPIs & Gestión Roles</div>
            </button>
          </div>
        </div>

        {/* Regular Login Form */}
        <div className="border border-[#e5e0d5] bg-white p-6 space-y-5">
          <form onSubmit={handleManualSubmit} className="space-y-4">
            
            <div>
              <label className="block text-[11px] font-mono tracking-wider uppercase text-[#141413] mb-1.5">
                Rol de Ingreso
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="w-full px-3.5 py-2.5 rounded-[2px] bg-[#faf8f5] border border-[#e5e0d5] text-[#141413] text-xs font-mono focus:border-[#141413] focus:outline-none"
              >
                <option value="paciente">01 · Paciente (Cliente BeHappy)</option>
                <option value="doctor">02 · Especialista / Odontólogo</option>
                <option value="recepcion">03 · Recepción & Asistente</option>
                <option value="admin">04 · Dirección Médica & Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono tracking-wider uppercase text-[#141413] mb-1.5">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@behappydental.cl"
                className="w-full px-3.5 py-2.5 rounded-[2px] bg-white border border-[#e5e0d5] text-[#141413] text-xs placeholder-[#999] focus:border-[#141413] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono tracking-wider uppercase text-[#141413] mb-1.5">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-[2px] bg-white border border-[#e5e0d5] text-[#141413] text-xs placeholder-[#999] focus:border-[#141413] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-[2px] bg-[#141413] text-[#faf8f5] hover:bg-black font-mono tracking-widest uppercase font-bold text-xs transition flex items-center justify-center gap-2 mt-2"
            >
              <span>Ingresar al Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

          </form>

          <div className="pt-4 border-t border-[#f0ede6] text-center text-xs text-[#66635d]">
            ¿Es paciente nuevo?{" "}
            <Link href="/registro" className="text-[#141413] font-bold hover:underline font-mono">
              Regístrese aquí
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
