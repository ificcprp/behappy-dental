"use client";

import React from "react";
import Image from "next/image";
import { CMSHero, DEFAULT_HERO } from "@/lib/cmsStore";
import { Sparkles, Image as ImageIcon, CheckCircle, Clock } from "lucide-react";

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
    <div className="border border-[#222228] bg-[#121216] p-6 space-y-6">
      <div className="border-b border-[#222228] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-normal text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Portada Principal (Hero Banner)</span>
          </h3>
          <p className="text-xs text-neutral-400 font-light mt-0.5">
            Encabezado principal visible al ingresar a behappydental.cl
          </p>
        </div>
        <span className="text-[10px] font-mono text-purple-400 border border-purple-800/60 bg-purple-950/30 px-2.5 py-1 self-start sm:self-auto">
          SECCIÓN 1 · HIGH IMPACT
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
            Saludo inicial (Kicker)
          </label>
          <input
            type="text"
            value={current.welcomeKicker || "Bienvenidos a"}
            onChange={(e) => handleChange("welcomeKicker", e.target.value)}
            placeholder="Bienvenidos a"
            className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono focus:border-purple-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
            Badge de Estado en Vivo (Urgencias / Horario)
          </label>
          <input
            type="text"
            value={current.statusBadge || "Abierto Hoy · Box Suecia 3580"}
            onChange={(e) => handleChange("statusBadge", e.target.value)}
            placeholder="Abierto Hoy · Box Suecia 3580"
            className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-emerald-400 text-xs font-mono focus:border-purple-500 outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
            Título Oficial de la Clínica (H1)
          </label>
          <input
            type="text"
            value={current.title || "Centro Dental BeHappy"}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Centro Dental BeHappy"
            className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-base font-bold focus:border-purple-500 outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
            Descripción / Bajada Principal
          </label>
          <textarea
            rows={2}
            value={current.subtitle || ""}
            onChange={(e) => handleChange("subtitle", e.target.value)}
            className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs leading-relaxed focus:border-purple-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
            Texto Botón Principal (CTA 1)
          </label>
          <input
            type="text"
            value={current.primaryCtaText || "Reserva aquí"}
            onChange={(e) => handleChange("primaryCtaText", e.target.value)}
            className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
            Enlace Botón Principal (WhatsApp o URL)
          </label>
          <input
            type="text"
            value={current.primaryCtaUrl || ""}
            onChange={(e) => handleChange("primaryCtaUrl", e.target.value)}
            className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
            Texto Botón Secundario (CTA 2)
          </label>
          <input
            type="text"
            value={current.secondaryCtaText || "Agendar con agendador →"}
            onChange={(e) => handleChange("secondaryCtaText", e.target.value)}
            className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
            Destino Botón Secundario
          </label>
          <input
            type="text"
            value={current.secondaryCtaUrl || "#agendar"}
            onChange={(e) => handleChange("secondaryCtaUrl", e.target.value)}
            className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono"
          />
        </div>

        {/* Photo with Live Preview & Presets */}
        <div className="md:col-span-2 space-y-2 pt-2 border-t border-[#222228]">
          <label className="block text-[11px] font-mono text-neutral-400 uppercase">
            Ruta o URL Imagen de Fondo del Hero
          </label>
          <div className="flex gap-3 items-center">
            <input
              type="text"
              value={current.bgImage || "/images/hero-woman.jpg"}
              onChange={(e) => handleChange("bgImage", e.target.value)}
              className="flex-1 px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono"
            />
            <div className="relative w-24 h-14 border border-[#2b2b34] bg-neutral-900 overflow-hidden shrink-0">
              <Image
                src={current.bgImage || "/images/hero-woman.jpg"}
                alt="Preview Hero"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="text-[10px] font-mono text-neutral-500 mr-1 self-center">
              Presets Oficiales:
            </span>
            {presetImages.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleChange("bgImage", img.path)}
                className="text-[10px] font-mono px-2.5 py-1 border border-neutral-800 bg-neutral-900 hover:border-purple-400 text-neutral-300 transition"
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
