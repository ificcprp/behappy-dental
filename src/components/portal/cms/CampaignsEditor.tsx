"use client";

import React from "react";
import Image from "next/image";
import { CMSPromotion } from "@/lib/cmsStore";
import { Plus, Trash2, Percent, Calendar, AlertCircle } from "lucide-react";

interface CampaignsEditorProps {
  promotions: CMSPromotion[];
  onUpdatePromotions: (updated: CMSPromotion[]) => void;
}

export function CampaignsEditor({
  promotions,
  onUpdatePromotions,
}: CampaignsEditorProps) {
  const handlePromoChange = (idx: number, field: keyof CMSPromotion, value: any) => {
    const updated = [...promotions];
    updated[idx] = { ...updated[idx], [field]: value };
    onUpdatePromotions(updated);
  };

  const handleAddNewPromo = () => {
    const newPromo: CMSPromotion = {
      id: `promo-${Date.now()}`,
      tag: "NUEVA PROMOCIÓN BEHAPPY",
      title: "Nueva Campaña Dental",
      discount: "20% DSCTO",
      description: "Descripción de las condiciones y cobertura del beneficio clínico...",
      badge: "Válido este mes",
      image: "/images/promos/seguro-dental.png",
      linkText: "Consultar Beneficio",
      linkHref: "/#agendar",
      disclaimer: "No acumulable con otras promociones ni aplicable sobre aranceles de laboratorio.",
      enableCountdown: false,
    };
    onUpdatePromotions([...promotions, newPromo]);
  };

  const handleDeletePromo = (idx: number, title: string) => {
    if (confirm(`¿Eliminar la promoción "${title}"?`)) {
      onUpdatePromotions(promotions.filter((_, i) => i !== idx));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border border-[#222228] bg-[#121216] p-4 flex justify-between items-center">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Percent className="w-4 h-4 text-pink-400" />
            <span>Campañas Vigentes, Convenios & Beneficios</span>
          </h3>
          <p className="text-xs text-neutral-400 font-light mt-0.5">
            Tarjetas de promociones temporales y convenios para pacientes de la clínica.
          </p>
        </div>
        <button
          onClick={handleAddNewPromo}
          className="px-4 py-2 bg-white text-black font-mono text-xs uppercase font-bold flex items-center gap-1.5 hover:bg-neutral-200 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Añadir Campaña</span>
        </button>
      </div>

      {/* Grid of promotions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {promotions.map((promo, idx) => (
          <div key={promo.id || idx} className="border border-[#222228] bg-[#121216] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#222228] pb-2">
              <span className="text-[10px] font-mono text-pink-400 uppercase font-bold">
                CAMPAÑA 0{idx + 1}
              </span>
              <button
                onClick={() => handleDeletePromo(idx, promo.title)}
                className="text-neutral-500 hover:text-red-400 p-1 transition"
                title="Eliminar campaña"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">
                    Etiqueta Superior
                  </label>
                  <input
                    type="text"
                    value={promo.tag}
                    onChange={(e) => handlePromoChange(idx, "tag", e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">
                    Badge de Vigencia
                  </label>
                  <input
                    type="text"
                    value={promo.badge || ""}
                    onChange={(e) => handlePromoChange(idx, "badge", e.target.value)}
                    placeholder="Válido este mes"
                    className="w-full px-3 py-1.5 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">
                  Título de la Campaña
                </label>
                <input
                  type="text"
                  value={promo.title}
                  onChange={(e) => handlePromoChange(idx, "title", e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">
                    Descuento o Cifra
                  </label>
                  <input
                    type="text"
                    value={promo.discount}
                    onChange={(e) => handlePromoChange(idx, "discount", e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono font-bold text-pink-400"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">
                    Texto Enlace
                  </label>
                  <input
                    type="text"
                    value={promo.linkText}
                    onChange={(e) => handlePromoChange(idx, "linkText", e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#18181f] border border-[#2b2b34] text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">
                  Descripción y Alcance
                </label>
                <textarea
                  rows={2}
                  value={promo.description}
                  onChange={(e) => handlePromoChange(idx, "description", e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#18181f] border border-[#2b2b34] text-white text-xs"
                />
              </div>

              {/* Photo & Disclaimer */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center pt-1 border-t border-[#222228]">
                <div>
                  <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">
                    Ruta Imagen
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={promo.image}
                      onChange={(e) => handlePromoChange(idx, "image", e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono"
                    />
                    <div className="relative w-12 h-10 border border-[#2b2b34] bg-neutral-900 overflow-hidden shrink-0">
                      <Image
                        src={promo.image || "/images/promos/seguro-dental.png"}
                        alt={promo.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">
                    Destino Enlace (URL)
                  </label>
                  <input
                    type="text"
                    value={promo.linkHref}
                    onChange={(e) => handlePromoChange(idx, "linkHref", e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
