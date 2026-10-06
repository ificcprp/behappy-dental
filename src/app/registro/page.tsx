"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { registerNewUser } from "@/lib/authService";

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
    <div className="min-h-screen bg-[#faf8f5] text-[#141413] flex flex-col justify-center py-16 px-4 sm:px-6 lg:px-8">
      
      {/* Brand Header */}
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
            NUEVO PACIENTE · REGISTRO INSTITUCIONAL
          </span>
          <h1 className="text-2xl sm:text-3xl font-normal tracking-tight text-[#141413]">
            Crear Ficha de Paciente
          </h1>
          <p className="text-xs text-[#66635d] font-light">
            Ingrese sus datos para acceder al seguimiento de citas, convenios y ficha dental
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="border border-[#e5e0d5] bg-white p-7 space-y-5">
          
          {success ? (
            <div className="text-center py-8 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-[#141413] mx-auto" />
              <h2 className="text-xl font-normal text-[#141413]">Ficha creada correctamente</h2>
              <p className="text-xs font-mono text-[#78736a]">
                Redirigiendo a su portal de paciente...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div>
                <label className="block text-[11px] font-mono tracking-wider uppercase text-[#141413] mb-1.5">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Ej: Camila González Pérez"
                  className="w-full px-3.5 py-2.5 rounded-[2px] bg-white border border-[#e5e0d5] text-[#141413] text-xs placeholder-[#999] focus:border-[#141413] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono tracking-wider uppercase text-[#141413] mb-1.5">
                    RUT *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.rut}
                    onChange={(e) => setFormData({ ...formData, rut: e.target.value })}
                    placeholder="18.492.381-4"
                    className="w-full px-3.5 py-2.5 rounded-[2px] bg-white border border-[#e5e0d5] text-[#141413] text-xs font-mono placeholder-[#999] focus:border-[#141413] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono tracking-wider uppercase text-[#141413] mb-1.5">
                    Móvil *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+56 9 1234 5678"
                    className="w-full px-3.5 py-2.5 rounded-[2px] bg-white border border-[#e5e0d5] text-[#141413] text-xs font-mono placeholder-[#999] focus:border-[#141413] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono tracking-wider uppercase text-[#141413] mb-1.5">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="paciente@ejemplo.com"
                  className="w-full px-3.5 py-2.5 rounded-[2px] bg-white border border-[#e5e0d5] text-[#141413] text-xs placeholder-[#999] focus:border-[#141413] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono tracking-wider uppercase text-[#141413] mb-1.5">
                  Previsión de Salud
                </label>
                <select
                  value={formData.prevision}
                  onChange={(e) => setFormData({ ...formData, prevision: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-[2px] bg-[#faf8f5] border border-[#e5e0d5] text-[#141413] text-xs font-mono focus:border-[#141413] focus:outline-none"
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
                <label className="block text-[11px] font-mono tracking-wider uppercase text-[#141413] mb-1.5">
                  Contraseña *
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full px-3.5 py-2.5 rounded-[2px] bg-white border border-[#e5e0d5] text-[#141413] text-xs placeholder-[#999] focus:border-[#141413] focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-[2px] bg-[#141413] text-[#faf8f5] hover:bg-black font-mono tracking-widest uppercase font-bold text-xs transition shadow-sm"
                >
                  {isSubmitting ? "Registrando Ficha..." : "Crear Ficha de Paciente"}
                </button>
              </div>

            </form>
          )}

          <div className="pt-4 border-t border-[#f0ede6] text-center text-xs text-[#66635d]">
            ¿Ya posee cuenta?{" "}
            <Link href="/login" className="text-[#141413] font-bold hover:underline font-mono">
              Iniciar sesión
            </Link>
          </div>

        </div>

        <div className="mt-4 text-center">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-mono text-[#78736a] hover:text-[#141413] transition">
            <ArrowLeft className="w-3.5 h-3.5" /> Volver al sitio principal
          </Link>
        </div>

      </div>

    </div>
  );
}
