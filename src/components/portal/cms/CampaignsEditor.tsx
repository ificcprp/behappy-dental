"use client";

import React from "react";
import Image from "next/image";
import { ImageUploadButton } from "./ImageUploadButton";
import { CMSPromotion } from "@/lib/cmsStore";
import { Plus, Trash2, Percent } from "lucide-react";

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
      <div className="border border-slate-200 bg-white p-4 rounded-lg shadow-xs flex justify-between items-center">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Percent className="w-4 h-4 text-pink-600" />
            <span>Campañas Vigentes, Convenios & Beneficios</span>
          </h3>
          <p className="text-xs text-slate-600 font-light mt-0.5">
            Tarjetas de promociones temporales y convenios para pacientes de la clínica.
          </p>
        </div>
        <button
          onClick={handleAddNewPromo}
          className="px-4 py-2 bg-slate-900 text-white font-mono text-xs uppercase font-bold flex items-center gap-1.5 rounded hover:bg-slate-800 transition shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Añadir Campaña</span>
        </button>
      </div>

      {/* Grid of promotions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {promotions.map((promo, idx) => (
          <div key={promo.id || idx} className="border border-slate-200 bg-white rounded-lg p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-[10px] font-mono text-pink-700 bg-pink-50 border border-pink-200 px-2 py-0.5 rounded uppercase font-bold">
                CAMPAÑA 0{idx + 1}
              </span>
              <button
                onClick={() => handleDeletePromo(idx, promo.title)}
                className="text-slate-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition cursor-pointer"
                title="Eliminar campaña"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">
                    Etiqueta Superior
                  </label>
                  <input
                    type="text"
                    value={promo.tag}
                    onChange={(e) => handlePromoChange(idx, "tag", e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono uppercase rounded focus:bg-white focus:border-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">
                    Badge de Vigencia
                  </label>
                  <input
                    type="text"
                    value={promo.badge || ""}
                    onChange={(e) => handlePromoChange(idx, "badge", e.target.value)}
                    placeholder="Válido este mes"
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono rounded focus:bg-white focus:border-slate-800 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">
                  Título de la Campaña
                </label>
                <input
                  type="text"
                  value={promo.title}
                  onChange={(e) => handlePromoChange(idx, "title", e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold rounded focus:bg-white focus:border-slate-800 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">
                    Descuento o Cifra
                  </label>
                  <input
                    type="text"
                    value={promo.discount}
                    onChange={(e) => handlePromoChange(idx, "discount", e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 text-pink-700 text-xs font-mono font-bold rounded focus:bg-white focus:border-slate-800 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">
                    Texto Enlace
                  </label>
                  <input
                    type="text"
                    value={promo.linkText}
                    onChange={(e) => handlePromoChange(idx, "linkText", e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded focus:bg-white focus:border-slate-800 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">
                  Descripción y Alcance
                </label>
                <textarea
                  rows={2}
                  value={promo.description}
                  onChange={(e) => handlePromoChange(idx, "description", e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded focus:bg-white focus:border-slate-800 outline-none"
                />
              </div>

              {/* Photo & Disclaimer */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center pt-2 border-t border-slate-100">
                <div>
                  <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">
                    Ruta Imagen
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={promo.image}
                      onChange={(e) => handlePromoChange(idx, "image", e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono rounded focus:bg-white focus:border-slate-800 outline-none"
                    />
                    <div className="relative w-12 h-10 border border-slate-200 bg-slate-100 rounded overflow-hidden shrink-0">
                      <Image
                        src={promo.image || "/images/promos/seguro-dental.png"}
                        alt={promo.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="pt-1.5">
                    <ImageUploadButton
                      compact
                      label="Subir imagen"
                      onUploaded={(url) => handlePromoChange(idx, "image", url)}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">
                    Destino Enlace (URL)
                  </label>
                  <input
                    type="text"
                    value={promo.linkHref}
                    onChange={(e) => handlePromoChange(idx, "linkHref", e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono rounded focus:bg-white focus:border-slate-800 outline-none"
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
