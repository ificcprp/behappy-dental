"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { registerNewUser } from "@/lib/authService";
import { formatRut } from "@/lib/rutValidator";
import { AuthNavbarHeader } from "@/components/auth/AuthNavbarHeader";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    rut: "",
    phone: "",
    email: "",
    prevision: "Fonasa",
    password: "",
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
        }, 600);
      }, 400);
    } catch (err) {
      setIsSubmitting(false);
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#141413] flex flex-col">
      <AuthNavbarHeader onBackUrl="/" />

      <main className="flex-1 flex flex-col justify-center items-center px-4 py-12 sm:py-16">
        <div className="w-full max-w-[440px] space-y-6">

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
                NUEVO PACIENTE · REGISTRO INSTITUCIONAL
              </span>
              <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-[#141413]">
                Crear Ficha de <span className="font-serif italic font-normal text-neutral-800">Paciente</span>
              </h1>
              <p className="text-xs text-[#66635d] font-light">
                Ingresa tus datos para acceder a tu historial de citas, presupuestos y convenios.
              </p>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white border border-[#e5e0d5] p-6 sm:p-8 space-y-5 shadow-2xs">
            {success ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h2 className="text-lg font-normal text-[#141413]">Ficha creada con éxito</h2>
                <p className="text-xs font-mono text-[#78736a]">
                  Redirigiendo a tu portal de paciente...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono tracking-wider uppercase text-[#141413] mb-1.5 font-medium">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Ej: Camila González Pérez"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#cfc9be] text-[#141413] text-xs focus:outline-none focus:border-[#141413] transition"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono tracking-wider uppercase text-[#141413] mb-1.5 font-medium">
                      RUT *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.rut}
                      onChange={handleRutChange}
                      placeholder="18.492.381-4"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#cfc9be] text-[#141413] text-xs font-mono focus:outline-none focus:border-[#141413] transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono tracking-wider uppercase text-[#141413] mb-1.5 font-medium">
                      Teléfono Móvil *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+56 9 1234 5678"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#cfc9be] text-[#141413] text-xs font-mono focus:outline-none focus:border-[#141413] transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono tracking-wider uppercase text-[#141413] mb-1.5 font-medium">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="paciente@ejemplo.com"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#cfc9be] text-[#141413] text-xs focus:outline-none focus:border-[#141413] transition"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono tracking-wider uppercase text-[#141413] mb-1.5 font-medium">
                      Previsión
                    </label>
                    <select
                      value={formData.prevision}
                      onChange={(e) => setFormData({ ...formData, prevision: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#faf8f5] border border-[#cfc9be] text-[#141413] text-xs font-mono focus:outline-none focus:border-[#141413] transition"
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
                    <label className="block text-[11px] font-mono tracking-wider uppercase text-[#141413] mb-1.5 font-medium">
                      Contraseña *
                    </label>
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#cfc9be] text-[#141413] text-xs focus:outline-none focus:border-[#141413] transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#141413] hover:bg-black text-[#faf8f5] text-xs font-mono uppercase tracking-widest transition flex items-center justify-center gap-2 font-medium shadow-xs disabled:opacity-50"
                >
                  <span>{isSubmitting ? "Registrando Ficha..." : "Crear Ficha de Paciente"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

            <div className="pt-4 border-t border-[#f0ede6] text-center text-xs text-[#66635d]">
              ¿Ya posees una cuenta o ficha clínica?{" "}
              <a href="/login" className="text-[#141413] font-bold underline underline-offset-4 hover:text-black">
                Iniciar sesión aquí
              </a>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
