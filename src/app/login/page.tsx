"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { authenticateUser, DEFAULT_ACCOUNTS, setCurrentSession } from "@/lib/authService";
import { UserRole } from "@/types/auth";
import { formatRut } from "@/lib/rutValidator";
import { AuthNavbarHeader } from "@/components/auth/AuthNavbarHeader";
import { AuthSplitBrandHero } from "@/components/auth/AuthSplitBrandHero";
import {
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  Users,
  AlertCircle,
  Lock,
  UserCheck,
  CalendarCheck,
  Sparkles,
  Check,
  Building2
} from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Determine if demo mode is requested via URL (?demo=true)
  const isDemoParam = searchParams.get("demo") === "true";
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  // Active production tab: "paciente" or "staff"
  const [activeProdTab, setActiveProdTab] = useState<"paciente" | "staff">("paciente");

  // Form states
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isDemoParam) {
      setIsDemoMode(true);
    }
  }, [isDemoParam]);

  // Quick 1-click test login for presentation / demo
  const handleQuickLogin = (role: UserRole) => {
    const account = DEFAULT_ACCOUNTS.find((a) => a.role === role);
    if (account) {
      setCurrentSession(account);
      router.push(`/portal?role=${role}`);
    }
  };

  // Pre-fill demo credentials in manual form
  const handleFillDemoCredentials = (role: UserRole) => {
    const account = DEFAULT_ACCOUNTS.find((a) => a.role === role);
    if (account) {
      setIdentifier(account.email);
      setPassword(account.password || role);
      setError(null);
    }
  };

  // Form input handler with smart RUT auto-formatting
  const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // If user enters numbers and doesn't have @, format as RUT
    if (!val.includes("@") && /^[0-9kK.\- ]+$/.test(val) && val.length > 2) {
      setIdentifier(formatRut(val));
    } else {
      setIdentifier(val);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const user = authenticateUser(identifier, password);
    if (!user) {
      setLoading(false);
      setError(
        isDemoMode
          ? "Credenciales no reconocidas. Puedes usar los accesos directos de 1 clic arriba."
          : "RUT, correo o contraseña incorrectos. Si aún no tienes cuenta, puedes registrarte como nuevo paciente."
      );
      return;
    }

    // Role check for Staff tab in production
    if (!isDemoMode && activeProdTab === "staff" && user.role === "paciente") {
      setLoading(false);
      setError("Esta cuenta corresponde a un Paciente. Por favor ingrese en la pestaña 'Portal Pacientes'.");
      return;
    }

    setTimeout(() => {
      setLoading(false);
      router.push(`/portal?role=${user.role}`);
    }, 350);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#141413] flex flex-col">
      {/* Dedicated Authentication Top Navbar */}
      <AuthNavbarHeader
        onBackUrl="/"
        isDemoMode={isDemoMode}
        onToggleDemoMode={() => setIsDemoMode((prev) => !prev)}
      />

      <div className="flex-1 lg:grid lg:grid-cols-12 min-h-[calc(100vh-65px)]">
        {/* Left Side: Desktop Editorial Split Brand Showcase */}
        <AuthSplitBrandHero />

        {/* Right Side: Authentication Panel */}
        <div className="lg:col-span-7 flex flex-col justify-center py-10 px-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="w-full max-w-lg mx-auto space-y-6">

            {/* Brand Logo & Context Title */}
            <div className="text-center sm:text-left space-y-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#f0ede6] border border-[#e5e0d5] text-[10px] font-mono tracking-wider uppercase text-[#78736a]">
                <Building2 className="w-3 h-3 text-[#0284c7]" />
                <span>Control de Acceso Seguro · Sede Ñuñoa</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-[#141413]">
                Portal BeHappy <span className="font-serif italic font-normal text-neutral-800">Dental OS</span>
              </h1>
              <p className="text-xs text-[#66635d] font-light leading-relaxed">
                Gestión clínica integral, ficha médica digital, odontograma interactivo y seguimiento de tratamientos.
              </p>
            </div>

            {/* Mode Switcher Banner: Producción vs Sandbox Demo */}
            <div className="p-1 rounded bg-[#ece7dd] border border-[#ded8cb] grid grid-cols-2 gap-1 text-xs font-mono">
              <button
                type="button"
                onClick={() => setIsDemoMode(false)}
                className={`py-2 px-3 rounded transition-all flex items-center justify-center gap-1.5 ${
                  !isDemoMode
                    ? "bg-white text-[#141413] font-semibold shadow-xs"
                    : "text-[#78736a] hover:text-[#141413]"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#0284c7]" />
                <span>Acceso Oficial (Producción)</span>
              </button>

              <button
                type="button"
                onClick={() => setIsDemoMode(true)}
                className={`py-2 px-3 rounded transition-all flex items-center justify-center gap-1.5 ${
                  isDemoMode
                    ? "bg-[#141413] text-white font-semibold shadow-xs"
                    : "text-[#78736a] hover:text-[#141413]"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Modo Demo (1 Clic)</span>
              </button>
            </div>

            {/* ============================================================== */}
            {/* MODO DEMO / PRESENTACIÓN: ACCESOS DIRECTOS 1-CLIC              */}
            {/* ============================================================== */}
            {isDemoMode && (
              <div className="border border-amber-200 bg-amber-50/50 p-5 rounded-lg space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center justify-between border-b border-amber-200/80 pb-2">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-700" />
                    <span className="text-[11px] font-mono tracking-wider uppercase text-amber-950 font-bold">
                      Accesos Rápidos por Rol (Demostración)
                    </span>
                  </div>
                  <span className="text-[9px] font-mono bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded font-bold">
                    Sandbox Activo
                  </span>
                </div>

                <p className="text-[11px] text-amber-900/80 leading-relaxed font-light">
                  Haz clic directo sobre cualquiera de los 4 perfiles preconfigurados para ingresar al instante y evaluar las funciones del sistema:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs font-mono">
                  {/* Rol 01: Admin / CEO */}
                  <button
                    onClick={() => handleQuickLogin("admin")}
                    className="p-3 border border-sky-200 bg-sky-50/70 hover:bg-sky-100 hover:border-sky-400 text-left transition rounded group shadow-2xs"
                  >
                    <div className="text-[10px] text-sky-700 font-bold flex items-center justify-between">
                      <span>01 · DIRECCIÓN / CEO</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform text-sky-600" />
                    </div>
                    <div className="text-xs font-bold text-slate-900 group-hover:underline">Rol Admin (CMS)</div>
                    <div className="text-[10px] text-slate-600">Editor Web, Precios & Métricas</div>
                  </button>

                  {/* Rol 02: Doctor */}
                  <button
                    onClick={() => handleQuickLogin("doctor")}
                    className="p-3 border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 hover:border-emerald-400 text-left transition rounded group shadow-2xs"
                  >
                    <div className="text-[10px] text-emerald-700 font-bold flex items-center justify-between">
                      <span>02 · CLÍNICA</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform text-emerald-600" />
                    </div>
                    <div className="text-xs font-bold text-slate-900 group-hover:underline">Rol Doctor(a)</div>
                    <div className="text-[10px] text-slate-600">Agenda, Fichas SOAP & Odontograma</div>
                  </button>

                  {/* Rol 03: Recepción */}
                  <button
                    onClick={() => handleQuickLogin("recepcion")}
                    className="p-3 border border-[#ded8cb] bg-white hover:border-[#141413] text-left transition rounded group shadow-2xs"
                  >
                    <div className="text-[10px] text-[#78736a] flex items-center justify-between">
                      <span>03 · FRONT-DESK</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform text-[#141413]" />
                    </div>
                    <div className="text-xs font-bold text-[#141413] group-hover:underline">Rol Recepción</div>
                    <div className="text-[10px] text-[#78736a]">Admisión & Walk-ins</div>
                  </button>

                  {/* Rol 04: Paciente */}
                  <button
                    onClick={() => handleQuickLogin("paciente")}
                    className="p-3 border border-[#ded8cb] bg-white hover:border-[#141413] text-left transition rounded group shadow-2xs"
                  >
                    <div className="text-[10px] text-[#78736a] flex items-center justify-between">
                      <span>04 · EXTERNO</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform text-[#141413]" />
                    </div>
                    <div className="text-xs font-bold text-[#141413] group-hover:underline">Rol Paciente</div>
                    <div className="text-[10px] text-[#78736a]">Mis Citas, Presupuestos & Convenio</div>
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* FORMULARIO DE ACCESO (PRODUCCIÓN CON TABS O MANUAL DEMO)       */}
            {/* ============================================================== */}
            <div className="border border-[#e5e0d5] bg-white p-6 sm:p-7 rounded-lg shadow-sm space-y-5">
              
              {/* Production Tabs: Paciente vs Staff Clínico */}
              {!isDemoMode && (
                <div className="flex items-center border-b border-[#f0ede6] pb-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveProdTab("paciente");
                      setError(null);
                    }}
                    className={`flex-1 pb-2 text-xs font-mono uppercase tracking-wider text-center border-b-2 transition flex items-center justify-center gap-1.5 ${
                      activeProdTab === "paciente"
                        ? "border-[#141413] text-[#141413] font-bold"
                        : "border-transparent text-[#78736a] hover:text-[#141413]"
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Portal Pacientes</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveProdTab("staff");
                      setError(null);
                    }}
                    className={`flex-1 pb-2 text-xs font-mono uppercase tracking-wider text-center border-b-2 transition flex items-center justify-center gap-1.5 ${
                      activeProdTab === "staff"
                        ? "border-[#0284c7] text-[#0284c7] font-bold"
                        : "border-transparent text-[#78736a] hover:text-[#141413]"
                    }`}
                  >
                    <Stethoscope className="w-3.5 h-3.5" />
                    <span>Equipo Clínico (Staff)</span>
                  </button>
                </div>
              )}

              {/* Header subtitle depending on state */}
              <div className="flex items-center justify-between text-[11px] font-mono text-[#78736a]">
                <span>
                  {isDemoMode
                    ? "O inicia sesión escribiendo credenciales:"
                    : activeProdTab === "paciente"
                    ? "Acceso con Cédula de Identidad (RUT) o Email"
                    : "Acceso exclusivo para Odontólogos y Dirección"}
                </span>
              </div>

              {error && (
                <div className="p-3 rounded bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleManualSubmit} className="space-y-4">
                {/* Campo Identificador (RUT o Email) */}
                <div>
                  <label className="block text-[11px] font-mono tracking-wider uppercase text-[#141413] mb-1 font-medium">
                    {activeProdTab === "paciente" && !isDemoMode
                      ? "RUT o Correo Electrónico"
                      : "Correo Institucional"}
                  </label>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={handleIdentifierChange}
                    placeholder={
                      activeProdTab === "paciente" && !isDemoMode
                        ? "ej: 18.452.931-K o mi@correo.cl"
                        : "ej: dr.lugo@behappydental.cl"
                    }
                    className="w-full px-3.5 py-2.5 bg-white border border-[#cfc9be] text-[#141413] text-xs focus:outline-none focus:border-[#0284c7] focus:ring-1 focus:ring-[#0284c7] transition font-mono rounded"
                  />
                  {activeProdTab === "paciente" && !isDemoMode && (
                    <span className="text-[10px] text-[#78736a] block mt-1">
                      Puedes ingresar tu RUT chileno con o sin puntos y guion.
                    </span>
                  )}
                </div>

                {/* Campo Contraseña */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-mono tracking-wider uppercase text-[#141413] font-medium">
                      Contraseña
                    </label>
                    <a
                      href={`https://api.whatsapp.com/send/?phone=56947578597&text=${encodeURIComponent(
                        "Hola Centro Dental BeHappy, necesito recuperar el acceso a mi portal de paciente."
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-mono text-[#0284c7] hover:underline"
                    >
                      ¿Olvidaste tu clave?
                    </a>
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#cfc9be] text-[#141413] text-xs focus:outline-none focus:border-[#0284c7] focus:ring-1 focus:ring-[#0284c7] transition rounded"
                  />

                  {/* Demo helper hint shown ONLY in demo mode */}
                  {isDemoMode && (
                    <div className="mt-1.5 p-2 rounded bg-neutral-100 text-[10px] text-[#78736a] font-mono flex items-center justify-between">
                      <span>
                        Claves demo: <code>admin</code>, <code>doctor</code> o <code>BeHappy2026!</code>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleFillDemoCredentials("admin")}
                        className="text-[#0284c7] hover:underline font-bold"
                      >
                        Autocompletar
                      </button>
                    </div>
                  )}
                </div>

                {/* Botón de Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 text-xs font-mono uppercase tracking-widest transition flex items-center justify-center gap-2 font-medium rounded shadow-xs ${
                    activeProdTab === "staff" && !isDemoMode
                      ? "bg-[#0284c7] text-white hover:bg-[#0369a1]"
                      : "bg-[#141413] text-[#faf8f5] hover:bg-black"
                  }`}
                >
                  {loading ? (
                    <span>Validando acceso...</span>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>
                        {activeProdTab === "staff" && !isDemoMode
                          ? "Acceso Clínico Seguro"
                          : "Ingresar al Portal"}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>

              {/* Registration and Booking Links */}
              <div className="pt-4 border-t border-[#f0ede6] space-y-2 text-center">
                <p className="text-xs text-[#66635d]">
                  ¿Aún no tienes ficha clínica registrada?{" "}
                  <a href="/registro" className="text-[#141413] font-bold underline underline-offset-4 hover:text-[#0284c7]">
                    Crear cuenta aquí →
                  </a>
                </p>

                <p className="text-[11px] font-mono text-[#78736a]">
                  ¿Prefieres reservar una hora directamente?{" "}
                  <a href="/#agendar" className="text-[#0284c7] hover:underline font-medium">
                    Agendar cita online sin cuenta
                  </a>
                </p>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#faf8f5] flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#141413] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-mono uppercase tracking-widest text-[#78736a]">
            Cargando Portal BeHappy...
          </p>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
