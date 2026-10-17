"use client";

import React, { useState } from "react";
import { CMSMembershipPlan, DEFAULT_MEMBERSHIP_PLANS } from "@/lib/cmsStore";
import {
  CreditCard,
  Plus,
  Trash2,
  Check,
  MessageCircle,
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
      <div className="border border-slate-200 bg-white p-5 rounded-lg shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-amber-500" />
            <span>Club BeHappy · Suscripción Recurrente & Pasarela Flow.cl</span>
          </h3>
          <p className="text-xs text-slate-600 font-light mt-1 max-w-2xl">
            Configuración comercial de planes PAC/PAT con cobro recurrente automático. Los cambios se actualizan en <strong className="text-slate-900">/club</strong> y en <strong className="text-slate-900">/precios</strong>.
          </p>
        </div>
        <button
          onClick={handleAddNewPlan}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-mono text-xs uppercase font-bold flex items-center gap-1.5 rounded transition shadow-xs shrink-0 cursor-pointer"
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
            className={`border rounded-lg p-6 space-y-6 bg-white shadow-xs transition-all ${
              plan.popular
                ? "border-amber-400 ring-2 ring-amber-400/20"
                : "border-slate-200"
            }`}
          >
            {/* Header of the plan card */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-bold uppercase">
                  PLAN 0{pIdx + 1}
                </span>
                <input
                  type="text"
                  value={plan.name}
                  onChange={(e) => handlePlanChange(pIdx, "name", e.target.value)}
                  placeholder="Nombre del Plan (ej: Plan BeHappy Sonrisa)"
                  className="text-base font-semibold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-amber-500 outline-none px-1 py-0.5"
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer text-xs font-mono text-slate-700">
                  <input
                    type="checkbox"
                    checked={!!plan.popular}
                    onChange={(e) => handlePlanChange(pIdx, "popular", e.target.checked)}
                    className="rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                  />
                  <span>Destacado (Más Elegido)</span>
                </label>

                <button
                  onClick={() => handleDeletePlan(pIdx)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                  title="Eliminar este plan"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">
                  Etiqueta / Tag Superior
                </label>
                <input
                  type="text"
                  value={plan.tag}
                  onChange={(e) => handlePlanChange(pIdx, "tag", e.target.value)}
                  placeholder="INDIVIDUAL · PREVENCIÓN TOTAL"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono uppercase rounded focus:bg-white focus:border-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">
                  Insignia / Badge Destacado
                </label>
                <input
                  type="text"
                  value={plan.badge || ""}
                  onChange={(e) => handlePlanChange(pIdx, "badge", e.target.value)}
                  placeholder="MÁS ELEGIDO POR FAMILIAS"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono rounded focus:bg-white focus:border-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">
                  Destacado de Cobertura (Pill)
                </label>
                <input
                  type="text"
                  value={plan.coverageHighlight || ""}
                  onChange={(e) => handlePlanChange(pIdx, "coverageHighlight", e.target.value)}
                  placeholder="2 limpiezas al año + Rx $0 copago"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono rounded focus:bg-white focus:border-slate-800 outline-none"
                />
              </div>
            </div>

            {/* Precios & Flow Plan ID */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-md">
              <div>
                <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">
                  Precio Mensual Mostrado
                </label>
                <input
                  type="text"
                  value={plan.monthlyPriceDisplay}
                  onChange={(e) => handlePlanChange(pIdx, "monthlyPriceDisplay", e.target.value)}
                  placeholder="$14.990"
                  className="w-full px-3 py-2 bg-white border border-slate-200 text-slate-900 text-xs font-mono rounded focus:border-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">
                  Monto CLP (Flow PAC)
                </label>
                <input
                  type="number"
                  value={plan.monthlyPrice}
                  onChange={(e) =>
                    handlePlanChange(pIdx, "monthlyPrice", parseInt(e.target.value) || 0)
                  }
                  placeholder="14990"
                  className="w-full px-3 py-2 bg-white border border-slate-200 text-slate-900 text-xs font-mono rounded focus:border-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">
                  Plan ID en Flow.cl
                </label>
                <input
                  type="text"
                  value={plan.flowPlanId || ""}
                  onChange={(e) => handlePlanChange(pIdx, "flowPlanId", e.target.value)}
                  placeholder="ej: plan_sonrisa_mensual"
                  className="w-full px-3 py-2 bg-white border border-slate-200 text-slate-900 text-xs font-mono rounded focus:border-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">
                  Precio Anual (con descuento)
                </label>
                <input
                  type="text"
                  value={plan.annualPriceDisplay || ""}
                  onChange={(e) => handlePlanChange(pIdx, "annualPriceDisplay", e.target.value)}
                  placeholder="$149.900 al año"
                  className="w-full px-3 py-2 bg-white border border-slate-200 text-slate-900 text-xs font-mono rounded focus:border-slate-800 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">
                Descripción del Plan
              </label>
              <textarea
                rows={2}
                value={plan.description}
                onChange={(e) => handlePlanChange(pIdx, "description", e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded focus:bg-white focus:border-slate-800 outline-none"
              />
            </div>

            {/* Features checklist */}
            <div className="space-y-3">
              <label className="text-[10px] font-mono text-slate-500 uppercase block">
                Lista de Beneficios & Coberturas Incluidas ({plan.features?.length || 0})
              </label>
              <div className="space-y-2">
                {plan.features?.map((feat, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3" />
                    </span>
                    <input
                      type="text"
                      value={feat}
                      onChange={(e) => handleFeatureChange(pIdx, fIdx, e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded focus:bg-white focus:border-slate-800 outline-none"
                    />
                    <button
                      onClick={() => handleDeleteFeature(pIdx, fIdx)}
                      className="p-1 text-slate-400 hover:text-red-600 transition"
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
                  className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded focus:bg-white focus:border-slate-800 outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleAddFeature(pIdx)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs uppercase rounded flex items-center gap-1 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Añadir</span>
                </button>
              </div>
            </div>

            {/* CTA & WhatsApp parameters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
              <div>
                <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">
                  Texto del Botón CTA
                </label>
                <input
                  type="text"
                  value={plan.ctaText}
                  onChange={(e) => handlePlanChange(pIdx, "ctaText", e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded focus:bg-white focus:border-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1 flex items-center gap-1">
                  <MessageCircle className="w-3 h-3 text-emerald-600" />
                  <span>Mensaje de WhatsApp para Solicitud</span>
                </label>
                <input
                  type="text"
                  value={plan.ctaWhatsappMessage}
                  onChange={(e) => handlePlanChange(pIdx, "ctaWhatsappMessage", e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono rounded focus:bg-white focus:border-slate-800 outline-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
