"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CMSHero, DEFAULT_HERO } from "@/lib/cmsStore";
import {
  Sparkles,
  Video,
  Image as ImageIcon,
  Sliders,
  Play,
  RotateCcw,
  Eye,
  CheckCircle2,
  Maximize2,
  Layers,
  VolumeX,
} from "lucide-react";
import { ImageUploadButton } from "./ImageUploadButton";

interface HeroEditorProps {
  hero: CMSHero;
  onUpdateHero: (updated: CMSHero) => void;
  presetImages: { label: string; path: string }[];
}

// Presets de videos clínicos optimizados para fondo en bucle
const CLINIC_VIDEO_PRESETS = [
  {
    label: "Atención Clínica & Box (HD)",
    path: "https://assets.mixkit.co/videos/preview/mixkit-dentist-examining-a-patient-41838-large.mp4",
    poster: "/images/clinic-interior.jpg",
  },
  {
    label: "Instrumental Odontológico & Precisión",
    path: "https://assets.mixkit.co/videos/preview/mixkit-dentist-preparing-the-tools-41842-large.mp4",
    poster: "/images/treatments_real/revision.jpg",
  },
  {
    label: "Paciente & Sonrisa Extraordinaria",
    path: "https://assets.mixkit.co/videos/preview/mixkit-woman-smiling-at-a-dental-clinic-41844-large.mp4",
    poster: "/images/hero-woman.jpg",
  },
];

