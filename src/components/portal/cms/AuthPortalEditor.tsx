"use client";

import React, { useState } from "react";
import { CMSAuthPortal, DEFAULT_AUTH_PORTAL } from "@/lib/cmsStore";
import { ShieldCheck, Eye, RefreshCw, KeyRound, UserCheck, ArrowRight, Lock } from "lucide-react";

interface AuthPortalEditorProps {
  authPortal: CMSAuthPortal;
  onUpdateAuthPortal: (updated: CMSAuthPortal) => void;
  triggerToast?: (msg: string) => void;
}

export function AuthPortalEditor({
  authPortal,
  onUpdateAuthPortal,
  triggerToast,
}: AuthPortalEditorProps) {
  const current = authPortal || DEFAULT_AUTH_PORTAL;
  const [previewTab, setPreviewTab] = useState<"login" | "register">("login");

  const handleChange = (field: keyof CMSAuthPortal, value: string) => {
    onUpdateAuthPortal({
      ...current,
      [field]: value,
    });
  };

  const handleResetDefaults = () => {
    if (confirm("¿Deseas restaurar todos los textos del Portal de Acceso a los valores originales?")) {
      onUpdateAuthPortal(DEFAULT_AUTH_PORTAL);
      if (triggerToast) triggerToast("✓ Textos del portal restaurados a valores por defecto");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="border border-[#222228] bg-[#121216] p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="text-base font-normal text-white flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-emerald-400" />
            <span>Portal Clínico & Acceso de Pacientes (/login y /registro)</span>
          </h3>
          <p className="text-xs text-neutral-400 font-light mt-0.5">
            Configuración y personalización integral de todos los textos, títulos, botones y garantías del portal de autenticación.
          </p>
        </div>
        <button
          onClick={handleResetDefaults}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#18181f] hover:bg-[#22222a] border border-[#2e2e38] text-neutral-300 hover:text-white text-xs font-mono transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Valores por Defecto</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Field Editors (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Section: Identidad & Encabezado */}
          <div className="border border-[#222228] bg-[#121216] p-5 space-y-4">
            <h4 className="text-xs font-mono text-emerald-400 uppercase tracking-wider flex items-center gap-2 border-b border-[#222228] pb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>1. Identidad de Marca y Encabezado</span>
            </h4>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                  Kicker Superior (Ubicación o Categoría)
                </label>
                <input
                  type="text"
                  value={current.badge}
                  onChange={(e) => handleChange("badge", e.target.value)}
                  placeholder="SEDE ÑUÑOA · SUECIA 3580"
                  className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                    Título Principal
                  </label>
                  <input
                    type="text"
                    value={current.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    placeholder="Portal Clínico & Pacientes"
                    className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                    Palabra Destacada (Estilo Serif Cursiva)
                  </label>
                  <input
                    type="text"
                    value={current.titleHighlight}
                    onChange={(e) => handleChange("titleHighlight", e.target.value)}
                    placeholder="BeHappy"
                    className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-emerald-400 text-xs font-serif italic focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                  Subtítulo Explicativo
                </label>
                <textarea
                  rows={2}
                  value={current.subtitle}
                  onChange={(e) => handleChange("subtitle", e.target.value)}
                  placeholder="Acceso seguro a ficha clínica digital, citas, presupuestos y convenios."
                  className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs focus:border-emerald-500 outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* Section: Selector Segmentado y Botones de Acción */}
          <div className="border border-[#222228] bg-[#121216] p-5 space-y-4">
            <h4 className="text-xs font-mono text-emerald-400 uppercase tracking-wider flex items-center gap-2 border-b border-[#222228] pb-2">
              <UserCheck className="w-3.5 h-3.5" />
              <span>2. Pestañas y Botones de Acción</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                  Nombre Pestaña: Iniciar Sesión
                </label>
                <input
                  type="text"
                  value={current.loginTabLabel}
                  onChange={(e) => handleChange("loginTabLabel", e.target.value)}
                  placeholder="Iniciar Sesión"
                  className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                  Nombre Pestaña: Registro
                </label>
                <input
                  type="text"
                  value={current.registerTabLabel}
                  onChange={(e) => handleChange("registerTabLabel", e.target.value)}
                  placeholder="Crear Ficha Paciente"
                  className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                  Texto Botón: Entrar
                </label>
                <input
                  type="text"
                  value={current.loginButtonText}
                  onChange={(e) => handleChange("loginButtonText", e.target.value)}
                  placeholder="Ingresar al Portal"
                  className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                  Texto Botón: Registrar Ficha
                </label>
                <input
                  type="text"
                  value={current.registerButtonText}
                  onChange={(e) => handleChange("registerButtonText", e.target.value)}
                  placeholder="Crear Ficha y Acceder"
                  className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono focus:border-emerald-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section: Enlaces de Ayuda y Garantías */}
          <div className="border border-[#222228] bg-[#121216] p-5 space-y-4">
            <h4 className="text-xs font-mono text-emerald-400 uppercase tracking-wider flex items-center gap-2 border-b border-[#222228] pb-2">
              <Lock className="w-3.5 h-3.5" />
              <span>3. Enlaces Auxiliares y Garantía Legal</span>
            </h4>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                  Enlace Recuperación de Contraseña
                </label>
                <input
                  type="text"
                  value={current.forgotPasswordText}
                  onChange={(e) => handleChange("forgotPasswordText", e.target.value)}
                  placeholder="¿Olvidaste tu clave?"
                  className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                  Texto Enlace Reserva Directa
                </label>
                <input
                  type="text"
                  value={current.directBookingText}
                  onChange={(e) => handleChange("directBookingText", e.target.value)}
                  placeholder="¿Deseas atención directa? Reservar cita online"
                  className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                  Texto Enlace Modo Demostración
                </label>
                <input
                  type="text"
                  value={current.demoAccessText}
                  onChange={(e) => handleChange("demoAccessText", e.target.value)}
                  placeholder="Acceso a Entorno de Demostración (Pitch & Roles)"
                  className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                  Garantía de Bioseguridad y Ley Chilena
                </label>
                <input
                  type="text"
                  value={current.securityNotice}
                  onChange={(e) => handleChange("securityNotice", e.target.value)}
                  placeholder="Acceso protegido bajo Ley 20.584 · Cifrado Clínico TLS 1.3"
                  className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-emerald-400 text-xs font-mono focus:border-emerald-500 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Preview: Live Interactive Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
            <span className="flex items-center gap-1.5 uppercase tracking-wider text-emerald-400 font-bold">
              <Eye className="w-3.5 h-3.5" />
              Previsualización en Vivo
            </span>
            <span className="text-[10px] text-neutral-500">Auto-sincronizada</span>
          </div>

          <div className="bg-[#faf8f5] text-[#141413] p-5 sm:p-6 border border-[#ded9cd] shadow-inner space-y-5 rounded-xs">
            {/* Header Preview */}
            <div className="text-center space-y-2">
              <span className="text-[9px] font-mono tracking-[0.2em] text-[#78736a] uppercase block">
                {current.badge || "SEDE ÑUÑOA · SUECIA 3580"}
              </span>
              <h2 className="text-xl font-light tracking-tight text-[#141413]">
                {current.title || "Portal Clínico & Pacientes"}{" "}
                <span className="font-serif italic font-normal text-neutral-800">
                  {current.titleHighlight || "BeHappy"}
                </span>
              </h2>
              <p className="text-[11px] text-[#66635d] font-light leading-relaxed">
                {current.subtitle || "Acceso seguro a ficha clínica digital, citas, presupuestos y convenios."}
              </p>
            </div>

            {/* Card Preview */}
            <div className="bg-white border border-[#e5e0d5] p-5 space-y-4 shadow-2xs">
              {/* Segmented Switcher */}
              <div className="grid grid-cols-2 p-1 bg-[#f4f1ea] border border-[#e2ddd3] gap-1">
                <button
                  type="button"
                  onClick={() => setPreviewTab("login")}
                  className={`py-1.5 text-[11px] font-mono uppercase tracking-wider transition ${
                    previewTab === "login"
                      ? "bg-white text-[#141413] font-bold shadow-xs border border-[#ded8cb]"
                      : "text-[#78736a] hover:text-[#141413]"
                  }`}
                >
                  {current.loginTabLabel || "Iniciar Sesión"}
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab("register")}
                  className={`py-1.5 text-[11px] font-mono uppercase tracking-wider transition ${
                    previewTab === "register"
                      ? "bg-white text-[#141413] font-bold shadow-xs border border-[#ded8cb]"
                      : "text-[#78736a] hover:text-[#141413]"
                  }`}
                >
                  {current.registerTabLabel || "Crear Ficha Paciente"}
                </button>
              </div>

              {previewTab === "login" ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-mono tracking-wider uppercase text-[#141413] mb-1 font-medium">
                      RUT o Correo Electrónico
                    </label>
                    <div className="w-full px-3 py-2 bg-[#faf8f5] border border-[#cfc9be] text-[#78736a] text-xs font-mono">
                      12.345.678-9 / usuario@correo.cl
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[10px] font-mono tracking-wider uppercase text-[#141413] font-medium">
                        Contraseña
                      </label>
                      <span className="text-[9px] font-mono text-[#78736a]">
                        {current.forgotPasswordText || "¿Olvidaste tu clave?"}
                      </span>
                    </div>
                    <div className="w-full px-3 py-2 bg-[#faf8f5] border border-[#cfc9be] text-[#78736a] text-xs font-mono">
                      ••••••••
                    </div>
                  </div>
                  <div className="w-full py-2.5 bg-[#141413] text-[#faf8f5] text-xs font-mono uppercase tracking-widest flex items-center justify-center gap-2 font-medium">
                    <span>{current.loginButtonText || "Ingresar al Portal"}</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-mono tracking-wider uppercase text-[#141413] mb-1 font-medium">
                      Nombre Completo
                    </label>
                    <div className="w-full px-3 py-2 bg-[#faf8f5] border border-[#cfc9be] text-[#78736a] text-xs font-mono">
                      Camila González Pérez
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-mono tracking-wider uppercase text-[#141413] mb-1 font-medium">
                        RUT
                      </label>
                      <div className="w-full px-2.5 py-2 bg-[#faf8f5] border border-[#cfc9be] text-[#78736a] text-xs font-mono">
                        18.492.381-4
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono tracking-wider uppercase text-[#141413] mb-1 font-medium">
                        Teléfono
                      </label>
                      <div className="w-full px-2.5 py-2 bg-[#faf8f5] border border-[#cfc9be] text-[#78736a] text-xs font-mono">
                        +56 9 8765 4321
                      </div>
                    </div>
                  </div>
                  <div className="w-full py-2.5 bg-[#141413] text-[#faf8f5] text-xs font-mono uppercase tracking-widest flex items-center justify-center gap-2 font-medium">
                    <span>{current.registerButtonText || "Crear Ficha y Acceder"}</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-[#f0ede6] text-center space-y-1.5">
                <p className="text-[10px] font-mono text-[#78736a]">
                  {current.directBookingText}
                </p>
                <p className="text-[9px] font-mono text-[#0284c7]">
                  {current.demoAccessText}
                </p>
              </div>
            </div>

            {/* Security Pill */}
            <div className="text-center">
              <span className="text-[9px] font-mono text-[#78736a] tracking-wider uppercase">
                {current.securityNotice}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
