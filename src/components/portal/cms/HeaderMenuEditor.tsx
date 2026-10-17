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

  return (
    <div className="space-y-8 animate-in fade-in duration-300 w-full min-w-0 max-w-full">
      
      {/* Top Section Intro */}
      <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#0284c7] font-bold">
          <Layout className="w-4 h-4" />
          <span>Editor de Menú, Jerarquía & Cabecera</span>
        </div>
        <h2 className="text-xl font-normal text-slate-900 tracking-tight">
          Estilo del Header, Navegación y Jerarquía Visual
        </h2>
        <p className="text-xs text-slate-600 font-light leading-relaxed max-w-2xl">
          Configura la distribución espacial, tamaño del logotipo, presencia de aire entre enlaces, menú móvil y la visibilidad explícita del acceso al Portal Clínico y al Modo Demo.
        </p>
      </div>

      {/* Simulator / Interactive Header Preview */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 sm:p-6 space-y-4 text-white w-full min-w-0 max-w-full overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
              Simulador en Vivo de Cabecera
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {activeColorScheme === "sistema" && (
              <div className="flex items-center gap-1 bg-slate-800 p-1 rounded text-xs font-mono border border-slate-700">
                <span className="text-[10px] text-slate-400 px-1 font-mono">Simular SO:</span>
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

        {/* Live Preview Container (Aislado con scroll interno horizontal estricto) */}
        <div
          className={`w-full min-w-0 max-w-full rounded-md border shadow-md overflow-x-auto overflow-y-hidden transition-colors duration-200 scrollbar-thin ${
            previewIsDark
              ? "bg-[#0e0e0d] text-[#faf8f5] border-slate-700"
              : "bg-[#faf8f5] text-[#141413] border-slate-300"
          }`}
          style={{ maxWidth: "100%" }}
        >
          <div
            style={{
              height:
                previewMode === "desktop"
                  ? `${Math.max(headerConfig.desktopHeight, headerConfig.logoSize + 16)}px`
                  : `${headerConfig.mobileHeight}px`,
              minWidth: previewMode === "desktop" ? "880px" : "100%",
              width: previewMode === "desktop" ? "max-content" : "100%",
            }}
            className="px-6 flex items-center justify-between transition-all"
          >
            {/* Logo area */}
            <div className="flex items-center gap-3.5 shrink-0 mr-6 lg:mr-8">
              <div
                style={{
                  width: `${previewMode === "desktop" ? headerConfig.logoSize : Math.min(headerConfig.logoSize, 42)}px`,
                  height: `${previewMode === "desktop" ? headerConfig.logoSize : Math.min(headerConfig.logoSize, 42)}px`,
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

                {/* Explicit Demo Mode Tag */}
                {headerConfig.showDemoButton && (
                  <span
                    style={{
                      fontSize: `${headerConfig.fontSize}px`,
                      letterSpacing: headerConfig.letterSpacing,
                      textTransform: headerConfig.textTransform,
                    }}
                    className={`px-2 py-0.5 rounded font-bold inline-flex items-center gap-1 whitespace-nowrap shrink-0 shadow-2xs transition-colors ${
                      previewIsDark
                        ? "text-amber-300 bg-amber-500/20 border border-amber-500/40"
                        : "text-amber-900 bg-amber-500/10 border border-amber-500/30"
                    }`}
                  >
                    <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                    <span>{headerConfig.demoButtonText || "Demo OS (4 Roles)"}</span>
                  </span>
                )}
              </div>
            ) : previewMode === "mobile" || headerConfig.burgerOnDesktop ? (
              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded transition-colors whitespace-nowrap ${
                    previewIsDark ? "text-slate-400 bg-slate-800" : "text-slate-500 bg-slate-200"
                  }`}
                >
                  Menú Burger Activo
                </span>
                <div
                  className={`w-8 h-8 rounded border flex items-center justify-center transition-colors shrink-0 ${
                    previewIsDark ? "border-slate-700 text-white" : "border-slate-300 text-slate-700"
                  }`}
                >
                  <Menu className="w-4 h-4" />
                </div>
              </div>
            ) : null}

            {/* Right Buttons preview */}
            <div className="flex items-center gap-2 shrink-0 whitespace-nowrap ml-auto">
              <span
                className={`px-3 py-1.5 text-[11px] font-mono tracking-wider uppercase font-medium rounded-xs whitespace-nowrap shrink-0 transition-colors ${
                  previewIsDark
                    ? "border border-[#3e3b35] text-[#faf8f5]"
                    : "border border-[#141413] text-[#141413]"
                }`}
              >
                {headerConfig.portalButtonText}
              </span>
              <span
                className={`px-3 py-1.5 text-[11px] font-mono tracking-wider uppercase font-medium rounded-xs whitespace-nowrap shrink-0 shadow-2xs transition-colors ${
                  previewIsDark
                    ? "bg-[#faf8f5] text-[#141413]"
                    : "bg-[#141413] text-white"
                }`}
              >
                {headerConfig.bookingButtonText}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Control Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* BLOQUE DESTACADO: Esquema de Color & Tema (Blanco · Negro · Sistema) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 p-6 rounded-lg shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-purple-600" />
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider font-mono">
                Esquema de Color & Tema (Blanco · Negro · Sistema)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full font-bold uppercase">
              Activo: {headerConfig.colorScheme || "blanco"}
            </span>
          </div>

          <p className="text-xs text-slate-600 font-light leading-relaxed">
            Personaliza el estilo cromático de la cabecera. Puedes mantener el blanco marfil clínico, optar por un negro carbón de alto contraste o seleccionar el modo adaptativo que responde automáticamente al sistema del usuario.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            {[
              {
                id: "blanco" as const,
                title: "Blanco",
                sub: "Modo Claro",
                badge: "Editorial Marfil",
                icon: <Sun className="w-4 h-4 text-amber-500" />,
                desc: "Fondo blanco marfil (#faf8f5) con tipografía oscura, bordes arena y estética médica limpia.",
                previewBox: "bg-[#faf8f5] border-[#e5e0d5] text-[#141413]",
              },
              {
                id: "negro" as const,
                title: "Negro",
                sub: "Modo Oscuro",
                badge: "Carbón Nocturno",
                icon: <Moon className="w-4 h-4 text-indigo-400" />,
                desc: "Fondo negro carbón (#0e0e0d) con tipografía luminosa marfil (#faf8f5) y bordes sutiles.",
                previewBox: "bg-[#0e0e0d] border-[#262421] text-[#faf8f5]",
              },
              {
                id: "sistema" as const,
                title: "Sistema",
                sub: "Adaptativo",
                badge: "Automático SO",
                icon: <Laptop className="w-4 h-4 text-sky-400" />,
                desc: "Detecta automáticamente la preferencia de color del dispositivo del visitante (iOS, Android, macOS, Windows).",
                previewBox: "bg-linear-to-r from-[#faf8f5] via-slate-200 to-[#0e0e0d] border-slate-300 text-slate-900 font-bold",
              },
            ].map((scheme) => (
              <button
                key={scheme.id}
                type="button"
                onClick={() => update("colorScheme", scheme.id)}
                className={`p-4 text-left border rounded-md transition space-y-2.5 relative cursor-pointer ${
                  (headerConfig.colorScheme || "blanco") === scheme.id
                    ? "border-purple-600 bg-purple-50/40 ring-2 ring-purple-600/30"
                    : "border-slate-200 hover:border-slate-400 bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {scheme.icon}
                    <span className="text-xs font-bold text-slate-900">{scheme.title}</span>
                  </div>
                  {(headerConfig.colorScheme || "blanco") === scheme.id ? (
                    <span className="w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center text-[9px] font-bold">
                      ✓
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono text-slate-400 uppercase">{scheme.badge}</span>
                  )}
                </div>

                <div className={`h-7 rounded border flex items-center justify-between px-2.5 text-[10px] font-mono uppercase tracking-wider ${scheme.previewBox}`}>
                  <span>{scheme.sub}</span>
                  <span className="text-[9px] opacity-75">{scheme.badge}</span>
                </div>

                <p className="text-[11px] text-slate-500 leading-snug">
                  {scheme.desc}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* BLOQUE 1: Formato de Layout & Disposición */}
        <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Layout className="w-4 h-4 text-slate-700" />
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider font-mono">
              1. Formato del Menú (Escritorio)
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              {
                id: "classic" as const,
                title: "Clásico",
                desc: "Logo izq · Menú centro · Acciones der",
              },
              {
                id: "centered" as const,
                title: "Centrado",
                desc: "Logo centro · Navegación alineada",
              },
              {
                id: "split" as const,
                title: "Dividido",
                desc: "Logo izq · Enlaces y botones agrupados der",
              },
            ].map((layout) => (
              <button
                key={layout.id}
                onClick={() => update("layout", layout.id)}
                className={`p-3.5 text-left border rounded-md transition space-y-1.5 ${
                  headerConfig.layout === layout.id
                    ? "border-[#0284c7] bg-sky-50/50 ring-1 ring-[#0284c7]"
                    : "border-slate-200 hover:border-slate-400 bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{layout.title}</span>
                  {headerConfig.layout === layout.id && <Check className="w-3.5 h-3.5 text-[#0284c7]" />}
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">{layout.desc}</p>
              </button>
            ))}
          </div>

          {/* Alineación de Navegación & Jerarquía Espacial */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-700 font-bold">
                Alineación de Navegación & Jerarquía
              </label>
              <span className="text-[10px] font-mono text-slate-500 uppercase">
                {headerConfig.navAlignment || "center"}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  id: "center" as const,
                  title: "Centrado",
                  desc: "Logo izq · Enlaces centro · Acciones der",
                },
                {
                  id: "left" as const,
                  title: "Junto al Logo",
                  desc: "Enlaces pegados a la marca con aire seguro",
                },
                {
                  id: "right" as const,
                  title: "Junto a Botones",
                  desc: "Enlaces pegados al Portal Clínico y Cita",
                },
              ].map((align) => (
                <button
                  key={align.id}
                  type="button"
                  onClick={() => update("navAlignment", align.id)}
                  className={`p-3 text-left border rounded-md transition space-y-1 ${
                    (headerConfig.navAlignment || "center") === align.id
                      ? "border-sky-600 bg-sky-50/60 ring-1 ring-sky-600"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{align.title}</span>
                    {(headerConfig.navAlignment || "center") === align.id && (
                      <Check className="w-3.5 h-3.5 text-sky-600" />
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500">{align.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Menú Móvil & Burger */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-700 font-bold">
              Menú Móvil (Panel Desplegable)
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "fullscreen" as const, title: "Pantalla Completa", desc: "Cubre toda la vista con scroll" },
                { id: "drawer-right" as const, title: "Panel Derecho", desc: "Slide desde la derecha" },
                { id: "drawer-left" as const, title: "Panel Izquierdo", desc: "Slide desde la izquierda" },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => update("mobileMenuType", m.id)}
                  className={`p-3 text-left border rounded-md transition space-y-1 ${
                    headerConfig.mobileMenuType === m.id
                      ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="text-xs font-bold text-slate-900">{m.title}</div>
                  <div className="text-[10px] text-slate-500">{m.desc}</div>
                </button>
              ))}
            </div>

            {/* Burger en escritorio */}
            <div className="flex items-center justify-between p-3 rounded-md bg-slate-50 border border-slate-200">
              <div>
                <span className="text-xs font-medium text-slate-900 block">Burger también en escritorio</span>
                <span className="text-[11px] text-slate-500 font-light">
                  Oculta la barra de enlaces horizontal y muestra únicamente el icono hamburguesa
                </span>
              </div>
              <input
                type="checkbox"
                checked={headerConfig.burgerOnDesktop}
                onChange={(e) => update("burgerOnDesktop", e.target.checked)}
                className="w-4 h-4 text-[#0284c7] rounded border-slate-300 focus:ring-[#0284c7]"
              />
            </div>
          </div>
        </div>

        {/* BLOQUE 2: Dimensiones, Logo & Aire Vertical */}
        <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Sliders className="w-4 h-4 text-slate-700" />
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider font-mono">
              2. Altura de Cabecera y Tamaño de Logo
            </h3>
          </div>

          {/* Altura Escritorio */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-800">Altura de Cabecera en Escritorio</span>
              <span className="font-mono font-bold text-[#0284c7] bg-sky-50 px-2 py-0.5 rounded">
                {headerConfig.desktopHeight}px (Aire generoso)
              </span>
            </div>
            <input
              type="range"
              min="64"
              max="180"
              step="2"
              value={headerConfig.desktopHeight}
              onChange={(e) => update("desktopHeight", parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0284c7]"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>64px (Ajustada)</span>
              <span>84px (Recomendada)</span>
              <span>110px (Aire amplio)</span>
              <span>180px (Monumental)</span>
            </div>
          </div>

          {/* Tamaño del Logo */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-800">Tamaño del Logotipo BeHappy</span>
              <span className="font-mono font-bold text-[#059669] bg-emerald-50 px-2 py-0.5 rounded">
                {headerConfig.logoSize}px de diámetro
              </span>
            </div>
            <input
              type="range"
              min="36"
              max="160"
              step="2"
              value={headerConfig.logoSize}
              onChange={(e) => update("logoSize", parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#059669]"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>36px (Compacto)</span>
              <span>52px (Estándar)</span>
              <span>72px (Grande)</span>
              <span>110px (Destacado)</span>
              <span>160px (Máximo Premium)</span>
            </div>
          </div>

          {/* Mostrar texto institucional */}
          <div className="flex items-center justify-between p-3 rounded-md bg-slate-50 border border-slate-200">
            <div>
              <span className="text-xs font-medium text-slate-900 block">
                Mostrar nombre y sede junto al logo
              </span>
              <span className="text-[11px] text-slate-500 font-light">
                "Centro Dental BeHappy · Ñuñoa Suecia 3580"
              </span>
            </div>
            <input
              type="checkbox"
              checked={headerConfig.showBrandText}
              onChange={(e) => update("showBrandText", e.target.checked)}
              className="w-4 h-4 text-[#0284c7] rounded border-slate-300 focus:ring-[#0284c7]"
            />
          </div>

          {/* Sticky & Blur */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="flex items-center justify-between p-3 rounded-md bg-slate-50 border border-slate-200">
              <span className="text-xs font-medium text-slate-900">Cabecera fija (Sticky)</span>
              <input
                type="checkbox"
                checked={headerConfig.isSticky}
                onChange={(e) => update("isSticky", e.target.checked)}
                className="w-4 h-4 text-[#0284c7] rounded border-slate-300 focus:ring-[#0284c7]"
              />
            </div>
            <div className="flex items-center justify-between p-3 rounded-md bg-slate-50 border border-slate-200">
              <span className="text-xs font-medium text-slate-900">Desenfoque (Blur)</span>
              <input
                type="checkbox"
                checked={headerConfig.enableBlur}
                onChange={(e) => update("enableBlur", e.target.checked)}
                className="w-4 h-4 text-[#0284c7] rounded border-slate-300 focus:ring-[#0284c7]"
              />
            </div>
          </div>
        </div>

        {/* BLOQUE 3: Tipografía, Separación & Estilo de Enlaces */}
        <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Type className="w-4 h-4 text-slate-700" />
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider font-mono">
              3. Tipografía & Separación de Enlaces
            </h3>
          </div>

          {/* Separación entre botones */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-800">Separación horizontal entre enlaces</span>
              <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                {headerConfig.linksSpacing}px
              </span>
            </div>
            <input
              type="range"
              min="8"
              max="64"
              step="2"
              value={headerConfig.linksSpacing}
              onChange={(e) => update("linksSpacing", parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-800"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>8px (Compacto)</span>
              <span>24px (Equilibrado)</span>
              <span>40px (Espacioso)</span>
              <span>64px (Ultra aire)</span>
            </div>
          </div>

          {/* Tamaño de texto & Transformación */}
          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-700 font-bold mb-1.5">
                Tamaño de Texto
              </label>
              <select
                value={headerConfig.fontSize}
                onChange={(e) => update("fontSize", parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-mono rounded"
              >
                <option value={11}>11px (Fino)</option>
                <option value={12}>12px (Estándar recomendado)</option>
                <option value={13}>13px (Medio)</option>
                <option value={14}>14px (Grande)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-700 font-bold mb-1.5">
                Transformación
              </label>
              <select
                value={headerConfig.textTransform}
                onChange={(e) => update("textTransform", e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-mono rounded"
              >
                <option value="uppercase">MAYÚSCULAS</option>
                <option value="normal">Normal</option>
                <option value="capitalize">Capitalizar</option>
              </select>
            </div>
          </div>

          {/* Familia Tipográfica */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-700 font-bold">
              Tipografía del Menú
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "mono" as const, title: "Monoespaciada", sub: "Look técnico Geist Mono" },
                { id: "sans" as const, title: "Sans-Serif", sub: "Limpia y moderna" },
                { id: "serif" as const, title: "Display Editorial", sub: "Elegante Newsreader" },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => update("fontFamily", f.id)}
                  className={`p-2.5 text-left border rounded transition ${
                    headerConfig.fontFamily === f.id
                      ? "border-[#141413] bg-slate-50 font-bold ring-1 ring-[#141413]"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="text-xs text-slate-900">{f.title}</div>
                  <div className="text-[10px] text-slate-500 font-light">{f.sub}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* BLOQUE 4: Jerarquía de Botones & Explicitación Modo Demo */}
        <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider font-mono">
              4. Jerarquía de Botones & Modo Demo
            </h3>
          </div>

          {/* Switch Modo Demo en Nav */}
          <div className="p-4 rounded-md bg-amber-50/60 border border-amber-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-amber-950 block flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Explicitar Modo Demo en la barra de navegación</span>
                </span>
                <span className="text-[11px] text-amber-800 font-light">
                  Muestra un enlace distintivo hacia la suite de presentación (/demo)
                </span>
              </div>
              <input
                type="checkbox"
                checked={headerConfig.showDemoButton}
                onChange={(e) => update("showDemoButton", e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded border-amber-300 focus:ring-amber-500"
              />
            </div>

            {headerConfig.showDemoButton && (
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-amber-900 font-bold mb-1">
                  Texto del enlace Demo
                </label>
                <input
                  type="text"
                  value={headerConfig.demoButtonText}
                  onChange={(e) => update("demoButtonText", e.target.value)}
                  placeholder="ej: Demo OS (4 Roles)"
                  className="w-full px-3 py-1.5 bg-white border border-amber-200 text-xs font-mono rounded text-slate-900"
                />
              </div>
            )}
          </div>

          {/* Botones de Acción: Portal Clínico y Cita */}
          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-700 font-bold mb-1">
                Botón Portal Clínico (Modo Real / Acceso)
              </label>
              <input
                type="text"
                value={headerConfig.portalButtonText}
                onChange={(e) => update("portalButtonText", e.target.value)}
                placeholder="ej: Portal Clínico"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-mono rounded text-slate-900"
              />
              <span className="text-[10px] text-slate-500 block mt-1">
                Lleva directamente al acceso real y ficha médica del paciente o doctor.
              </span>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-700 font-bold mb-1">
                Botón Principal CTA (Reservar Cita)
              </label>
              <input
                type="text"
                value={headerConfig.bookingButtonText}
                onChange={(e) => update("bookingButtonText", e.target.value)}
                placeholder="ej: Reservar Cita"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-mono rounded text-slate-900"
              />
              <span className="text-[10px] text-slate-500 block mt-1">
                Desplaza al formulario de agendamiento online (#agendar).
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
