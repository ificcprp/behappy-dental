"use client";

import React from "react";
import Image from "next/image";
import {
  CMSWelcomeSection,
  DEFAULT_WELCOME_SECTION,
  CMSWelcomeCard,
} from "@/lib/cmsStore";
import { Layers, MessageCircle, Building } from "lucide-react";

interface PilaresEditorProps {
  welcomeSection: CMSWelcomeSection;
  onUpdateWelcomeSection: (updated: CMSWelcomeSection) => void;
  presetImages: { label: string; path: string }[];
}

export function PilaresEditor({
  welcomeSection,
  onUpdateWelcomeSection,
  presetImages,
}: PilaresEditorProps) {
  const current = welcomeSection || DEFAULT_WELCOME_SECTION;

  const handleHeaderChange = (field: keyof CMSWelcomeSection, value: any) => {
    onUpdateWelcomeSection({ ...current, [field]: value });
  };

  const handleCardChange = (idx: number, field: keyof CMSWelcomeCard, value: string) => {
    const cards = [...(current.cards || DEFAULT_WELCOME_SECTION.cards)];
    cards[idx] = { ...cards[idx], [field]: value };
    onUpdateWelcomeSection({ ...current, cards });
  };

  const handleNewPatientChange = (field: string, value: string) => {
    const newPatient = {
      ...(current.newPatient || DEFAULT_WELCOME_SECTION.newPatient),
      [field]: value,
    };
    onUpdateWelcomeSection({ ...current, newPatient });
  };

  return (
    <div className="space-y-6">
      {/* Header of Section */}
      <div className="border border-[#222228] bg-[#121216] p-6 space-y-4">
        <div className="border-b border-[#222228] pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-base font-normal text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal-400" />
              <span>4 Pilares Institucionales & Accesos Rápidos</span>
            </h3>
            <p className="text-xs text-neutral-400 font-light mt-0.5">
              Las 4 tarjetas principales bajo la portada que guían a pacientes hacia cómo llegar, membresía, catálogo y especialistas.
            </p>
          </div>
          <span className="text-[10px] font-mono text-teal-400 border border-teal-800/60 bg-teal-950/30 px-2.5 py-1">
            SECCIÓN 2
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
              Kicker de Sección
            </label>
            <input
              type="text"
              value={current.kicker || DEFAULT_WELCOME_SECTION.kicker}
              onChange={(e) => handleHeaderChange("kicker", e.target.value)}
              className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
              Título de Sección
            </label>
            <input
              type="text"
              value={current.title || DEFAULT_WELCOME_SECTION.title}
              onChange={(e) => handleHeaderChange("title", e.target.value)}
              className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-bold"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
              Bajada Explicativa
            </label>
            <textarea
              rows={2}
              value={current.subtitle || DEFAULT_WELCOME_SECTION.subtitle}
              onChange={(e) => handleHeaderChange("subtitle", e.target.value)}
              className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs"
            />
          </div>
        </div>
      </div>

      {/* Cards Editor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(current.cards || DEFAULT_WELCOME_SECTION.cards).map((card, idx) => (
          <div key={card.id || idx} className="border border-[#222228] bg-[#121216] p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-[#222228] pb-2">
              <span className="text-[11px] font-mono font-bold text-teal-400">
                TARJETA {card.number} · {card.tag}
              </span>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-neutral-400 uppercase mb-1">
                Título
              </label>
              <input
                type="text"
                value={card.title}
                onChange={(e) => handleCardChange(idx, "title", e.target.value)}
                className="w-full px-3 py-1.5 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-neutral-400 uppercase mb-1">
                Descripción
              </label>
              <textarea
                rows={2}
                value={card.description}
                onChange={(e) => handleCardChange(idx, "description", e.target.value)}
                className="w-full px-3 py-1.5 bg-[#18181f] border border-[#2b2b34] text-white text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-mono text-neutral-400 uppercase mb-1">
                  Texto Enlace
                </label>
                <input
                  type="text"
                  value={card.linkText}
                  onChange={(e) => handleCardChange(idx, "linkText", e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#18181f] border border-[#2b2b34] text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-neutral-400 uppercase mb-1">
                  Destino Enlace
                </label>
                <input
                  type="text"
                  value={card.linkUrl}
                  onChange={(e) => handleCardChange(idx, "linkUrl", e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Patient Section Box */}
      <div className="border border-[#222228] bg-[#121216] p-6 space-y-4">
        <div className="border-b border-[#222228] pb-3">
          <span className="text-[10px] font-mono uppercase text-teal-400 font-bold block">
            MÓDULO DE ADMISIÓN: &quot;¿NUEVO COMO PACIENTE? CONTÁCTENOS HOY MISMO&quot;
          </span>
          <p className="text-xs text-neutral-400 font-light mt-0.5">
            Bloque con la fotografía del box clínico de Suecia 3580 e invitación de contacto directo por WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
              Título
            </label>
            <textarea
              rows={2}
              value={current.newPatient?.title || DEFAULT_WELCOME_SECTION.newPatient.title}
              onChange={(e) => handleNewPatientChange("title", e.target.value)}
              className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
              Texto Botón WhatsApp
            </label>
            <input
              type="text"
              value={current.newPatient?.buttonText || DEFAULT_WELCOME_SECTION.newPatient.buttonText}
              onChange={(e) => handleNewPatientChange("buttonText", e.target.value)}
              className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
              Párrafo 1
            </label>
            <textarea
              rows={2}
              value={current.newPatient?.description1 || DEFAULT_WELCOME_SECTION.newPatient.description1}
              onChange={(e) => handleNewPatientChange("description1", e.target.value)}
              className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
              Párrafo 2
            </label>
            <textarea
              rows={2}
              value={current.newPatient?.description2 || DEFAULT_WELCOME_SECTION.newPatient.description2}
              onChange={(e) => handleNewPatientChange("description2", e.target.value)}
              className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs"
            />
          </div>

          {/* Photo & Caption */}
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                Foto del Box Clínico (Ruta o URL)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={current.newPatient?.image || "/images/clinic-interior.jpg"}
                  onChange={(e) => handleNewPatientChange("image", e.target.value)}
                  className="flex-1 px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono"
                />
                <div className="relative w-16 h-10 border border-[#2b2b34] bg-neutral-900 overflow-hidden shrink-0">
                  <Image
                    src={current.newPatient?.image || "/images/clinic-interior.jpg"}
                    alt="Preview Box"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                Pie de Foto (Caption)
              </label>
              <input
                type="text"
                value={current.newPatient?.imageCaption || "Box Dental · Suecia 3580, Ñuñoa"}
                onChange={(e) => handleNewPatientChange("imageCaption", e.target.value)}
                className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
