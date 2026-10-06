"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { authenticateUser, DEFAULT_ACCOUNTS, setCurrentSession } from "@/lib/authService";
import { UserRole } from "@/types/auth";
import { ArrowRight, ShieldCheck, UserCheck, Stethoscope, Users, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Quick 1-click test login
  const handleQuickLogin = (role: UserRole) => {
    const account = DEFAULT_ACCOUNTS.find((a) => a.role === role);
    if (account) {
      setCurrentSession(account);
      router.push(`/portal?role=${role}`);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const user = authenticateUser(email, password);
    if (!user) {
      setLoading(false);
      setError("Credenciales no reconocidas. Puedes usar cualquiera de los accesos directos o crear una cuenta.");
      return;
    }

    setTimeout(() => {
      setLoading(false);
      router.push(`/portal?role=${user.role}`);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#141413] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Brand & Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
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
            CONTROL DE ACCESO SEGURO · SEDE ÑUÑOA
          </span>
          <h1 className="text-2xl sm:text-3xl font-normal tracking-tight text-[#141413]">
            Portal BeHappy Dental OS
          </h1>
          <p className="text-xs text-[#66635d] font-light">
            Inicia sesión para acceder a tu panel de Administración (CMS), Doctor, Recepción o Paciente.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md space-y-6">
        
        {/* Quick Access by Role Buttons (Instant testing from day one) */}
        <div className="border border-[#e5e0d5] bg-white p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#f0ede6] pb-2">
            <span className="text-[10px] font-mono tracking-[0.18em] uppercase text-[#141413] font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
              <span>Accesos Directos por Rol (1 Clic)</span>
            </span>
            <span className="text-[9px] font-mono bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
              Listo para usar
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 text-xs font-mono">
            <button
              onClick={() => handleQuickLogin("admin")}
              className="p-3 border border-purple-200 bg-purple-50/50 hover:bg-purple-100/60 hover:border-purple-400 text-left transition space-y-1 group rounded"
            >
              <div className="text-[10px] text-purple-700 font-bold">01 · DIRECCIÓN / CEO</div>
              <div className="text-xs font-bold text-black group-hover:underline">Rol Admin (CMS)</div>
              <div className="text-[10px] text-neutral-600">Editor Web & Métricas</div>
            </button>

            <button
              onClick={() => handleQuickLogin("doctor")}
              className="p-3 border border-[#e5e0d5] bg-[#faf8f5] hover:border-[#141413] text-left transition space-y-1 group rounded"
            >
              <div className="text-[10px] text-[#78736a]">02 · CLÍNICA</div>
              <div className="text-xs font-bold text-[#141413] group-hover:underline">Rol Doctor(a)</div>
              <div className="text-[10px] text-[#78736a]">Agenda & Fichas SOAP</div>
            </button>

            <button
              onClick={() => handleQuickLogin("recepcion")}
              className="p-3 border border-[#e5e0d5] bg-[#faf8f5] hover:border-[#141413] text-left transition space-y-1 group rounded"
            >
              <div className="text-[10px] text-[#78736a]">03 · FRONT-DESK</div>
              <div className="text-xs font-bold text-[#141413] group-hover:underline">Rol Recepción</div>
              <div className="text-[10px] text-[#78736a]">Admisión & Walk-ins</div>
            </button>

            <button
              onClick={() => handleQuickLogin("paciente")}
              className="p-3 border border-[#e5e0d5] bg-[#faf8f5] hover:border-[#141413] text-left transition space-y-1 group rounded"
            >
              <div className="text-[10px] text-[#78736a]">04 · EXTERNO</div>
              <div className="text-xs font-bold text-[#141413] group-hover:underline">Rol Paciente</div>
              <div className="text-[10px] text-[#78736a]">Mis Citas & Convenio</div>
            </button>
          </div>
        </div>

        {/* Manual Credentials Form */}
        <div className="border border-[#e5e0d5] bg-white p-7 space-y-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#f0ede6] pb-2">
            <span className="text-[10px] font-mono tracking-widest text-[#78736a] uppercase">
              Iniciar Sesión con Correo
            </span>
            <span className="text-[10px] font-mono text-neutral-400">admin@behappydental.cl</span>
          </div>

          {error && (
            <div className="p-3 rounded bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono tracking-wider uppercase text-[#141413] mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ej: admin@behappydental.cl"
                className="w-full px-3.5 py-2.5 bg-white border border-[#cfc9be] text-[#141413] text-xs focus:outline-none focus:border-[#141413] transition font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono tracking-wider uppercase text-[#141413] mb-1">
                Contraseña
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-white border border-[#cfc9be] text-[#141413] text-xs focus:outline-none focus:border-[#141413] transition"
              />
              <span className="text-[10px] text-[#78736a] block mt-1">
                Contraseña demo: <code className="bg-neutral-100 px-1 py-0.5 rounded">admin</code> o <code className="bg-neutral-100 px-1 py-0.5 rounded">BeHappy2026!</code>
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#141413] text-[#faf8f5] text-xs font-mono uppercase tracking-widest hover:bg-black transition flex items-center justify-center gap-2 font-medium"
            >
              <span>{loading ? "Validando..." : "Ingresar al Portal"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Registration Link */}
          <div className="pt-4 border-t border-[#f0ede6] text-center">
            <p className="text-xs text-[#66635d]">
              ¿Eres un nuevo paciente o deseas registrar una cuenta?{" "}
              <Link href="/registro" className="text-[#141413] font-bold underline underline-offset-4">
                Crear cuenta aquí →
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
