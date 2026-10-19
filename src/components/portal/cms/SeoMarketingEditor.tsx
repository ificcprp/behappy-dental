"use client";

import React from "react";
import Image from "next/image";
import { CMSSeoMarketing, DEFAULT_SEO_MARKETING } from "@/lib/cmsStore";
import { Globe, Share2, BarChart2, Eye, RefreshCw, Sparkles, Image as ImageIcon } from "lucide-react";

interface SeoMarketingEditorProps {
  seoMarketing: CMSSeoMarketing;
  onUpdateSeoMarketing: (updated: CMSSeoMarketing) => void;
  presetImages: { label: string; path: string }[];
  triggerToast?: (msg: string) => void;
}

export function SeoMarketingEditor({
  seoMarketing,
  onUpdateSeoMarketing,
  presetImages,
  triggerToast,
}: SeoMarketingEditorProps) {
  const current = seoMarketing || DEFAULT_SEO_MARKETING;

  const handleChange = <K extends keyof CMSSeoMarketing>(field: K, value: CMSSeoMarketing[K]) => {
    onUpdateSeoMarketing({
      ...current,
      [field]: value,
    });
  };

  const handleResetDefaults = () => {
    if (confirm("¿Deseas restablecer los parámetros de SEO y Marketing a los valores originales?")) {
      onUpdateSeoMarketing(DEFAULT_SEO_MARKETING);
      if (triggerToast) triggerToast("✓ Metadatos de SEO y Marketing restablecidos");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="border border-[#222228] bg-[#121216] p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="text-base font-normal text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-purple-400" />
            <span>SEO, Previsualización Social (OpenGraph) & Píxeles de Conversión</span>
          </h3>
          <p className="text-xs text-neutral-400 font-light mt-0.5">
            Optimiza la presencia en Google, la tarjeta que se visualiza al compartir el link por WhatsApp y los píxeles de analítica publicitaria.
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
        {/* Left Form (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Section 1: Google SEO */}
          <div className="border border-[#222228] bg-[#121216] p-5 space-y-4">
            <h4 className="text-xs font-mono text-purple-400 uppercase tracking-wider flex items-center gap-2 border-b border-[#222228] pb-2">
              <Globe className="w-3.5 h-3.5" />
              <span>1. Posicionamiento en Google (SEO Meta Tags)</span>
            </h4>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                  Meta Title (Título en Google)
                </label>
                <input
                  type="text"
                  value={current.metaTitle}
                  onChange={(e) => handleChange("metaTitle", e.target.value)}
                  placeholder="Centro Dental BeHappy Ñuñoa | Odontología Avanzada"
                  className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs focus:border-purple-500 outline-none"
                />
                <span className="text-[10px] text-neutral-500 font-mono mt-1 block">
                  Recomendado: 50 a 65 caracteres ({current.metaTitle.length} caracteres)
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                  Meta Description (Resumen en resultados de búsqueda)
                </label>
                <textarea
                  rows={3}
                  value={current.metaDescription}
                  onChange={(e) => handleChange("metaDescription", e.target.value)}
                  placeholder="Describe la clínica, especialidades y valor diferencial..."
                  className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs focus:border-purple-500 outline-none resize-none"
                />
                <span className="text-[10px] text-neutral-500 font-mono mt-1 block">
                  Recomendado: 120 a 160 caracteres ({current.metaDescription.length} caracteres)
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                  Palabras Clave (Separadas por comas)
                </label>
                <input
                  type="text"
                  value={Array.isArray(current.keywords) ? current.keywords.join(", ") : current.keywords}
                  onChange={(e) =>
                    handleChange(
                      "keywords",
                      e.target.value.split(",").map((k) => k.trim()).filter(Boolean)
                    )
                  }
                  placeholder="dentista ñuñoa, invisalign santiago, implantes dentales"
                  className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono focus:border-purple-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Open Graph / WhatsApp Card */}
          <div className="border border-[#222228] bg-[#121216] p-5 space-y-4">
            <h4 className="text-xs font-mono text-purple-400 uppercase tracking-wider flex items-center gap-2 border-b border-[#222228] pb-2">
              <Share2 className="w-3.5 h-3.5" />
              <span>2. Tarjeta al Compartir en Redes & WhatsApp (OpenGraph)</span>
            </h4>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                  Título Social (OG Title)
                </label>
                <input
                  type="text"
                  value={current.ogTitle}
                  onChange={(e) => handleChange("ogTitle", e.target.value)}
                  placeholder="Centro Dental BeHappy Ñuñoa · Clínica Odontológica de Excelencia"
                  className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs focus:border-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                  Descripción Social (OG Description)
                </label>
                <input
                  type="text"
                  value={current.ogDescription}
                  onChange={(e) => handleChange("ogDescription", e.target.value)}
                  placeholder="Reserva tu hora online con nuestros especialistas acreditados..."
                  className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs focus:border-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                  Imagen de Previsualización (OG Image)
                </label>
                <input
                  type="text"
                  value={current.ogImage}
                  onChange={(e) => handleChange("ogImage", e.target.value)}
                  placeholder="/images/hero-woman.jpg"
                  className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono focus:border-purple-500 outline-none"
                />

                {/* Presets selector */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {presetImages.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleChange("ogImage", img.path)}
                      className={`text-[10px] font-mono px-2 py-1 rounded-xs border transition ${
                        current.ogImage === img.path
                          ? "bg-purple-950/40 border-purple-500 text-purple-300"
                          : "bg-[#18181f] border-[#2b2b34] text-neutral-400 hover:text-white"
                      }`}
                    >
                      {img.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Píxeles de Analítica */}
          <div className="border border-[#222228] bg-[#121216] p-5 space-y-4">
            <h4 className="text-xs font-mono text-purple-400 uppercase tracking-wider flex items-center gap-2 border-b border-[#222228] pb-2">
              <BarChart2 className="w-3.5 h-3.5" />
              <span>3. Píxeles de Conversión & Analítica Publicitaria</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                  Google Analytics 4 Measurement ID
                </label>
                <input
                  type="text"
                  value={current.googleAnalyticsId}
                  onChange={(e) => handleChange("googleAnalyticsId", e.target.value.trim())}
                  placeholder="G-XXXXXXXXXX"
                  className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono focus:border-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                  Meta Pixel ID (Facebook / Instagram Ads)
                </label>
                <input
                  type="text"
                  value={current.metaPixelId}
                  onChange={(e) => handleChange("metaPixelId", e.target.value.trim())}
                  placeholder="1353498186525546"
                  className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono focus:border-purple-500 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Live Previews (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Preview Google */}
          <div className="border border-[#222228] bg-[#121216] p-4 space-y-3 rounded-xs">
            <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider flex items-center gap-2">
              <Eye className="w-3.5 h-3.5 text-blue-400" />
              <span>Previsualización en Google</span>
            </div>

            <div className="p-4 bg-white text-black rounded border border-neutral-200 space-y-1">
              <div className="text-[11px] text-[#202124] flex items-center gap-1 font-sans">
                <span className="text-[#1a0dab] font-medium">behappydental.cl</span>
                <span className="text-neutral-400">›</span>
              </div>
              <h5 className="text-base text-[#1a0dab] hover:underline cursor-pointer font-sans leading-snug line-clamp-2">
                {current.metaTitle || "Centro Dental BeHappy"}
              </h5>
              <p className="text-xs text-[#4d5156] font-sans leading-relaxed line-clamp-2">
                {current.metaDescription || "Descripción del centro odontológico en Ñuñoa..."}
              </p>
            </div>
          </div>

          {/* Preview WhatsApp Card */}
          <div className="border border-[#222228] bg-[#121216] p-4 space-y-3 rounded-xs">
            <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider flex items-center gap-2">
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              <span>Previsualización al compartir en WhatsApp</span>
            </div>

            <div className="bg-[#0b141a] p-3 rounded-lg border border-[#222e35] max-w-sm mx-auto">
              <div className="bg-[#202c33] rounded-md overflow-hidden text-neutral-200 text-xs">
                <div className="relative w-full h-32 bg-neutral-800">
                  <Image
                    src={current.ogImage || "/images/hero-woman.jpg"}
                    alt="Vista previa"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-2.5 space-y-1">
                  <div className="text-[10px] text-neutral-400 font-mono uppercase">behappydental.cl</div>
                  <div className="font-bold text-white text-xs line-clamp-1">{current.ogTitle}</div>
                  <div className="text-[11px] text-neutral-300 line-clamp-2">{current.ogDescription}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
