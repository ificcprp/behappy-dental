"use client";

import React, { useState } from "react";
import { CMSPricingProcedure, DEFAULT_PRICING_PROCEDURES } from "@/lib/cmsStore";
import { Calculator, Plus, Trash2, RefreshCw, Sparkles, Check, DollarSign, Layers } from "lucide-react";

interface PricingArancelesEditorProps {
  procedures: CMSPricingProcedure[];
  onUpdateProcedures: (updated: CMSPricingProcedure[]) => void;
  triggerToast?: (msg: string) => void;
}

export function PricingArancelesEditor({
  procedures,
  onUpdateProcedures,
  triggerToast,
}: PricingArancelesEditorProps) {
  const current = procedures && procedures.length > 0 ? procedures : DEFAULT_PRICING_PROCEDURES;
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleUpdateProcedure = (index: number, field: keyof CMSPricingProcedure, value: any) => {
    const updated = [...current];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    onUpdateProcedures(updated);
  };

  const handleAddProcedure = () => {
    const newProc: CMSPricingProcedure = {
      id: `proc_${Date.now()}`,
      name: "Nuevo Procedimiento Odontológico",
      marketPrice: 60000,
      convenioDiscountPercent: 30,
      fonasaEstimateCoverage: 10000,
      isapreEstimateCoverage: 20000,
      category: "General",
      notes: "Atención odontológica de alta precisión en BeHappy.",
    };
    onUpdateProcedures([...current, newProc]);
    setEditingId(newProc.id);
    if (triggerToast) triggerToast("✓ Nuevo procedimiento agregado al cotizador");
  };

  const handleDeleteProcedure = (index: number) => {
    if (confirm("¿Estás seguro de eliminar este procedimiento del cotizador interactivo?")) {
      const updated = current.filter((_, idx) => idx !== index);
      onUpdateProcedures(updated);
      if (triggerToast) triggerToast("✓ Procedimiento eliminado");
    }
  };

  const handleResetDefaults = () => {
    if (confirm("¿Deseas restablecer todos los aranceles del cotizador a los valores oficiales?")) {
      onUpdateProcedures(DEFAULT_PRICING_PROCEDURES);
      if (triggerToast) triggerToast("✓ Aranceles del cotizador restablecidos");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="border border-slate-200 bg-white p-4 sm:p-5 rounded-lg shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <Calculator className="w-4 h-4 text-cyan-600" />
            <span>Aranceles & Copagos del Cotizador Interactivo (/precios)</span>
          </h3>
          <p className="text-xs text-slate-500 font-light mt-0.5">
            Los precios base y de Club se sincronizan automáticamente con el Catálogo de Tratamientos. Aquí puedes afinar las estimaciones de cobertura Fonasa e Isapre para cada procedimiento.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddProcedure}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-mono font-bold transition rounded-xs cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Añadir Procedimiento</span>
          </button>
          <button
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-mono transition rounded-xs cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Valores por Defecto</span>
          </button>
        </div>
      </div>

      {/* Procedures List */}
      <div className="space-y-4">
        {current.map((proc, idx) => {
          const clubPrice = Math.round(proc.marketPrice * (1 - proc.convenioDiscountPercent / 100));
          const isExpanded = editingId === proc.id;

          return (
            <div
              key={proc.id || idx}
              className="border border-[#222228] bg-[#121216] rounded-xs overflow-hidden transition"
            >
              {/* Row Summary / Header */}
              <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#15151a]">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-cyan-400 border border-cyan-800/60 bg-cyan-950/30 px-2 py-0.5">
                    {proc.category || "General"}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-white">{proc.name}</h4>
                    <p className="text-[11px] font-mono text-neutral-400 mt-0.5">
                      Arancel: ${proc.marketPrice.toLocaleString("es-CL")} · Copago Club BeHappy: ${clubPrice.toLocaleString("es-CL")} ({proc.convenioDiscountPercent}% dcto)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setEditingId(isExpanded ? null : proc.id)}
                    className="px-2.5 py-1 text-[11px] font-mono bg-[#1c1c24] hover:bg-[#252530] text-neutral-300 border border-[#2e2e38]"
                  >
                    {isExpanded ? "Cerrar" : "Editar Aranceles"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteProcedure(idx)}
                    className="p-1.5 text-neutral-500 hover:text-red-400 transition"
                    title="Eliminar procedimiento"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Expanded Edit Form */}
              {isExpanded && (
                <div className="p-5 border-t border-[#222228] bg-[#0e0e12] space-y-4 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                        Nombre Oficial del Procedimiento
                      </label>
                      <input
                        type="text"
                        value={proc.name}
                        onChange={(e) => handleUpdateProcedure(idx, "name", e.target.value)}
                        className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs focus:border-cyan-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                        Categoría
                      </label>
                      <input
                        type="text"
                        value={proc.category}
                        onChange={(e) => handleUpdateProcedure(idx, "category", e.target.value)}
                        placeholder="Ej: Prevención, Implantología"
                        className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs focus:border-cyan-500 outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                        Precio Mercado CLP ($)
                      </label>
                      <input
                        type="number"
                        min={0}
                        step={1000}
                        value={proc.marketPrice}
                        onChange={(e) => handleUpdateProcedure(idx, "marketPrice", Number(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono focus:border-cyan-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                        Descuento Club BeHappy (%)
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={proc.convenioDiscountPercent}
                        onChange={(e) => handleUpdateProcedure(idx, "convenioDiscountPercent", Number(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-cyan-400 text-xs font-mono focus:border-cyan-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                        Cobertura Fonasa Estimada ($)
                      </label>
                      <input
                        type="number"
                        min={0}
                        step={1000}
                        value={proc.fonasaEstimateCoverage}
                        onChange={(e) => handleUpdateProcedure(idx, "fonasaEstimateCoverage", Number(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono focus:border-cyan-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                        Cobertura Isapre Estimada ($)
                      </label>
                      <input
                        type="number"
                        min={0}
                        step={1000}
                        value={proc.isapreEstimateCoverage}
                        onChange={(e) => handleUpdateProcedure(idx, "isapreEstimateCoverage", Number(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono focus:border-cyan-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                      Descripción Clínica / Notas para el Paciente
                    </label>
                    <input
                      type="text"
                      value={proc.notes}
                      onChange={(e) => handleUpdateProcedure(idx, "notes", e.target.value)}
                      placeholder="Ej: Remoción de sarro supragingival y pulido con flúor."
                      className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-neutral-300 text-xs focus:border-cyan-500 outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
