"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { authenticateUser } from "@/lib/authService";
import { formatRut } from "@/lib/rutValidator";
import { AuthNavbarHeader } from "@/components/auth/AuthNavbarHeader";
import { ArrowRight, AlertCircle, Lock } from "lucide-react";

function LoginContent() {
  const router = useRouter();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Auto-formatea RUT chileno si ingresa números sin @
    if (!val.includes("@") && /^[0-9kK.\- ]+$/.test(val) && val.length > 2) {
      setIdentifier(formatRut(val));
    } else {
      setIdentifier(val);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const user = authenticateUser(identifier, password);
    if (!user) {
      setLoading(false);
      setError("RUT, correo o contraseña no reconocidos. Verifique sus datos o cree una cuenta nueva.");
      return;
    }

    setTimeout(() => {
      setLoading(false);
      router.push(`/portal?role=${user.role}`);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#141413] flex flex-col">
      <AuthNavbarHeader onBackUrl="/" />

      <main className="flex-1 flex flex-col justify-center items-center px-4 py-12 sm:py-16">
        <div className="w-full max-w-[420px] space-y-6">

          {/* Brand & Title */}
          <div className="text-center space-y-3">
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
              <span className="text-[10px] font-mono tracking-[0.22em] text-[#78736a] uppercase block">
                SEDE ÑUÑOA · SUECIA 3580
              </span>
              <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-[#141413]">
                Portal BeHappy <span className="font-serif italic font-normal text-neutral-800">Dental OS</span>
              </h1>
              <p className="text-xs text-[#66635d] font-light">
                Acceso a ficha clínica digital, citas, presupuestos y convenios.
              </p>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white border border-[#e5e0d5] p-6 sm:p-8 space-y-5 shadow-2xs">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono tracking-wider uppercase text-[#141413] mb-1.5 font-medium">
                  RUT o Correo Electrónico
                </label>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={handleIdentifierChange}
                  placeholder="ej: 18.452.931-K o paciente@behappydental.cl"
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
                    ¿Olvidaste tu clave?
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
                disabled={loading}
                className="w-full py-3 bg-[#141413] hover:bg-black text-[#faf8f5] text-xs font-mono uppercase tracking-widest transition flex items-center justify-center gap-2 font-medium shadow-xs disabled:opacity-50"
              >
                <span>{loading ? "Validando..." : "Ingresar al Portal"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="pt-4 border-t border-[#f0ede6] space-y-2 text-center text-xs">
              <p className="text-[#66635d]">
                ¿Eres un nuevo paciente?{" "}
                <a href="/registro" className="text-[#141413] font-bold underline underline-offset-4 hover:text-black">
                  Crear ficha aquí →
                </a>
              </p>
              <p className="text-[11px] font-mono text-[#78736a]">
                ¿Deseas atención directa?{" "}
                <a href="/#agendar" className="text-[#141413] hover:underline">
                  Reservar cita online
                </a>
              </p>
            </div>
          </div>

          {/* Discretest possible access to Demo for pitch/internal presentation */}
          <div className="text-center">
            <a
              href="/demo"
              className="text-[10px] font-mono tracking-widest uppercase text-[#9ca3af] hover:text-[#4b5563] transition"
            >
              Acceso a Entorno de Demostración (Pitch & Roles) →
            </a>
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
