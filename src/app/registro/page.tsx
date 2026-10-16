"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, ShieldCheck, UserPlus, Building2 } from "lucide-react";
import { registerNewUser } from "@/lib/authService";
import { formatRut } from "@/lib/rutValidator";
import { AuthNavbarHeader } from "@/components/auth/AuthNavbarHeader";
import { AuthSplitBrandHero } from "@/components/auth/AuthSplitBrandHero";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    rut: "",
    phone: "",
    email: "",
    prevision: "Fonasa",
    password: "",
    acceptTerms: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData({ ...formData, rut: formatRut(val) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      registerNewUser({
        fullName: formData.fullName,
        email: formData.email,
        rut: formData.rut,
        phone: formData.phone,
        prevision: formData.prevision,
        password: formData.password || "BeHappy2026!",
        role: "paciente",
      });

      setTimeout(() => {
        setIsSubmitting(false);
        setSuccess(true);
        setTimeout(() => {
          router.push("/portal?role=paciente");
        }, 800);
      }, 500);
    } catch (err) {
      setIsSubmitting(false);
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#141413] flex flex-col">
      {/* Dedicated Clean Header */}
      <AuthNavbarHeader onBackUrl="/" />

      <div className="flex-1 lg:grid lg:grid-cols-12 min-h-[calc(100vh-65px)]">
        {/* Left Side: Desktop Editorial Split Brand Showcase */}
        <AuthSplitBrandHero />

        {/* Right Side: Registration Panel */}
        <div className="lg:col-span-7 flex flex-col justify-center py-10 px-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="w-full max-w-lg mx-auto space-y-6">

            {/* Section Header */}
            <div className="text-center sm:text-left space-y-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#f0ede6] border border-[#e5e0d5] text-[10px] font-mono tracking-wider uppercase text-[#78736a]">
                <Building2 className="w-3 h-3 text-[#059669]" />
                <span>Nuevo Paciente · Registro Institucional</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-[#141413]">
                Crear Ficha de <span className="font-serif italic font-normal text-neutral-800">Paciente</span>
              </h1>
              <p className="text-xs text-[#66635d] font-light leading-relaxed">
                Ingresa tus datos para acceder a tu historial de citas, odontograma, convenios y presupuestos.
              </p>
            </div>

            {/* Registration Form Card */}
            <div className="border border-[#e5e0d5] bg-white p-6 sm:p-7 rounded-lg shadow-sm space-y-5">
              {success ? (
                <div className="text-center py-10 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-normal text-[#141413]">Ficha creada correctamente</h2>
                  <p className="text-xs font-mono text-[#78736a]">
                    Iniciando sesión y redirigiendo a tu Portal Paciente...
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-mono tracking-wider uppercase text-[#141413] mb-1 font-medium">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Ej: Camila González Pérez"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#cfc9be] text-[#141413] text-xs focus:outline-none focus:border-[#0284c7] focus:ring-1 focus:ring-[#0284c7] transition rounded"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono tracking-wider uppercase text-[#141413] mb-1 font-medium">
                        RUT (Cédula de Identidad) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.rut}
                        onChange={handleRutChange}
                        placeholder="18.492.381-4"
                        className="w-full px-3.5 py-2.5 bg-white border border-[#cfc9be] text-[#141413] text-xs font-mono focus:outline-none focus:border-[#0284c7] focus:ring-1 focus:ring-[#0284c7] transition rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono tracking-wider uppercase text-[#141413] mb-1 font-medium">
                        Teléfono Móvil (WhatsApp) *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+56 9 1234 5678"
                        className="w-full px-3.5 py-2.5 bg-white border border-[#cfc9be] text-[#141413] text-xs font-mono focus:outline-none focus:border-[#0284c7] focus:ring-1 focus:ring-[#0284c7] transition rounded"
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
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="paciente@ejemplo.com"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#cfc9be] text-[#141413] text-xs focus:outline-none focus:border-[#0284c7] focus:ring-1 focus:ring-[#0284c7] transition rounded"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono tracking-wider uppercase text-[#141413] mb-1 font-medium">
                        Previsión de Salud
                      </label>
                      <select
                        value={formData.prevision}
                        onChange={(e) => setFormData({ ...formData, prevision: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#faf8f5] border border-[#cfc9be] text-[#141413] text-xs font-mono focus:outline-none focus:border-[#0284c7] transition rounded"
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
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Mínimo 6 caracteres"
                        className="w-full px-3.5 py-2.5 bg-white border border-[#cfc9be] text-[#141413] text-xs focus:outline-none focus:border-[#0284c7] focus:ring-1 focus:ring-[#0284c7] transition rounded"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-4 bg-[#141413] text-[#faf8f5] hover:bg-black font-mono tracking-widest uppercase font-bold text-xs transition rounded shadow-xs flex items-center justify-center gap-2"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>{isSubmitting ? "Registrando Ficha..." : "Crear Ficha de Paciente"}</span>
                    </button>
                  </div>
                </form>
              )}

              <div className="pt-4 border-t border-[#f0ede6] text-center text-xs text-[#66635d]">
                ¿Ya posees una cuenta o ficha clínica?{" "}
                <a href="/login" className="text-[#141413] font-bold underline underline-offset-4 hover:text-[#0284c7]">
                  Iniciar sesión aquí
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
