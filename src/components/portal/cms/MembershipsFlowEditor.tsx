"use client";

import React, { useState } from "react";
import { CMSMembershipPlan, DEFAULT_MEMBERSHIP_PLANS } from "@/lib/cmsStore";
import {
  CreditCard,
  Plus,
  Trash2,
  Check,
  Sparkles,
  Link as LinkIcon,
  MessageCircle,
  ShieldCheck,
  Users
} from "lucide-react";

interface MembershipsFlowEditorProps {
  plans: CMSMembershipPlan[];
  onUpdatePlans: (updated: CMSMembershipPlan[]) => void;
}

export function MembershipsFlowEditor({
  plans,
  onUpdatePlans,
}: MembershipsFlowEditorProps) {
  const [newFeatureInputs, setNewFeatureInputs] = useState<{ [planIdx: number]: string }>({});

  const currentPlans = plans && plans.length > 0 ? plans : DEFAULT_MEMBERSHIP_PLANS;

  const handlePlanChange = (index: number, field: keyof CMSMembershipPlan, value: any) => {
    const updated = [...currentPlans];
    updated[index] = { ...updated[index], [field]: value };
    onUpdatePlans(updated);
  };

  const handleFeatureChange = (planIdx: number, featIdx: number, value: string) => {
    const updated = [...currentPlans];
    const features = [...updated[planIdx].features];
    features[featIdx] = value;
    updated[planIdx] = { ...updated[planIdx], features };
    onUpdatePlans(updated);
  };

  const handleAddFeature = (planIdx: number) => {
    const text = (newFeatureInputs[planIdx] || "").trim();
    if (!text) return;
    const updated = [...currentPlans];
    const features = [...updated[planIdx].features, text];
    updated[planIdx] = { ...updated[planIdx], features };
    onUpdatePlans(updated);
    setNewFeatureInputs({ ...newFeatureInputs, [planIdx]: "" });
  };

  const handleDeleteFeature = (planIdx: number, featIdx: number) => {
    const updated = [...currentPlans];
    const features = updated[planIdx].features.filter((_, i) => i !== featIdx);
    updated[planIdx] = { ...updated[planIdx], features };
    onUpdatePlans(updated);
  };

  const handleAddNewPlan = () => {
    const newPlan: CMSMembershipPlan = {
      id: `plan-${Date.now()}`,
      name: "Nuevo Plan Club BeHappy",
      tag: "PREVENCIÓN & AHORRO FAMILIAR",
      monthlyPrice: 19990,
      monthlyPriceDisplay: "$19.990",
      annualPriceDisplay: "$199.900 al año (Ahorra 2 meses)",
      billingPeriod: "mes",
      description: "Cobertura dental continua con arancel preferente y atenciones de urgencia.",
      popular: false,
      badge: "Beneficio Exclusivo",
      features: [
        "2 Limpiezas y Destartrajes con ultrasonido al año ($0 copago)",
        "Set radiográfico periapical digital de diagnóstico ($0 copago)",
        "40% de descuento en tratamientos restauradores y estética"
      ],
      ctaText: "Suscribirme al Plan",
      ctaWhatsappMessage: "Hola Centro Dental BeHappy, me gustaría suscribirme al nuevo plan del Club BeHappy.",
      coverageHighlight: "Limpiezas y Diagnóstico $0 Copago",
      flowPlanId: "behappy_plan_custom",
      maxFamilyMembers: 1,
      activeSubscriberSlots: 30,
    };
    onUpdatePlans([...currentPlans, newPlan]);
  };

  const handleDeletePlan = (index: number) => {
    if (confirm("¿Estás seguro de eliminar este plan de suscripción?")) {
      const updated = currentPlans.filter((_, i) => i !== index);
      onUpdatePlans(updated);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="border border-[#222228] bg-[#121216] p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-base font-normal text-white flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-amber-400" />
            <span>Club BeHappy · Suscripción Recurrente & Pasarela Flow.cl</span>
          </h3>
          <p className="text-xs text-neutral-400 font-light mt-1 max-w-2xl">
            Configuración comercial de planes PAC/PAT con cobro recurrente automático. Los cambios se actualizan en <strong className="text-white">/club</strong> y en <strong className="text-white">/precios</strong>.
          </p>
        </div>
        <button
          onClick={handleAddNewPlan}
          className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs uppercase font-bold flex items-center gap-1.5 transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Añadir Nuevo Plan</span>
        </button>
      </div>

      {/* Plans List */}
      <div className="space-y-6">
        {currentPlans.map((plan, pIdx) => (
          <div
            key={plan.id || pIdx}
            className={`border p-6 space-y-6 bg-[#121216] transition-all ${
              plan.popular
                ? "border-amber-500/80 ring-1 ring-amber-500/30"
                : "border-[#222228]"
            }`}
          >
            {/* Header of the plan card */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#222228] gap-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-amber-400 font-bold uppercase">
                  PLAN 0{pIdx + 1}
                </span>
                <input
                  type="text"
                  value={plan.name}
                  onChange={(e) => handlePlanChange(pIdx, "name", e.target.value)}
                  placeholder="Nombre del Plan (ej: Plan BeHappy Sonrisa)"
                  className="text-base font-semibold text-white bg-transparent border-b border-transparent hover:border-[#3a3a44] focus:border-amber-400 outline-none px-1 py-0.5"
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer text-xs font-mono text-neutral-300">
                  <input
                    type="checkbox"
                    checked={!!plan.popular}
                    onChange={(e) => handlePlanChange(pIdx, "popular", e.target.checked)}
                    className="rounded border-[#2b2b34] text-amber-500 focus:ring-0"
                  />
                  <span>Destacado (Más Elegido)</span>
                </label>

                <button
                  onClick={() => handleDeletePlan(pIdx)}
                  className="p-1 text-neutral-500 hover:text-red-400 transition"
                  title="Eliminar este plan"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">
                  Etiqueta / Tag Superior
                </label>
                <input
                  type="text"
                  value={plan.tag}
                  onChange={(e) => handlePlanChange(pIdx, "tag", e.target.value)}
                  placeholder="INDIVIDUAL · PREVENCIÓN TOTAL"
                  className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono uppercase focus:border-amber-400 outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">
                  Insignia / Badge Destacado
                </label>
                <input
                  type="text"
                  value={plan.badge || ""}
                  onChange={(e) => handlePlanChange(pIdx, "badge", e.target.value)}
                  placeholder="MÁS ELEGIDO POR FAMILIAS"
                  className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono focus:border-amber-400 outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">
                  Destacado de Cobertura (Pill)
                </label>
                <input
                  type="text"
                  value={plan.coverageHighlight || ""}
                  onChange={(e) => handlePlanChange(pIdx, "coverageHighlight", e.target.value)}
                  placeholder="2 limpiezas al año + Rx $0 copago"
                  className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono focus:border-amber-400 outline-none"
                />
              </div>
            </div>

            {/* Precios & Flow Plan ID */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-3 bg-[#15151b] border border-[#222228]">
              <div>
                <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">
                  Precio Mensual Mostrado
                </label>
                <input
                  type="text"
                  value={plan.monthlyPriceDisplay}
                  onChange={(e) => handlePlanChange(pIdx, "monthlyPriceDisplay", e.target.value)}
                  placeholder="$14.990"
                  className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono focus:border-amber-400 outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">
                  Monto CLP (Flow PAC)
                </label>
                <input
                  type="number"
                  value={plan.monthlyPrice}
                  onChange={(e) =>
                    handlePlanChange(pIdx, "monthlyPrice", parseInt(e.target.value) || 0)
                  }
                  placeholder="14990"
                  className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono focus:border-amber-400 outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">
                  Plan ID en Flow.cl
                </label>
                <input
                  type="text"
                  value={plan.flowPlanId || ""}
                  onChange={(e) => handlePlanChange(pIdx, "flowPlanId", e.target.value)}
                  placeholder="ej: plan_sonrisa_mensual"
                  className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono focus:border-amber-400 outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">
                  Precio Anual (con descuento)
                </label>
                <input
                  type="text"
                  value={plan.annualPriceDisplay || ""}
                  onChange={(e) => handlePlanChange(pIdx, "annualPriceDisplay", e.target.value)}
                  placeholder="$149.900 al año"
                  className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono focus:border-amber-400 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">
                Descripción del Plan
              </label>
              <textarea
                rows={2}
                value={plan.description}
                onChange={(e) => handlePlanChange(pIdx, "description", e.target.value)}
                className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs focus:border-amber-400 outline-none"
              />
            </div>

            {/* Features checklist */}
            <div className="space-y-3">
              <label className="text-[10px] font-mono text-neutral-400 uppercase block">
                Lista de Beneficios & Coberturas Incluidas ({plan.features?.length || 0})
              </label>
              <div className="space-y-2">
                {plan.features?.map((feat, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-950/80 border border-emerald-600/80 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-emerald-400" />
                    </span>
                    <input
                      type="text"
                      value={feat}
                      onChange={(e) => handleFeatureChange(pIdx, fIdx, e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-[#18181f] border border-[#2b2b34] text-white text-xs focus:border-amber-400 outline-none"
                    />
                    <button
                      onClick={() => handleDeleteFeature(pIdx, fIdx)}
                      className="p-1 text-neutral-500 hover:text-red-400 transition"
                      title="Eliminar este beneficio"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add feature input */}
              <div className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Escribe un nuevo beneficio (ej: 2 limpiezas al año $0 copago)..."
                  value={newFeatureInputs[pIdx] || ""}
                  onChange={(e) =>
                    setNewFeatureInputs({ ...newFeatureInputs, [pIdx]: e.target.value })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddFeature(pIdx);
                    }
                  }}
                  className="flex-1 px-3 py-1.5 bg-[#18181f] border border-[#2b2b34] text-white text-xs focus:border-amber-400 outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleAddFeature(pIdx)}
                  className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white font-mono text-xs uppercase flex items-center gap-1 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Añadir</span>
                </button>
              </div>
            </div>

            {/* CTA & WhatsApp parameters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[#222228]">
              <div>
                <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">
                  Texto del Botón CTA
                </label>
                <input
                  type="text"
                  value={plan.ctaText}
                  onChange={(e) => handlePlanChange(pIdx, "ctaText", e.target.value)}
                  className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs focus:border-amber-400 outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1 flex items-center gap-1">
                  <MessageCircle className="w-3 h-3 text-emerald-400" />
                  <span>Mensaje de WhatsApp para Solicitud</span>
                </label>
                <input
                  type="text"
                  value={plan.ctaWhatsappMessage}
                  onChange={(e) => handlePlanChange(pIdx, "ctaWhatsappMessage", e.target.value)}
                  className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono focus:border-amber-400 outline-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
