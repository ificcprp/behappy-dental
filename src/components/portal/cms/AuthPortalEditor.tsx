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
  const [previewTheme, setPreviewTheme] = useState<"blanco" | "negro">("blanco");
  const isDark = previewTheme === "negro";

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
      <div className="border border-slate-200 bg-white p-4 sm:p-5 rounded-lg shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-emerald-600" />
            <span>Portal Clínico & Acceso de Pacientes (/login y /registro)</span>
          </h3>
          <p className="text-xs text-slate-600 font-light mt-0.5">
            Configuración y personalización integral de todos los textos, títulos, botones y garantías del portal de autenticación.
          </p>
        </div>
        <button
          onClick={handleResetDefaults}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-mono rounded transition cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Valores por Defecto</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Field Editors (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Section: Identidad & Encabezado */}
          <div className="border border-slate-200 bg-white p-5 rounded-lg shadow-xs space-y-4">
            <h4 className="text-xs font-mono text-emerald-700 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>1. Identidad de Marca y Encabezado</span>
            </h4>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-mono text-slate-600 uppercase mb-1 font-bold">
                  Kicker Superior (Ubicación o Categoría)
                </label>
                <input
                  type="text"
                  value={current.badge}
                  onChange={(e) => handleChange("badge", e.target.value)}
                  placeholder="SEDE ÑUÑOA · SUECIA 3580"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono rounded focus:bg-white focus:border-slate-800 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-600 uppercase mb-1 font-bold">
                    Título Principal
                  </label>
                  <input
                    type="text"
                    value={current.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    placeholder="Portal Clínico & Pacientes"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded focus:bg-white focus:border-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-slate-600 uppercase mb-1 font-bold">
                    Palabra Destacada (Estilo Serif Cursiva)
                  </label>
                  <input
                    type="text"
                    value={current.titleHighlight}
                    onChange={(e) => handleChange("titleHighlight", e.target.value)}
                    placeholder="BeHappy"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-emerald-700 text-xs font-serif italic rounded focus:bg-white focus:border-slate-800 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-600 uppercase mb-1 font-bold">
                  Subtítulo Explicativo
                </label>
                <textarea
                  rows={2}
                  value={current.subtitle}
                  onChange={(e) => handleChange("subtitle", e.target.value)}
                  placeholder="Acceso seguro a ficha clínica digital, citas, presupuestos y convenios."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded focus:bg-white focus:border-slate-800 outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* Section: Selector Segmentado y Botones de Acción */}
          <div className="border border-slate-200 bg-white p-5 rounded-lg shadow-xs space-y-4">
            <h4 className="text-xs font-mono text-emerald-700 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2 font-bold">
              <UserCheck className="w-3.5 h-3.5" />
              <span>2. Pestañas y Botones de Acción</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono text-slate-600 uppercase mb-1 font-bold">
                  Nombre Pestaña: Iniciar Sesión
                </label>
                <input
                  type="text"
                  value={current.loginTabLabel}
                  onChange={(e) => handleChange("loginTabLabel", e.target.value)}
                  placeholder="Iniciar Sesión"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono rounded focus:bg-white focus:border-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-600 uppercase mb-1 font-bold">
                  Nombre Pestaña: Registro
                </label>
                <input
                  type="text"
                  value={current.registerTabLabel}
                  onChange={(e) => handleChange("registerTabLabel", e.target.value)}
                  placeholder="Crear Ficha Paciente"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono rounded focus:bg-white focus:border-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-600 uppercase mb-1 font-bold">
                  Texto Botón: Entrar
                </label>
                <input
                  type="text"
                  value={current.loginButtonText}
                  onChange={(e) => handleChange("loginButtonText", e.target.value)}
                  placeholder="Ingresar al Portal"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono rounded focus:bg-white focus:border-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-600 uppercase mb-1 font-bold">
                  Texto Botón: Registrar Ficha
                </label>
                <input
                  type="text"
                  value={current.registerButtonText}
                  onChange={(e) => handleChange("registerButtonText", e.target.value)}
                  placeholder="Crear Ficha y Acceder"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono rounded focus:bg-white focus:border-slate-800 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section: Enlaces de Ayuda y Garantías */}
          <div className="border border-slate-200 bg-white p-5 rounded-lg shadow-xs space-y-4">
            <h4 className="text-xs font-mono text-emerald-700 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2 font-bold">
              <Lock className="w-3.5 h-3.5" />
              <span>3. Enlaces Auxiliares y Garantía Legal</span>
            </h4>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-mono text-slate-600 uppercase mb-1 font-bold">
                  Enlace Recuperación de Contraseña
                </label>
                <input
                  type="text"
                  value={current.forgotPasswordText}
                  onChange={(e) => handleChange("forgotPasswordText", e.target.value)}
                  placeholder="¿Olvidaste tu clave?"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono rounded focus:bg-white focus:border-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-600 uppercase mb-1 font-bold">
                  Texto Enlace Reserva Directa
                </label>
                <input
                  type="text"
                  value={current.directBookingText}
                  onChange={(e) => handleChange("directBookingText", e.target.value)}
                  placeholder="¿Deseas atención directa? Reservar cita online"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded focus:bg-white focus:border-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-600 uppercase mb-1 font-bold">
                  Texto Enlace Modo Demostración
                </label>
                <input
                  type="text"
                  value={current.demoAccessText}
                  onChange={(e) => handleChange("demoAccessText", e.target.value)}
                  placeholder="Acceso a Entorno de Demostración (Pitch & Roles)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded focus:bg-white focus:border-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-600 uppercase mb-1 font-bold">
                  Garantía de Bioseguridad y Ley Chilena
                </label>
                <input
                  type="text"
                  value={current.securityNotice}
                  onChange={(e) => handleChange("securityNotice", e.target.value)}
                  placeholder="Acceso protegido bajo Ley 20.584 · Cifrado Clínico TLS 1.3"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-emerald-800 text-xs font-mono rounded focus:bg-white focus:border-slate-800 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Preview: Live Interactive Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-600">
            <span className="flex items-center gap-1.5 uppercase tracking-wider text-emerald-700 font-bold">
              <Eye className="w-3.5 h-3.5" />
              Previsualización en Vivo
            </span>
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded border border-slate-200 text-[10px]">
              <button
                type="button"
                onClick={() => setPreviewTheme("blanco")}
                className={`px-2 py-0.5 rounded transition ${!isDark ? "bg-white text-slate-900 font-bold shadow-xs" : "text-slate-500 hover:text-slate-900"}`}
              >
                Blanco
              </button>
              <button
                type="button"
                onClick={() => setPreviewTheme("negro")}
                className={`px-2 py-0.5 rounded transition ${isDark ? "bg-slate-900 text-white font-bold" : "text-slate-500 hover:text-slate-900"}`}
              >
                Negro
              </button>
            </div>
          </div>

          <div className={`p-5 sm:p-6 border shadow-inner space-y-5 rounded-md transition-colors duration-200 ${
            isDark
              ? "bg-[#0e0e0d] text-[#faf8f5] border-[#262421]"
              : "bg-[#faf8f5] text-[#141413] border-[#ded9cd]"
          }`}>
            {/* Header Preview */}
            <div className="text-center space-y-2">
              <span className={`text-[9px] font-mono tracking-[0.2em] uppercase block ${
                isDark ? "text-[#a8a398]" : "text-[#78736a]"
              }`}>
                {current.badge || "SEDE ÑUÑOA · SUECIA 3580"}
              </span>
              <h2 className={`text-xl font-light tracking-tight ${
                isDark ? "text-[#faf8f5]" : "text-[#141413]"
              }`}>
                {current.title || "Portal Clínico & Pacientes"}{" "}
                <span className={`font-serif italic font-normal ${
                  isDark ? "text-neutral-300" : "text-neutral-800"
                }`}>
                  {current.titleHighlight || "BeHappy"}
                </span>
              </h2>
              <p className={`text-[11px] font-light leading-relaxed ${
                isDark ? "text-[#a8a398]" : "text-[#66635d]"
              }`}>
                {current.subtitle || "Acceso seguro a ficha clínica digital, citas, presupuestos y convenios."}
              </p>
            </div>

            {/* Card Preview */}
            <div className={`p-5 space-y-4 shadow-2xs border transition-colors duration-200 rounded-md ${
              isDark
                ? "bg-[#181816] border-[#2c2a26]"
                : "bg-white border-[#e5e0d5]"
            }`}>
              {/* Segmented Switcher */}
              <div className={`grid grid-cols-2 p-1 border gap-1 rounded ${
                isDark
                  ? "bg-[#121210] border-[#2a2824]"
                  : "bg-[#f4f1ea] border-[#e2ddd3]"
              }`}>
                <button
                  type="button"
                  onClick={() => setPreviewTab("login")}
                  className={`py-1.5 text-[11px] font-mono uppercase tracking-wider rounded transition ${
                    previewTab === "login"
                      ? isDark
                        ? "bg-[#242320] text-white font-bold border border-[#3e3b35]"
                        : "bg-white text-[#141413] font-bold shadow-xs border border-[#ded8cb]"
                      : isDark
                      ? "text-[#a8a398] hover:text-white"
                      : "text-[#78736a] hover:text-[#141413]"
                  }`}
                >
                  {current.loginTabLabel || "Iniciar Sesión"}
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab("register")}
                  className={`py-1.5 text-[11px] font-mono uppercase tracking-wider rounded transition ${
                    previewTab === "register"
                      ? isDark
                        ? "bg-[#242320] text-white font-bold border border-[#3e3b35]"
                        : "bg-white text-[#141413] font-bold shadow-xs border border-[#ded8cb]"
                      : isDark
                      ? "text-[#a8a398] hover:text-white"
                      : "text-[#78736a] hover:text-[#141413]"
                  }`}
                >
                  {current.registerTabLabel || "Crear Ficha Paciente"}
                </button>
              </div>

              {previewTab === "login" ? (
                <div className="space-y-3">
                  <div>
                    <label className={`block text-[10px] font-mono tracking-wider uppercase mb-1 font-medium ${
                      isDark ? "text-[#e8e4db]" : "text-[#141413]"
                    }`}>
                      RUT o Correo Electrónico
                    </label>
                    <div className={`w-full px-3 py-2 border rounded text-xs font-mono ${
                      isDark
                        ? "bg-[#121210] border-[#383530] text-[#a8a398]"
                        : "bg-[#faf8f5] border-[#cfc9be] text-[#78736a]"
                    }`}>
                      12.345.678-9 / usuario@correo.cl
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className={`block text-[10px] font-mono tracking-wider uppercase font-medium ${
                        isDark ? "text-[#e8e4db]" : "text-[#141413]"
                      }`}>
                        Contraseña
                      </label>
                      <span className={`text-[9px] font-mono ${isDark ? "text-[#a8a398]" : "text-[#78736a]"}`}>
                        {current.forgotPasswordText || "¿Olvidaste tu clave?"}
                      </span>
                    </div>
                    <div className={`w-full px-3 py-2 border rounded text-xs font-mono ${
                      isDark
                        ? "bg-[#121210] border-[#383530] text-[#a8a398]"
                        : "bg-[#faf8f5] border-[#cfc9be] text-[#78736a]"
                    }`}>
                      ••••••••
                    </div>
                  </div>
                  <div className={`w-full py-2.5 text-xs font-mono uppercase tracking-widest flex items-center justify-center gap-2 font-medium rounded transition cursor-pointer ${
                    isDark
                      ? "bg-[#faf8f5] text-[#141413] hover:bg-white"
                      : "bg-[#141413] text-[#faf8f5] hover:bg-black"
                  }`}>
                    <span>{current.loginButtonText || "Ingresar al Portal"}</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className={`block text-[10px] font-mono tracking-wider uppercase mb-1 font-medium ${
                      isDark ? "text-[#e8e4db]" : "text-[#141413]"
                    }`}>
                      Nombre Completo
                    </label>
                    <div className={`w-full px-3 py-2 border rounded text-xs font-mono ${
                      isDark
                        ? "bg-[#121210] border-[#383530] text-[#a8a398]"
                        : "bg-[#faf8f5] border-[#cfc9be] text-[#78736a]"
                    }`}>
                      Camila González Pérez
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className={`block text-[10px] font-mono tracking-wider uppercase mb-1 font-medium ${
                        isDark ? "text-[#e8e4db]" : "text-[#141413]"
                      }`}>
                        RUT
                      </label>
                      <div className={`w-full px-2.5 py-2 border rounded text-xs font-mono ${
                        isDark
                          ? "bg-[#121210] border-[#383530] text-[#a8a398]"
                          : "bg-[#faf8f5] border-[#cfc9be] text-[#78736a]"
                      }`}>
                        18.492.381-4
                      </div>
                    </div>
                    <div>
                      <label className={`block text-[10px] font-mono tracking-wider uppercase mb-1 font-medium ${
                        isDark ? "text-[#e8e4db]" : "text-[#141413]"
                      }`}>
                        Teléfono
                      </label>
                      <div className={`w-full px-2.5 py-2 border rounded text-xs font-mono ${
                        isDark
                          ? "bg-[#121210] border-[#383530] text-[#a8a398]"
                          : "bg-[#faf8f5] border-[#cfc9be] text-[#78736a]"
                      }`}>
                        +56 9 8765 4321
                      </div>
                    </div>
                  </div>
                  <div className={`w-full py-2.5 text-xs font-mono uppercase tracking-widest flex items-center justify-center gap-2 font-medium rounded transition cursor-pointer ${
                    isDark
                      ? "bg-[#faf8f5] text-[#141413] hover:bg-white"
                      : "bg-[#141413] text-[#faf8f5] hover:bg-black"
                  }`}>
                    <span>{current.registerButtonText || "Crear Ficha y Acceder"}</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              )}

              <div className={`pt-3 border-t text-center space-y-1.5 ${
                isDark ? "border-[#2c2a26]" : "border-[#f0ede6]"
              }`}>
                <p className={`text-[10px] font-mono ${isDark ? "text-[#a8a398]" : "text-[#78736a]"}`}>
                  {current.directBookingText}
                </p>
                <p className={`text-[9px] font-mono ${isDark ? "text-sky-400" : "text-[#0284c7]"}`}>
                  {current.demoAccessText}
                </p>
              </div>
            </div>

            {/* Security Pill */}
            <div className="text-center">
              <span className={`text-[9px] font-mono tracking-wider uppercase ${
                isDark ? "text-[#a8a398]" : "text-[#78736a]"
              }`}>
                {current.securityNotice}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