export function HeroEditor({ hero, onUpdateHero, presetImages }: HeroEditorProps) {
  const current = hero || DEFAULT_HERO;
  const isVideo = current.mediaType === "video";
  const [previewTab, setPreviewTab] = useState<"desktop" | "mobile">("desktop");

  const handleChange = (field: keyof CMSHero, value: any) => {
    onUpdateHero({ ...current, [field]: value });
  };

  const overlayOpacity = typeof current.overlayOpacity === "number" ? current.overlayOpacity : 65;

  return (
    <div className="space-y-6">
      
      {/* 1. VISTA PREVIA INTERACTIVA EN TIEMPO REAL */}
      <div className="bg-neutral-950 text-white rounded-xl border border-neutral-800 p-5 shadow-lg overflow-hidden space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-400 text-[11px] font-mono rounded">
              <Eye className="w-3.5 h-3.5" />
              <span>VISTA PREVIA EN VIVO (HERO)</span>
            </span>
            <span className="text-xs text-neutral-400 font-light hidden sm:inline">
              Los cambios de opacidad, video y textos se reflejan al instante
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPreviewTab("desktop")}
              className={`px-2.5 py-1 text-[11px] font-mono rounded transition ${
                previewTab === "desktop"
                  ? "bg-neutral-800 text-white border border-neutral-700"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              Desktop
            </button>
            <button
              type="button"
              onClick={() => setPreviewTab("mobile")}
              className={`px-2.5 py-1 text-[11px] font-mono rounded transition ${
                previewTab === "mobile"
                  ? "bg-neutral-800 text-white border border-neutral-700"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              Móvil
            </button>
          </div>
        </div>

        {/* Simulador de Pantalla del Hero */}
        <div className="flex justify-center">
          <div
            className={`relative rounded-lg overflow-hidden border border-neutral-800 transition-all duration-300 ${
              previewTab === "desktop" ? "w-full aspect-[21/9] max-h-[340px]" : "w-[300px] aspect-[9/16] max-h-[440px]"
            }`}
          >
            {/* Fondo multimedia en el simulador */}
            {isVideo && current.bgVideo ? (
              <video
                key={current.bgVideo}
                autoPlay
                loop
                muted
                playsInline
                poster={current.videoPoster || current.bgImage}
                className={`w-full h-full object-cover ${
                  current.focalPoint === "top"
                    ? "object-top"
                    : current.focalPoint === "bottom"
                    ? "object-bottom"
                    : "object-center"
                } ${current.blurBackground ? "filter blur-xs" : ""}`}
              >
                <source src={current.bgVideo} type="video/mp4" />
              </video>
            ) : (
              <div className="relative w-full h-full">
                <Image
                  src={current.bgImage || "/images/hero-woman.jpg"}
                  alt="Vista previa fondo"
                  fill
                  className={`object-cover ${
                    current.focalPoint === "top"
                      ? "object-top"
                      : current.focalPoint === "bottom"
                      ? "object-bottom"
                      : "object-center"
                  } ${current.blurBackground ? "filter blur-xs" : ""}`}
                />
              </div>
            )}

            {/* Capa de Opacidad en Vivo */}
            <div
              className={`absolute inset-0 transition-opacity ${
                current.overlayColor === "navy"
                  ? "bg-[#09111e]"
                  : current.overlayColor === "warm"
                  ? "bg-[#18120b]"
                  : "bg-black"
              }`}
              style={{ opacity: overlayOpacity / 100 }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/85 pointer-events-none" />

            {/* Contenido en Vivo sobre la Portada */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 z-10 space-y-2 pointer-events-none">
              <span className="text-[10px] sm:text-xs font-light text-neutral-300 tracking-wider">
                {current.welcomeKicker || "Bienvenidos a"}
              </span>
              <h4 className="text-sm sm:text-xl md:text-2xl font-bold tracking-tight text-white drop-shadow">
                {current.title || "Centro Dental BeHappy"}
              </h4>
              <p className="text-[10px] sm:text-xs text-neutral-200 line-clamp-2 max-w-md font-light">
                {current.subtitle || "Centro dental en Ñuñoa con la última tecnología y tratamientos."}
              </p>
              <div className="pt-2 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-black/80 border border-white/80 text-[10px] font-medium text-white shadow">
                  {current.primaryCtaText || "Reserva aquí"}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/30 text-[9px] font-mono text-neutral-300">
                  {current.secondaryCtaText || "Agendar →"}
                </span>
              </div>
            </div>

            {/* Indicador de formato en esquina */}
            <div className="absolute bottom-2 right-2 z-20 bg-black/70 backdrop-blur-sm border border-neutral-700 px-2 py-0.5 rounded text-[9px] font-mono text-neutral-300 flex items-center gap-1.5">
              {isVideo ? <Video className="w-3 h-3 text-purple-400" /> : <ImageIcon className="w-3 h-3 text-teal-400" />}
              <span>{isVideo ? "Video de Fondo Activo" : "Imagen de Fondo Activa"}</span>
              <span>· {overlayOpacity}% Oscuridad</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SELECTOR PRINCIPAL: ¿IMAGEN O VIDEO? */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-xs">
        <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Multimedia del Hero (Fondo Principal)</span>
            </h3>
            <p className="text-xs text-slate-500 font-light mt-0.5">
              Escoge entre video cinemático en bucle o fotografía de alta resolución.
            </p>
          </div>

          {/* Toggle Segmentado: Foto vs Video */}
          <div className="inline-flex p-1 bg-slate-100 border border-slate-200 rounded-lg">
            <button
              type="button"
              onClick={() => handleChange("mediaType", "image")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition ${
                !isVideo
                  ? "bg-white text-slate-900 shadow-xs border border-slate-200 font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 text-teal-600" />
              <span>📷 Imagen de Fondo</span>
            </button>

            <button
              type="button"
              onClick={() => handleChange("mediaType", "video")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition ${
                isVideo
                  ? "bg-purple-600 text-white shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>🎬 Video de Fondo (Loop)</span>
            </button>
          </div>
        </div>

        {/* PANEL: CONFIGURACIÓN DE VIDEO */}
        {isVideo && (
          <div className="space-y-4 p-4 bg-purple-50/50 border border-purple-200/60 rounded-lg animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-bold text-purple-950 uppercase tracking-wider font-mono">
                  Configuración del Video de Portada
                </span>
              </div>
              <span className="text-[10px] font-mono text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                Reproducción automática silenciosa
              </span>
            </div>

            {/* Input URL del Video */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-700 font-bold mb-1.5">
                Ruta o URL Directa del Video (.mp4 / .webm / enlace CDN)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={current.bgVideo || ""}
                  onChange={(e) => handleChange("bgVideo", e.target.value)}
                  placeholder="https://.../video.mp4"
                  className="flex-1 px-3 py-2 bg-white border border-slate-300 text-slate-900 text-xs font-mono rounded focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none transition"
                />
                <ImageUploadButton
                  allowVideo
                  label="Subir video a la nube"
                  onUploaded={(url) => handleChange("bgVideo", url)}
                />
              </div>
              <p className="text-[11px] text-slate-500 font-light mt-1">
                Puedes ingresar cualquier enlace público MP4 o subir tu propio video corporativo (hasta 25 MB).
              </p>
            </div>

            {/* Presets Oficiales de Video */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-mono text-slate-700 font-bold block">
                Presets de Video Clínico Recomendados:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {CLINIC_VIDEO_PRESETS.map((vp, idx) => {
                  const isSelected = current.bgVideo === vp.path;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        handleChange("bgVideo", vp.path);
                        if (vp.poster) handleChange("videoPoster", vp.poster);
                      }}
                      className={`text-left p-2.5 rounded-lg border text-xs transition ${
                        isSelected
                          ? "bg-purple-100 border-purple-400 text-purple-950 font-semibold ring-1 ring-purple-400"
                          : "bg-white border-slate-200 hover:border-purple-300 hover:bg-purple-50 text-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium truncate">{vp.label}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />}
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono mt-0.5 block truncate">
                        Loop HD optimizado
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Poster de Carga y Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-purple-200/50">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-700 font-bold mb-1.5">
                  Poster de Carga (Imagen previa mientras inicia el video)
                </label>
                <input
                  type="text"
                  value={current.videoPoster || current.bgImage || "/images/hero-woman.jpg"}
                  onChange={(e) => handleChange("videoPoster", e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 text-slate-900 text-xs font-mono rounded outline-none focus:border-purple-600"
                />
              </div>

              <div className="flex items-center gap-6 pt-5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={current.videoLoop ?? true}
                    onChange={(e) => handleChange("videoLoop", e.target.checked)}
                    className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 w-4 h-4"
                  />
                  <span className="text-xs text-slate-800 font-medium">Bucle infinito (Loop)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={current.videoMuted ?? true}
                    onChange={(e) => handleChange("videoMuted", e.target.checked)}
                    className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 w-4 h-4"
                  />
                  <span className="text-xs text-slate-800 font-medium flex items-center gap-1">
                    <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                    Silenciado
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* PANEL: CONFIGURACIÓN DE IMAGEN */}
        {!isVideo && (
          <div className="space-y-4 p-4 bg-teal-50/40 border border-teal-200/60 rounded-lg animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-teal-600" />
                <span className="text-xs font-bold text-teal-950 uppercase tracking-wider font-mono">
                  Fotografía de Fondo del Hero
                </span>
              </div>
              <span className="text-[10px] font-mono text-teal-700 bg-teal-100 px-2 py-0.5 rounded">
                Optimización Next.js AVIF/WebP
              </span>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-700 font-bold mb-1.5">
                Ruta Local o URL de la Imagen
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={current.bgImage || "/images/hero-woman.jpg"}
                  onChange={(e) => handleChange("bgImage", e.target.value)}
                  placeholder="/images/hero-woman.jpg"
                  className="flex-1 px-3 py-2 bg-white border border-slate-300 text-slate-900 text-xs font-mono rounded focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-none transition"
                />
                <ImageUploadButton
                  label="Subir foto a la nube"
                  onUploaded={(url) => handleChange("bgImage", url)}
                />
              </div>
            </div>

            {/* Presets Oficiales de Imagen */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-mono text-slate-700 font-bold block">
                Presets Oficiales Centro Dental BeHappy:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {presetImages.map((img, i) => {
                  const isSelected = current.bgImage === img.path;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleChange("bgImage", img.path)}
                      className={`text-[11px] font-mono px-3 py-1.5 border rounded-md transition ${
                        isSelected
                          ? "bg-teal-600 text-white border-teal-600 font-bold"
                          : "bg-white border-slate-200 hover:border-teal-400 hover:bg-teal-50 text-slate-700"
                      }`}
                    >
                      {img.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 3. CONTROLES VISUALES A PROFUNDIDAD (OVERLAY, TONALIDAD, ENCUADRE, ALTURA) */}
        <div className="border-t border-slate-100 pt-5 space-y-5">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-slate-700" />
            <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-slate-800">
              Controles Visuales a Profundidad
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Control 1: Opacidad del Overlay Oscuro */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">
                  Oscuridad del Fondo
                </label>
                <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  {overlayOpacity}%
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="95"
                step="5"
                value={overlayOpacity}
                onChange={(e) => handleChange("overlayOpacity", Number(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer"
              />
              <p className="text-[10px] text-slate-500 font-light leading-tight">
                Evita que fondos claros dificulten la lectura de los textos blancos.
              </p>
            </div>

            {/* Control 2: Tonalidad del Filtro */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Tonalidad del Filtro
              </label>
              <select
                value={current.overlayColor || "black"}
                onChange={(e) => handleChange("overlayColor", e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 text-xs rounded outline-none font-medium text-slate-800"
              >
                <option value="black">Negro Cinematográfico (Neutro)</option>
                <option value="navy">Azul Quirúrgico / Slate</option>
                <option value="warm">Cálido Editorial BeHappy</option>
              </select>
              <p className="text-[10px] text-slate-500 font-light leading-tight">
                Aporta coherencia cromática a cualquier foto o video.
              </p>
            </div>

            {/* Control 3: Punto Focal de Encuadre */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Punto Focal (Encuadre)
              </label>
              <select
                value={current.focalPoint || "center"}
                onChange={(e) => handleChange("focalPoint", e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 text-xs rounded outline-none font-medium text-slate-800"
              >
                <option value="center">Centro (Equilibrado)</option>
                <option value="top">Superior (Rostros)</option>
                <option value="bottom">Inferior (Sonrisas / Manos)</option>
              </select>
              <p className="text-[10px] text-slate-500 font-light leading-tight">
                Define el recorte óptico en pantallas móviles y panorámicas.
              </p>
            </div>

            {/* Control 4: Altura del Hero */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Altura de la Portada
              </label>
              <select
                value={current.heroHeight || "default"}
                onChange={(e) => handleChange("heroHeight", e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 text-xs rounded outline-none font-medium text-slate-800"
              >
                <option value="compact">Compacta (600px)</option>
                <option value="default">Estándar (700px)</option>
                <option value="tall">Amplia (820px)</option>
                <option value="fullscreen">Pantalla Completa (100vh)</option>
              </select>
              <p className="text-[10px] text-slate-500 font-light leading-tight">
                Espacio vertical que ocupa la portada al entrar al sitio.
              </p>
            </div>

          </div>

          {/* Efecto de Desenfoque Suave */}
          <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                Desenfoque Suave de Fondo (Soft Blur)
              </span>
              <span className="text-[11px] text-slate-500 font-light">
                Aplica un leve difuminado al fondo multimedia para máxima nitidez tipográfica en pantallas de alta densidad.
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={current.blurBackground ?? false}
                onChange={(e) => handleChange("blurBackground", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>

        {/* 4. TEXTOS Y LLAMADOS A LA ACCIÓN (H1, SUBTÍTULO, BOTONES) */}
        <div className="border-t border-slate-100 pt-5 space-y-4">
          <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-slate-800">
            Contenidos y Botones de Conversión
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-700 font-bold mb-1.5">
                Saludo inicial (Kicker)
              </label>
              <input
                type="text"
                value={current.welcomeKicker || "Bienvenidos a"}
                onChange={(e) => handleChange("welcomeKicker", e.target.value)}
                placeholder="Bienvenidos a"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono rounded focus:bg-white focus:border-slate-800 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-700 font-bold mb-1.5">
                Badge de Estado en Vivo (Urgencias / Horario)
              </label>
              <input
                type="text"
                value={current.statusBadge || "Abierto Hoy · Box Suecia 3580"}
                onChange={(e) => handleChange("statusBadge", e.target.value)}
                placeholder="Abierto Hoy · Box Suecia 3580"
                className="w-full px-3 py-2 bg-emerald-50/60 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold rounded focus:bg-white focus:border-emerald-600 outline-none transition"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-700 font-bold mb-1.5">
                Título Oficial de la Clínica (H1)
              </label>
              <input
                type="text"
                value={current.title || "Centro Dental BeHappy"}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Centro Dental BeHappy"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 text-base font-bold rounded focus:bg-white focus:border-slate-800 outline-none transition"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-700 font-bold mb-1.5">
                Descripción / Bajada Principal
              </label>
              <textarea
                rows={2}
                value={current.subtitle || ""}
                onChange={(e) => handleChange("subtitle", e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 text-xs leading-relaxed rounded focus:bg-white focus:border-slate-800 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-700 font-bold mb-1.5">
                Texto Botón Principal (CTA 1)
              </label>
              <input
                type="text"
                value={current.primaryCtaText || "Reserva aquí"}
                onChange={(e) => handleChange("primaryCtaText", e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded focus:bg-white focus:border-slate-800 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-700 font-bold mb-1.5">
                Enlace Botón Principal (WhatsApp o URL)
              </label>
              <input
                type="text"
                value={current.primaryCtaUrl || ""}
                onChange={(e) => handleChange("primaryCtaUrl", e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono rounded focus:bg-white focus:border-slate-800 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-700 font-bold mb-1.5">
                Texto Botón Secundario (CTA 2)
              </label>
              <input
                type="text"
                value={current.secondaryCtaText || "Agendar con agendador →"}
                onChange={(e) => handleChange("secondaryCtaText", e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded focus:bg-white focus:border-slate-800 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-700 font-bold mb-1.5">
                Destino Botón Secundario
              </label>
              <input
                type="text"
                value={current.secondaryCtaUrl || "#agendar"}
                onChange={(e) => handleChange("secondaryCtaUrl", e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono rounded focus:bg-white focus:border-slate-800 outline-none transition"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
