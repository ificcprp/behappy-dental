"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { authenticateUser, registerNewUser, requestServerSession } from "@/lib/authService";
import { formatRut } from "@/lib/rutValidator";
import { AuthNavbarHeader } from "@/components/auth/AuthNavbarHeader";
import { getCMSData, CMSData, DEFAULT_AUTH_PORTAL } from "@/lib/cmsStore";
import { ArrowRight, AlertCircle, CheckCircle2, ShieldCheck, Sparkles, User, LogIn } from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // CMS dynamic configuration
  const [cms, setCms] = useState<CMSData>(getCMSData());

  useEffect(() => {
    setCms(getCMSData());
    const handleCmsUpdate = (e: any) => {
      if (e.detail) setCms(e.detail);
    };
    window.addEventListener("behappy_cms_updated", handleCmsUpdate);
    return () => window.removeEventListener("behappy_cms_updated", handleCmsUpdate);
  }, []);

  const authConfig = cms.authPortal || DEFAULT_AUTH_PORTAL;

  // Active Tab State (login vs register)
  const initialTab = searchParams.get("tab") === "register" ? "register" : "login";
  const [activeTab, setActiveTab] = useState<"login" | "register">(initialTab);

  // Login Form States
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Register Form States
  const [regData, setRegData] = useState({
    fullName: "",
    rut: "",
    phone: "",
    email: "",
    prevision: "Fonasa",
    password: "",
  });
  const [regError, setRegError] = useState<string | null>(null);
  const [regLoading, setRegLoading] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);

  // RUT auto-formatter for login
  const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!val.includes("@") && /^[0-9kK.\- ]+$/.test(val) && val.length > 2) {
      setIdentifier(formatRut(val));
    } else {
      setIdentifier(val);
    }
  };

  // RUT auto-formatter for register
  const handleRegisterRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setRegData((prev) => ({ ...prev, rut: formatRut(val) }));
  };

  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    const user = authenticateUser(identifier, password);
    if (!user) {
      setLoginLoading(false);
      setLoginError("RUT, correo o contraseña no reconocidos. Verifique sus datos o cree una ficha de paciente nueva.");
      return;
    }

    // Ensure the signed server session cookie exists before entering the portal
    await requestServerSession(user.email, { password });

    setLoginLoading(false);
    router.push(`/portal?role=${user.role}`);
  };

  // Handle Register Submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    setRegLoading(true);

    try {
      if (!regData.fullName.trim() || !regData.rut.trim() || !regData.email.trim()) {
        setRegError("Por favor complete todos los campos obligatorios (*).");
        setRegLoading(false);
        return;
      }

      const user = registerNewUser({
        fullName: regData.fullName.trim(),
        email: regData.email.trim(),
        rut: regData.rut.trim(),
        phone: regData.phone.trim(),
        prevision: regData.prevision,
        password: regData.password || "BeHappy2026!",
        role: "paciente",
        setAsActiveSession: true,
      });

      // Self-registered patients live in localStorage: issue a portal-only server session
      await requestServerSession(user.email, { demo: true });

      setRegLoading(false);
      setRegSuccess(true);
      setTimeout(() => {
        router.push(`/portal?role=${user.role}`);
      }, 500);
    } catch (err: any) {
      setRegLoading(false);
      setRegError(err?.message || "Ocurrió un error al registrar la ficha. Intente nuevamente.");
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#141413] flex flex-col selection:bg-[#141413] selection:text-white">
      <AuthNavbarHeader onBackUrl="/" />

      <main className="flex-1 flex flex-col justify-center items-center px-4 py-8 sm:py-14">
        <div className="w-full max-w-[460px] space-y-5">

          {/* Brand & Clean Clinical Header */}
          <div className="text-center space-y-2.5">
            <div className="relative w-14 h-14 mx-auto rounded-full overflow-hidden bg-white p-0.5 border border-[#ded9cd] shadow-2xs">
              <Image
                src="/images/brand/logo.png"
                alt="Centro Dental BeHappy"
                fill
                className="object-cover rounded-full"
                priority
              />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono tracking-[0.22em] text-[#78736a] uppercase block font-medium">
                {authConfig.badge || "SEDE ÑUÑOA · SUECIA 3580"}
              </span>
              <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-[#141413]">
                {authConfig.title || "Portal Clínico & Pacientes"}{" "}
                <span className="font-serif italic font-normal text-neutral-800">
                  {authConfig.titleHighlight || "BeHappy"}
                </span>
              </h1>
              <p className="text-xs text-[#66635d] font-light max-w-sm mx-auto leading-relaxed">
                {authConfig.subtitle || "Acceso seguro a ficha clínica digital, citas, presupuestos y convenios."}
              </p>
            </div>
          </div>

          {/* Centralized Card with Instant Segmented Switcher */}
          <div className="bg-white border border-[#e5e0d5] p-6 sm:p-8 space-y-5 shadow-2xs rounded-xs">
            
            {/* Segmented Switcher */}
            <div className="grid grid-cols-2 p-1 bg-[#f4f1ea] border border-[#e2ddd3] gap-1">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("login");
                  setLoginError(null);
                }}
                className={`py-2 px-3 text-xs font-mono uppercase tracking-wider transition flex items-center justify-center gap-1.5 ${
                  activeTab === "login"
                    ? "bg-white text-[#141413] font-bold shadow-xs border border-[#ded8cb]"
                    : "text-[#78736a] hover:text-[#141413]"
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{authConfig.loginTabLabel || "Iniciar Sesión"}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("register");
                  setRegError(null);
                }}
                className={`py-2 px-3 text-xs font-mono uppercase tracking-wider transition flex items-center justify-center gap-1.5 ${
                  activeTab === "register"
                    ? "bg-white text-[#141413] font-bold shadow-xs border border-[#ded8cb]"
                    : "text-[#78736a] hover:text-[#141413]"
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>{authConfig.registerTabLabel || "Crear Ficha Paciente"}</span>
              </button>
            </div>

            {/* TAB 1: INICIAR SESIÓN */}
            {activeTab === "login" && (
              <div className="space-y-4">
                {loginError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <span>{loginError}</span>
                  </div>
                )}

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-mono tracking-wider uppercase text-[#141413] mb-1.5 font-medium">
                      RUT o Correo Electrónico
                    </label>
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={handleIdentifierChange}
                      placeholder="ej: 12.345.678-9 o usuario@correo.cl"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#cfc9be] text-[#141413] text-xs focus:outline-none focus:border-[#141413] transition font-mono"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[11px] font-mono tracking-wider uppercase text-[#141413] font-medium">
                        Contraseña
                      </label>
                      <a
                        href={`https://api.whatsapp.com/send/?phone=56947578597&text=${encodeURIComponent(
                          "Hola Centro Dental BeHappy, necesito recuperar el acceso a mi portal de paciente."
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-mono text-[#78736a] hover:text-[#141413] transition"
                      >
                        {authConfig.forgotPasswordText || "¿Olvidaste tu clave?"}
                      </a>
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#cfc9be] text-[#141413] text-xs focus:outline-none focus:border-[#141413] transition"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="w-full py-3 bg-[#141413] hover:bg-black text-[#faf8f5] text-xs font-mono uppercase tracking-widest transition flex items-center justify-center gap-2 font-medium shadow-xs disabled:opacity-50"
                  >
                    <span>{loginLoading ? "Validando..." : (authConfig.loginButtonText || "Ingresar al Portal")}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>

                <div className="pt-3 border-t border-[#f0ede6] text-center text-xs">
                  <p className="text-[#66635d]">
                    ¿Aún no tienes ficha clínica activa?{" "}
                    <button
                      type="button"
                      onClick={() => setActiveTab("register")}
                      className="text-[#141413] font-bold underline underline-offset-4 hover:text-black cursor-pointer"
                    >
                      Crear ficha aquí →
                    </button>
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: REGISTRO / CREAR FICHA */}
            {activeTab === "register" && (
              <div className="space-y-4">
                {regSuccess ? (
                  <div className="text-center py-8 space-y-3">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto animate-bounce" />
                    <h2 className="text-base font-normal text-[#141413]">Ficha creada con éxito</h2>
                    <p className="text-xs font-mono text-[#78736a]">
                      Ingresando a su portal clínico de paciente...
                    </p>
                  </div>
                ) : (
                  <>
                    {regError && (
                      <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <span>{regError}</span>
                      </div>
                    )}

                    <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                      <div>
                        <label className="block text-[11px] font-mono tracking-wider uppercase text-[#141413] mb-1 font-medium">
                          Nombre Completo *
                        </label>
                        <input
                          type="text"
                          required
                          value={regData.fullName}
                          onChange={(e) => setRegData({ ...regData, fullName: e.target.value })}
                          placeholder="Ej: Camila González Pérez"
                          className="w-full px-3.5 py-2.5 bg-white border border-[#cfc9be] text-[#141413] text-xs focus:outline-none focus:border-[#141413] transition"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-mono tracking-wider uppercase text-[#141413] mb-1 font-medium">
                            RUT *
                          </label>
                          <input
                            type="text"
                            required
                            value={regData.rut}
                            onChange={handleRegisterRutChange}
                            placeholder="18.492.381-4"
                            className="w-full px-3.5 py-2.5 bg-white border border-[#cfc9be] text-[#141413] text-xs font-mono focus:outline-none focus:border-[#141413] transition"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono tracking-wider uppercase text-[#141413] mb-1 font-medium">
                            Teléfono Móvil *
                          </label>
                          <input
                            type="tel"
                            required
                            value={regData.phone}
                            onChange={(e) => setRegData({ ...regData, phone: e.target.value })}
                            placeholder="+56 9 1234 5678"
                            className="w-full px-3.5 py-2.5 bg-white border border-[#cfc9be] text-[#141413] text-xs font-mono focus:outline-none focus:border-[#141413] transition"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono tracking-wider uppercase text-[#141413] mb-1 font-medium">
                          Correo Electrónico *
                        </label>
                        <input
                          type="email"
                          required
                          value={regData.email}
                          onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                          placeholder="paciente@ejemplo.com"
                          className="w-full px-3.5 py-2.5 bg-white border border-[#cfc9be] text-[#141413] text-xs focus:outline-none focus:border-[#141413] transition"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-mono tracking-wider uppercase text-[#141413] mb-1 font-medium">
                            Previsión
                          </label>
                          <select
                            value={regData.prevision}
                            onChange={(e) => setRegData({ ...regData, prevision: e.target.value })}
                            className="w-full px-3 py-2 bg-[#faf8f5] border border-[#cfc9be] text-[#141413] text-xs font-mono focus:outline-none focus:border-[#141413] transition"
                          >
                            <option value="Fonasa">Fonasa</option>
                            <option value="Isapre Banmédica">Isapre Banmédica</option>
                            <option value="Isapre Colmena">Isapre Colmena</option>
                            <option value="Isapre Cruz Blanca">Isapre Cruz Blanca</option>
                            <option value="Isapre Consalud">Isapre Consalud</option>
                            <option value="Particular">Particular</option>
                            <option value="Convenio BeHappy">Convenio BeHappy</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono tracking-wider uppercase text-[#141413] mb-1 font-medium">
                            Contraseña *
                          </label>
                          <input
                            type="password"
                            required
                            value={regData.password}
                            onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                            placeholder="Mínimo 6 caracteres"
                            className="w-full px-3.5 py-2.5 bg-white border border-[#cfc9be] text-[#141413] text-xs focus:outline-none focus:border-[#141413] transition"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={regLoading}
                        className="w-full py-3 bg-[#141413] hover:bg-black text-[#faf8f5] text-xs font-mono uppercase tracking-widest transition flex items-center justify-center gap-2 font-medium shadow-xs disabled:opacity-50 mt-2"
                      >
                        <span>{regLoading ? "Registrando Ficha..." : (authConfig.registerButtonText || "Crear Ficha y Acceder")}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </form>

                    <div className="pt-3 border-t border-[#f0ede6] text-center text-xs">
                      <p className="text-[#66635d]">
                        ¿Ya posees una ficha o cuenta creada?{" "}
                        <button
                          type="button"
                          onClick={() => setActiveTab("login")}
                          className="text-[#141413] font-bold underline underline-offset-4 hover:text-black cursor-pointer"
                        >
                          Iniciar sesión aquí
                        </button>
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Direct Booking Link */}
            <div className="pt-2 text-center text-xs">
              <a
                href="/#agendar"
                className="text-[11px] font-mono text-[#78736a] hover:text-[#141413] transition inline-flex items-center gap-1"
              >
                <span>{authConfig.directBookingText || "¿Deseas atención directa? Reservar cita online"}</span>
                <span className="font-sans font-bold">→</span>
              </a>
            </div>
          </div>

          {/* Discreet Access to Demo Environment for Pitch/Presentation */}
          <div className="text-center space-y-2">
            <a
              href="/demo"
              className="text-[10px] font-mono tracking-widest uppercase text-[#9ca3af] hover:text-[#4b5563] transition block"
            >
              {authConfig.demoAccessText || "Acceso a Entorno de Demostración (Pitch & Roles)"} →
            </a>
            
            {/* Legal / Biosecurity Notice */}
            <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-[#a39e93] pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{authConfig.securityNotice || "Acceso protegido bajo Ley 20.584 · Cifrado Clínico TLS 1.3"}</span>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#141413] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
