"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CMSHeaderConfig } from "@/types/cms";
import {
  Layout,
  Menu,
  Sliders,
  Type,
  Maximize2,
  Smartphone,
  Monitor,
  Eye,
  Check,
  Sparkles,
  ShieldCheck,
  Calendar,
  Layers,
  ChevronRight,
  Sun,
  Moon,
  Laptop,
  Palette,
} from "lucide-react";

interface HeaderMenuEditorProps {
  headerConfig: CMSHeaderConfig;
  onChange: (updated: CMSHeaderConfig) => void;
}

export function HeaderMenuEditor({ headerConfig, onChange }: HeaderMenuEditorProps) {
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [testSystemDark, setTestSystemDark] = useState(false);

  const activeColorScheme = headerConfig.colorScheme || "blanco";
  const previewIsDark =
    activeColorScheme === "negro" || (activeColorScheme === "sistema" && testSystemDark);

  const update = <K extends keyof CMSHeaderConfig>(key: K, value: CMSHeaderConfig[K]) => {
    onChange({
      ...headerConfig,
      [key]: value,
    });
  };

  // Preset unificado de distribución para evitar duplicar "Formato" y "Alineación"
  const currentLayoutPreset =
    headerConfig.layout === "centered"
      ? "centered"
      : headerConfig.layout === "split"
      ? "split"
      : headerConfig.navAlignment === "left"
      ? "classic-left"
      : "classic-center";

  const applyLayoutPreset = (preset: "classic-center" | "classic-left" | "split" | "centered") => {
    if (preset === "classic-center") {
      onChange({ ...headerConfig, layout: "classic", navAlignment: "center" });
    } else if (preset === "classic-left") {
      onChange({ ...headerConfig, layout: "classic", navAlignment: "left" });
    } else if (preset === "split") {
      onChange({ ...headerConfig, layout: "split", navAlignment: "right" });
    } else if (preset === "centered") {
      onChange({ ...headerConfig, layout: "centered", navAlignment: "center" });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 w-full min-w-0 max-w-full">
      {/* Encabezado Principal */}
      <div className="bg-white border border-slate-200 p-5 sm:p-6 rounded-lg shadow-xs space-y-1.5">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#0284c7] font-bold">
          <Layout className="w-4 h-4" />
          <span>Editor de Cabecera & Menú</span>
        </div>
        <h2 className="text-xl font-medium text-slate-900 tracking-tight">
          Navegación, Logotipo y Jerarquía Visual
        </h2>
        <p className="text-xs text-slate-500 font-normal leading-relaxed max-w-2xl">
          Personaliza la distribución del menú, colores del tema, proporciones de marca y botones de agendamiento online.
        </p>
      </div>

      {/* Simulador Interactivo en Vivo */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 sm:p-5 space-y-4 text-white w-full min-w-0 max-w-full overflow-hidden shadow-md">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
              Vista Previa en Vivo
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {activeColorScheme === "sistema" && (
              <div className="flex items-center gap-1 bg-slate-800 p-1 rounded text-xs font-mono border border-slate-700">
                <span className="text-[10px] text-slate-400 px-1 font-mono">Modo SO:</span>
                <button
                  type="button"
                  onClick={() => setTestSystemDark(false)}
                  className={`px-2 py-0.5 rounded text-[10px] flex items-center gap-1 transition ${
                    !testSystemDark ? "bg-amber-400 text-slate-900 font-bold" : "text-slate-400 hover:text-white"
                  }`}
                  title="Simular visualización en sistema con modo claro"
                >
                  <Sun className="w-3 h-3" />
                  <span>Claro</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTestSystemDark(true)}
                  className={`px-2 py-0.5 rounded text-[10px] flex items-center gap-1 transition ${
                    testSystemDark ? "bg-indigo-500 text-white font-bold" : "text-slate-400 hover:text-white"
                  }`}
                  title="Simular visualización en sistema con modo oscuro"
                >
                  <Moon className="w-3 h-3" />
                  <span>Oscuro</span>
                </button>
              </div>
            )}

            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded text-xs font-mono">
              <button
                onClick={() => setPreviewMode("desktop")}
                className={`px-3 py-1 rounded flex items-center gap-1.5 transition ${
                  previewMode === "desktop" ? "bg-slate-700 text-white font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Escritorio ({headerConfig.desktopHeight}px)</span>
              </button>
              <button
                onClick={() => setPreviewMode("mobile")}
                className={`px-3 py-1 rounded flex items-center gap-1.5 transition ${
                  previewMode === "mobile" ? "bg-slate-700 text-white font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Móvil ({headerConfig.mobileHeight}px)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Preview Container */}
        <div
          className={`w-full min-w-0 max-w-full rounded-md border shadow-inner overflow-x-auto overflow-y-hidden transition-colors duration-200 scrollbar-thin ${
            previewIsDark
              ? "bg-[#0e0e0d] text-[#faf8f5] border-slate-700"
              : "bg-[#faf8f5] text-[#141413] border-slate-300"
          }`}
        >
          <div
            style={{
              height:
                previewMode === "desktop"
                  ? `${Math.max(headerConfig.desktopHeight, headerConfig.logoSize + 16)}px`
                  : `${headerConfig.mobileHeight}px`,
              minWidth: previewMode === "desktop" ? "860px" : "100%",
              width: previewMode === "desktop" ? "max-content" : "100%",
            }}
            className="px-6 flex items-center justify-between transition-all"
          >
            {/* Logo area */}
            <div className="flex items-center gap-3 shrink-0 mr-6">
              <div
                style={{
                  width: `${previewMode === "desktop" ? headerConfig.logoSize : Math.min(headerConfig.logoSize, 40)}px`,
                  height: `${previewMode === "desktop" ? headerConfig.logoSize : Math.min(headerConfig.logoSize, 40)}px`,
                }}
                className={`relative rounded-full overflow-hidden p-0.5 shadow-2xs shrink-0 transition-colors ${
                  previewIsDark ? "bg-neutral-900 border border-neutral-700" : "bg-white border border-[#ded9cd]"
                }`}
              >
                <Image
                  src="/images/brand/logo.png"
                  alt="BeHappy"
                  fill
                  className="object-cover rounded-full"
                />
              </div>

              {headerConfig.showBrandText && (
                <div className="whitespace-nowrap shrink-0">
                  <span
                    className={`text-xs font-semibold block leading-tight transition-colors ${
                      previewIsDark ? "text-[#faf8f5]" : "text-[#141413]"
                    }`}
                  >
                    Centro Dental BeHappy
                  </span>
                  <span
                    className={`text-[9px] font-mono tracking-wider block transition-colors ${
                      previewIsDark ? "text-[#a8a398]" : "text-[#78736a]"
                    }`}
                  >
                    Ñuñoa · Suecia 3580
                  </span>
                </div>
              )}
            </div>

            {/* Desktop Links preview */}
            {previewMode === "desktop" && !headerConfig.burgerOnDesktop ? (
              <div
                style={{ gap: `${headerConfig.linksSpacing}px` }}
                className={`flex items-center min-w-0 ${
                  headerConfig.layout === "split"
                    ? "ml-auto mr-6 shrink-0"
                    : headerConfig.layout === "centered"
                    ? "justify-center flex-1 mx-4"
                    : headerConfig.navAlignment === "left"
                    ? "mr-auto justify-start"
                    : headerConfig.navAlignment === "right"
                    ? "ml-auto justify-end mr-6"
                    : "justify-center flex-1 mx-4"
                }`}
              >
                {["Inicio", "Tratamientos", "Precios", "Club BeHappy", "Nosotros", "Galería", "Contacto"].map((name) => (
                  <span
                    key={name}
                    style={{
                      fontSize: `${headerConfig.fontSize}px`,
                      letterSpacing: headerConfig.letterSpacing,
                      textTransform: headerConfig.textTransform,
                      fontFamily:
                        headerConfig.fontFamily === "serif"
                          ? "Newsreader, Georgia, serif"
                          : headerConfig.fontFamily === "sans"
                          ? "system-ui, sans-serif"
                          : "monospace",
                    }}
                    className={`font-normal whitespace-nowrap shrink-0 transition-colors ${
                      previewIsDark ? "text-[#a8a398]" : "text-[#66635d]"
                    }`}
                  >
                    {name}
                  </span>
                ))}
              </div>
            ) : previewMode === "mobile" || headerConfig.burgerOnDesktop ? (
              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded transition-colors whitespace-nowrap ${
                    previewIsDark ? "text-slate-400 bg-slate-800" : "text-slate-500 bg-slate-200"
                  }`}
                >
                  Menú Burger
                </span>
                <div
                  className={`w-7 h-7 rounded border flex items-center justify-center transition-colors shrink-0 ${
                    previewIsDark ? "border-slate-700 text-white" : "border-slate-300 text-slate-700"
                  }`}
                >
                  <Menu className="w-4 h-4" />
                </div>
              </div>
            ) : null}

            {/* Right Action Buttons */}
            <div className="flex items-center gap-2 shrink-0 whitespace-nowrap ml-auto">
              <span
                className={`px-3 py-1.5 text-[11px] font-mono tracking-wider uppercase font-medium rounded-xs whitespace-nowrap shrink-0 transition-colors ${
                  previewIsDark
                    ? "border border-[#3e3b35] text-[#faf8f5]"
                    : "border border-[#141413] text-[#141413]"
                }`}
              >
                {headerConfig.portalButtonText || "Portal Clínico"}
              </span>
              <span
                className={`px-3 py-1.5 text-[11px] font-mono tracking-wider uppercase font-medium rounded-xs whitespace-nowrap shrink-0 shadow-2xs transition-colors ${
                  previewIsDark
                    ? "bg-[#faf8f5] text-[#141413]"
                    : "bg-[#141413] text-white"
                }`}
              >
                {headerConfig.bookingButtonText || "Reservar Cita"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Panel de Controles */}
      <div className="space-y-6">

        {/* 1. PALETA DE COLOR & TEMA */}
        <div className="bg-white border border-slate-200 p-5 sm:p-6 rounded-lg shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-purple-600" />
              <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider font-mono">
                1. Esquema de Color & Tema
              </h3>
            </div>
            <span className="text-[10px] font-mono text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-full font-bold uppercase">
              Activo: {headerConfig.colorScheme || "blanco"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: "blanco" as const,
                title: "Blanco Clínico",
                sub: "Modo Claro",
                icon: <Sun className="w-4 h-4 text-amber-500" />,
                desc: "Fondo marfil (#faf8f5) con tipografía oscura, estética médica limpia y bordes arena.",
                previewBox: "bg-[#faf8f5] border-[#e5e0d5] text-[#141413]",
              },
              {
                id: "negro" as const,
                title: "Negro Carbón",
                sub: "Modo Oscuro",
                icon: <Moon className="w-4 h-4 text-indigo-400" />,
                desc: "Fondo carbón (#0e0e0d) con tipografía marfil (#faf8f5) de alto contraste nocturno.",
                previewBox: "bg-[#0e0e0d] border-[#262421] text-[#faf8f5]",
              },
              {
                id: "sistema" as const,
                title: "Sistema SO",
                sub: "Adaptativo Automático",
                icon: <Laptop className="w-4 h-4 text-sky-400" />,
                desc: "Responde de forma automática a la preferencia del dispositivo del paciente.",
                previewBox: "bg-linear-to-r from-[#faf8f5] via-slate-200 to-[#0e0e0d] border-slate-300 text-slate-900 font-bold",
              },
            ].map((scheme) => {
              const isSelected = (headerConfig.colorScheme || "blanco") === scheme.id;
              return (
                <button
                  key={scheme.id}
                  type="button"
                  onClick={() => update("colorScheme", scheme.id)}
                  className={`p-3.5 text-left border rounded-md transition space-y-2 relative cursor-pointer ${
                    isSelected
                      ? "border-purple-600 bg-purple-50/40 ring-1 ring-purple-600"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {scheme.icon}
                      <span className="text-xs font-bold text-slate-900">{scheme.title}</span>
                    </div>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] font-bold">
                        ✓
                      </span>
                    )}
                  </div>

                  <div className={`h-6 rounded border flex items-center justify-center px-2 text-[10px] font-mono uppercase tracking-wider ${scheme.previewBox}`}>
                    <span>{scheme.sub}</span>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-snug">
                    {scheme.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. DISPOSICIÓN Y FORMATO DEL MENÚ (UNIFICADO) */}
        <div className="bg-white border border-slate-200 p-5 sm:p-6 rounded-lg shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Layout className="w-4 h-4 text-slate-700" />
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider font-mono">
              2. Disposición del Menú (Escritorio & Móvil)
            </h3>
          </div>

          {/* Opciones de disposición de enlaces */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono text-slate-600 uppercase tracking-wider font-bold block">
              Distribución en Escritorio
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                {
                  id: "classic-center" as const,
                  title: "Clásico Centrado",
                  badge: "Recomendado",
                  desc: "Logo a la izquierda · Enlaces al centro · Botones a la derecha",
                },
                {
                  id: "classic-left" as const,
                  title: "Junto al Logo",
                  badge: "Compacto",
                  desc: "Logo y enlaces agrupados a la izquierda · Botones a la derecha",
                },
                {
                  id: "split" as const,
                  title: "Agrupado a la Derecha",
                  badge: "Editorial",
                  desc: "Logo a la izquierda · Enlaces y botones juntos a la derecha",
                },
                {
                  id: "centered" as const,
                  title: "Centrado Total",
                  badge: "Institucional",
                  desc: "Logo centrado arriba · Navegación y botones centrados abajo",
                },
              ].map((opt) => {
                const isSelected = currentLayoutPreset === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => applyLayoutPreset(opt.id)}
                    className={`p-3 text-left border rounded-md transition space-y-1.5 cursor-pointer ${
                      isSelected
                        ? "border-[#0284c7] bg-sky-50/50 ring-1 ring-[#0284c7]"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{opt.title}</span>
                      {isSelected ? (
                        <Check className="w-3.5 h-3.5 text-[#0284c7]" />
                      ) : (
                        <span className="text-[9px] font-mono text-slate-400 uppercase">{opt.badge}</span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight">{opt.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Menú Móvil */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <span className="text-[11px] font-mono text-slate-600 uppercase tracking-wider font-bold block">
              Menú Móvil Desplegable
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: "fullscreen" as const, title: "Pantalla Completa", desc: "Cubre toda la pantalla con scroll vertical" },
                { id: "drawer-right" as const, title: "Panel Lateral Derecho", desc: "Despliegue lateral desde la derecha (Drawer)" },
                { id: "drawer-left" as const, title: "Panel Lateral Izquierdo", desc: "Despliegue lateral desde la izquierda" },
              ].map((m) => {
                const isSelected = headerConfig.mobileMenuType === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => update("mobileMenuType", m.id)}
                    className={`p-3 text-left border rounded-md transition space-y-1 cursor-pointer ${
                      isSelected
                        ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-slate-900">{m.title}</div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-slate-900" />}
                    </div>
                    <div className="text-[10px] text-slate-500">{m.desc}</div>
                  </button>
                );
              })}
            </div>

            <label className="flex items-center justify-between p-3 rounded-md bg-slate-50 border border-slate-200 cursor-pointer">
              <div>
                <span className="text-xs font-medium text-slate-900 block">Menú hamburguesa en escritorio</span>
                <span className="text-[11px] text-slate-500 font-normal">
                  Oculta la fila horizontal de enlaces y muestra únicamente el botón hamburguesa
                </span>
              </div>
              <input
                type="checkbox"
                checked={headerConfig.burgerOnDesktop}
                onChange={(e) => update("burgerOnDesktop", e.target.checked)}
                className="w-4 h-4 text-[#0284c7] rounded border-slate-300 focus:ring-[#0284c7]"
              />
            </label>
          </div>
        </div>

        {/* 3. DIMENSIONES & DETALLES DE MARCA */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Dimensiones y Comportamiento */}
          <div className="bg-white border border-slate-200 p-5 sm:p-6 rounded-lg shadow-xs space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Sliders className="w-4 h-4 text-slate-700" />
              <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider font-mono">
                3. Dimensiones & Comportamiento
              </h3>
            </div>

            {/* Altura de cabecera con chips */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-800">Altura de Cabecera (Escritorio)</span>
                <span className="font-mono font-bold text-[#0284c7] bg-sky-50 px-2 py-0.5 rounded">
                  {headerConfig.desktopHeight}px
                </span>
              </div>
              <div className="flex items-center gap-1.5 pb-1">
                {[
                  { label: "64px (Ajustada)", val: 64 },
                  { label: "84px (Recomendada)", val: 84 },
                  { label: "100px (Espaciosa)", val: 100 },
                  { label: "120px (Editorial)", val: 120 },
                ].map((chip) => (
                  <button
                    key={chip.val}
                    type="button"
                    onClick={() => update("desktopHeight", chip.val)}
                    className={`px-2 py-1 text-[10px] font-mono rounded border transition ${
                      headerConfig.desktopHeight === chip.val
                        ? "bg-[#0284c7] text-white border-[#0284c7] font-bold"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
              <input
                type="range"
                min="64"
                max="160"
                step="2"
                value={headerConfig.desktopHeight}
                onChange={(e) => update("desktopHeight", parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0284c7]"
              />
            </div>

            {/* Tamaño del Logo con chips */}
            <div className="space-y-2 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-800">Tamaño del Logotipo</span>
                <span className="font-mono font-bold text-[#059669] bg-emerald-50 px-2 py-0.5 rounded">
                  {headerConfig.logoSize}px
                </span>
              </div>
              <div className="flex items-center gap-1.5 pb-1">
                {[
                  { label: "42px (Discreto)", val: 42 },
                  { label: "52px (Estándar)", val: 52 },
                  { label: "72px (Destacado)", val: 72 },
                  { label: "96px (Grande)", val: 96 },
                ].map((chip) => (
                  <button
                    key={chip.val}
                    type="button"
                    onClick={() => update("logoSize", chip.val)}
                    className={`px-2 py-1 text-[10px] font-mono rounded border transition ${
                      headerConfig.logoSize === chip.val
                        ? "bg-[#059669] text-white border-[#059669] font-bold"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
              <input
                type="range"
                min="36"
                max="120"
                step="2"
                value={headerConfig.logoSize}
                onChange={(e) => update("logoSize", parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#059669]"
              />
            </div>

            {/* Checkboxes de Comportamiento */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="flex items-center justify-between p-2.5 rounded-md bg-slate-50 border border-slate-200 cursor-pointer">
                <div>
                  <span className="text-xs font-medium text-slate-900 block">Mostrar nombre y sede institucional</span>
                  <span className="text-[10px] text-slate-500 font-mono">Centro Dental BeHappy · Ñuñoa Suecia 3580</span>
                </div>
                <input
                  type="checkbox"
                  checked={headerConfig.showBrandText}
                  onChange={(e) => update("showBrandText", e.target.checked)}
                  className="w-4 h-4 text-[#0284c7] rounded border-slate-300 focus:ring-[#0284c7]"
                />
              </label>

              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center justify-between p-2.5 rounded-md bg-slate-50 border border-slate-200 cursor-pointer">
                  <span className="text-xs font-medium text-slate-900">Cabecera fija (Sticky)</span>
                  <input
                    type="checkbox"
                    checked={headerConfig.isSticky}
                    onChange={(e) => update("isSticky", e.target.checked)}
                    className="w-4 h-4 text-[#0284c7] rounded border-slate-300 focus:ring-[#0284c7]"
                  />
                </label>
                <label className="flex items-center justify-between p-2.5 rounded-md bg-slate-50 border border-slate-200 cursor-pointer">
                  <span className="text-xs font-medium text-slate-900">Desenfoque (Blur)</span>
                  <input
                    type="checkbox"
                    checked={headerConfig.enableBlur}
                    onChange={(e) => update("enableBlur", e.target.checked)}
                    className="w-4 h-4 text-[#0284c7] rounded border-slate-300 focus:ring-[#0284c7]"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Tipografía, Separación & Botones */}
          <div className="bg-white border border-slate-200 p-5 sm:p-6 rounded-lg shadow-xs space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Type className="w-4 h-4 text-slate-700" />
              <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider font-mono">
                4. Tipografía & Botones CTA
              </h3>
            </div>

            {/* Familia tipográfica */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono text-slate-600 uppercase tracking-wider font-bold block">
                Fuente de los Enlaces
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "sans" as const, title: "Sans-Serif", sub: "Limpia y moderna" },
                  { id: "mono" as const, title: "Monoespaciada", sub: "Look técnico" },
                  { id: "serif" as const, title: "Editorial", sub: "Newsreader elegante" },
                ].map((f) => {
                  const isSelected = headerConfig.fontFamily === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => update("fontFamily", f.id)}
                      className={`p-2.5 text-left border rounded transition cursor-pointer ${
                        isSelected
                          ? "border-[#141413] bg-slate-50 font-bold ring-1 ring-[#141413]"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className="text-xs text-slate-900">{f.title}</div>
                      <div className="text-[10px] text-slate-500 font-light">{f.sub}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Separación y Formato */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-700 font-bold mb-1">
                  Tamaño de Texto
                </label>
                <select
                  value={headerConfig.fontSize}
                  onChange={(e) => update("fontSize", parseInt(e.target.value, 10))}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 text-xs font-mono rounded text-slate-800"
                >
                  <option value={11}>11px (Fino)</option>
                  <option value={12}>12px (Estándar)</option>
                  <option value={13}>13px (Medio)</option>
                  <option value={14}>14px (Grande)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-700 font-bold mb-1">
                  Transformación
                </label>
                <select
                  value={headerConfig.textTransform}
                  onChange={(e) => update("textTransform", e.target.value as any)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 text-xs font-mono rounded text-slate-800"
                >
                  <option value="uppercase">MAYÚSCULAS</option>
                  <option value="normal">Normal</option>
                  <option value="capitalize">Capitalizar</option>
                </select>
              </div>
            </div>

            {/* Separación de Enlaces */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-800">Separación entre Enlaces</span>
                <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                  {headerConfig.linksSpacing}px
                </span>
              </div>
              <input
                type="range"
                min="12"
                max="48"
                step="2"
                value={headerConfig.linksSpacing}
                onChange={(e) => update("linksSpacing", parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-800"
              />
            </div>

            {/* Textos de Botones CTA */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <span className="text-[11px] font-mono text-slate-600 uppercase tracking-wider font-bold block">
                Etiquetas de Botones de Cabecera
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1">
                    Botón Secundario (Portal)
                  </label>
                  <input
                    type="text"
                    value={headerConfig.portalButtonText}
                    onChange={(e) => update("portalButtonText", e.target.value)}
                    placeholder="Portal Clínico"
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 text-xs font-mono rounded text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1">
                    Botón Principal (CTA Reserva)
                  </label>
                  <input
                    type="text"
                    value={headerConfig.bookingButtonText}
                    onChange={(e) => update("bookingButtonText", e.target.value)}
                    placeholder="Reservar Cita"
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 text-xs font-mono rounded text-slate-900"
                  />
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
