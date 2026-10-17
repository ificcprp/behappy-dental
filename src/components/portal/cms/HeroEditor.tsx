"use client";

import React from "react";
import Image from "next/image";
import { CMSHero, DEFAULT_HERO } from "@/lib/cmsStore";
import { Sparkles, Image as ImageIcon } from "lucide-react";

interface HeroEditorProps {
  hero: CMSHero;
  onUpdateHero: (updated: CMSHero) => void;
  presetImages: { label: string; path: string }[];
}

export function HeroEditor({ hero, onUpdateHero, presetImages }: HeroEditorProps) {
  const current = hero || DEFAULT_HERO;

  const handleChange = (field: keyof CMSHero, value: any) => {
    onUpdateHero({ ...current, [field]: value });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6 shadow-xs">
      {/* Header of Section */}
      <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>Portada Principal (Hero Banner)</span>
          </h3>
          <p className="text-xs text-slate-500 font-light mt-0.5">
            Encabezado principal visible al ingresar a behappydental.cl
          </p>
        </div>
        <span className="text-[10px] font-mono font-bold text-purple-700 border border-purple-200 bg-purple-50 px-2.5 py-1 rounded self-start sm:self-auto uppercase">
          Sección 1 · Alto Impacto
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

        {/* Photo with Live Preview & Presets */}
        <div className="md:col-span-2 space-y-3 pt-4 border-t border-slate-100">
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-700 font-bold">
            Ruta o URL Imagen de Fondo del Hero
          </label>
          <div className="flex gap-3 items-center">
            <input
              type="text"
              value={current.bgImage || "/images/hero-woman.jpg"}
              onChange={(e) => handleChange("bgImage", e.target.value)}
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono rounded focus:bg-white focus:border-slate-800 outline-none transition"
            />
            <div className="relative w-24 h-14 border border-slate-200 bg-slate-100 rounded overflow-hidden shrink-0 shadow-2xs">
              <Image
                src={current.bgImage || "/images/hero-woman.jpg"}
                alt="Preview Hero"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[10px] font-mono text-slate-500 mr-1">
              Presets Oficiales:
            </span>
            {presetImages.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleChange("bgImage", img.path)}
                className="text-[10px] font-mono px-2.5 py-1 border border-slate-200 bg-slate-50 hover:border-purple-400 hover:bg-purple-50 text-slate-700 rounded transition"
              >
                {img.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
