"use client";

import React, { useState } from "react";
import { OdontogramTooth } from "@/types/auth";
import { Sparkles, ShieldCheck, AlertCircle, Info, Check, RotateCcw } from "lucide-react";

interface AnatomicalOdontogramProps {
  teeth: OdontogramTooth[];
  onToothClick?: (tooth: OdontogramTooth) => void;
  isDoctorMode?: boolean;
}

export function AnatomicalOdontogram({
  teeth,
  onToothClick,
  isDoctorMode = false,
}: AnatomicalOdontogramProps) {
  const [selectedTooth, setSelectedTooth] = useState<OdontogramTooth | null>(null);

  // Mapeo por cuadrantes anatómicos FDI
  const q1 = teeth.filter((t) => t.toothNumber >= 11 && t.toothNumber <= 18).sort((a, b) => b.toothNumber - a.toothNumber); // 18 -> 11
  const q2 = teeth.filter((t) => t.toothNumber >= 21 && t.toothNumber <= 28).sort((a, b) => a.toothNumber - b.toothNumber); // 21 -> 28
  const q4 = teeth.filter((t) => t.toothNumber >= 41 && t.toothNumber <= 48).sort((a, b) => b.toothNumber - a.toothNumber); // 48 -> 41
  const q3 = teeth.filter((t) => t.toothNumber >= 31 && t.toothNumber <= 38).sort((a, b) => a.toothNumber - b.toothNumber); // 31 -> 38

  // Métricas clínicas en vivo
  const totalCaries = teeth.filter((t) => t.status === "caries").length;
  const totalObturados = teeth.filter((t) => t.status === "obturado").length;
  const totalCoronas = teeth.filter((t) => t.status === "corona").length;
  const totalImplantes = teeth.filter((t) => t.status === "implante").length;
  const totalSanos = teeth.filter((t) => t.status === "sano").length;
  const totalExtracciones = teeth.filter((t) => t.status === "extraccion_indicada").length;

  const getToothName = (num: number): string => {
    const names: Record<number, string> = {
      18: "3er Molar Sup. Der.",
      17: "2do Molar Sup. Der.",
      16: "1er Molar Sup. Der.",
      15: "2do Premolar Sup. Der.",
      14: "1er Premolar Sup. Der.",
      13: "Canino Sup. Der.",
      12: "Incisivo Lat. Sup. Der.",
      11: "Incisivo Central Sup. Der.",
      21: "Incisivo Central Sup. Izq.",
      22: "Incisivo Lat. Sup. Izq.",
      23: "Canino Sup. Izq.",
      24: "1er Premolar Sup. Izq.",
      25: "2do Premolar Sup. Izq.",
      26: "1er Molar Sup. Izq.",
      27: "2do Molar Sup. Izq.",
      28: "3er Molar Sup. Izq.",
      48: "3er Molar Inf. Der.",
      47: "2do Molar Inf. Der.",
      46: "1er Molar Inf. Der.",
      45: "2do Premolar Inf. Der.",
      44: "1er Premolar Inf. Der.",
      43: "Canino Inf. Der.",
      42: "Incisivo Lat. Inf. Der.",
      41: "Incisivo Central Inf. Der.",
      31: "Incisivo Central Inf. Izq.",
      32: "Incisivo Lat. Inf. Izq.",
      33: "Canino Inf. Izq.",
      34: "1er Premolar Inf. Izq.",
      35: "2do Premolar Inf. Izq.",
      36: "1er Molar Inf. Izq.",
      37: "2do Molar Inf. Izq.",
      38: "3er Molar Inf. Izq.",
    };
    return names[num] || `Pieza #${num}`;
  };

  const getStatusColor = (status: OdontogramTooth["status"]) => {
    switch (status) {
      case "sano":
        return {
          bg: "bg-emerald-50 hover:bg-emerald-100",
          border: "border-emerald-300",
          text: "text-emerald-900",
          indicator: "bg-emerald-500",
          label: "Sano",
        };
      case "caries":
        return {
          bg: "bg-rose-50 hover:bg-rose-100",
          border: "border-rose-400",
          text: "text-rose-900",
          indicator: "bg-rose-600",
          label: "Caries",
        };
      case "obturado":
        return {
          bg: "bg-blue-50 hover:bg-blue-100",
          border: "border-blue-400",
          text: "text-blue-900",
          indicator: "bg-blue-600",
          label: "Obturado",
        };
      case "corona":
        return {
          bg: "bg-purple-50 hover:bg-purple-100",
          border: "border-purple-400",
          text: "text-purple-900",
          indicator: "bg-purple-600",
          label: "Corona",
        };
      case "implante":
        return {
          bg: "bg-teal-50 hover:bg-teal-100",
          border: "border-teal-400",
          text: "text-teal-900",
          indicator: "bg-teal-600",
          label: "Implante",
        };
      case "extraccion_indicada":
        return {
          bg: "bg-slate-100 line-through",
          border: "border-slate-300",
          text: "text-slate-400",
          indicator: "bg-slate-500",
          label: "Extracción",
        };
    }
  };

  const renderToothCard = (tooth: OdontogramTooth) => {
    const config = getStatusColor(tooth.status);
    const isSelected = selectedTooth?.toothNumber === tooth.toothNumber;

    return (
      <button
        key={tooth.toothNumber}
        type="button"
        onClick={() => {
          setSelectedTooth(tooth);
          if (onToothClick && isDoctorMode) {
            onToothClick(tooth);
          }
        }}
        title={`${getToothName(tooth.toothNumber)}: ${config.label}${
          isDoctorMode ? " (Clic para cambiar estado)" : ""
        }`}
        className={`group relative flex flex-col items-center justify-between p-2 rounded-sm border transition-all duration-150 select-none ${
          config.bg
        } ${config.border} ${
          isSelected ? "ring-2 ring-slate-900 scale-105 z-10 shadow-md" : "hover:scale-102"
        } ${isDoctorMode ? "cursor-pointer" : "cursor-default"}`}
      >
        <span className="text-[11px] font-mono font-bold text-slate-900">
          #{tooth.toothNumber}
        </span>

        {/* Anatomical 5-surface schematic visual */}
        <div className="w-6 h-6 relative my-1 border border-slate-300 rounded-[2px] bg-white flex items-center justify-center overflow-hidden">
          {/* Occlusal center */}
          <div
            className={`w-2.5 h-2.5 rounded-full ${config.indicator} transition-colors`}
          />
        </div>

        <span
          className={`text-[9px] font-mono uppercase tracking-wider font-semibold truncate max-w-full ${config.text}`}
        >
          {config.label}
        </span>
      </button>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Clinical Statistics Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-[0.2em] text-teal-800 uppercase font-bold">
              NOMENCLATURA INTERNACIONAL FDI (FEDERATION DENTAIRE INTERNATIONALE)
            </span>
            {isDoctorMode && (
              <span className="px-2 py-0.5 rounded bg-slate-900 text-white font-mono text-[9px] uppercase font-bold">
                Modo Sillón Activo
              </span>
            )}
          </div>
          <h3 className="text-lg font-semibold text-slate-900 tracking-tight mt-0.5">
            Odontograma Anatómico Digital en Cuadrantes
          </h3>
          <p className="text-xs font-mono text-slate-500">
            Orientación clínica: Vista frontal espejo (Derecha a la izquierda del observador)
          </p>
        </div>

        {/* Ledger Counters */}
        <div className="flex flex-wrap gap-2 text-xs font-mono">
          <div className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded">
            <strong>{totalSanos}</strong> Sanos
          </div>
          {totalCaries > 0 && (
            <div className="px-2.5 py-1 bg-rose-50 border border-rose-200 text-rose-800 rounded">
              <strong>{totalCaries}</strong> Caries
            </div>
          )}
          {totalObturados > 0 && (
            <div className="px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-800 rounded">
              <strong>{totalObturados}</strong> Obturados
            </div>
          )}
          {totalCoronas > 0 && (
            <div className="px-2.5 py-1 bg-purple-50 border border-purple-200 text-purple-800 rounded">
              <strong>{totalCoronas}</strong> Coronas
            </div>
          )}
          {totalImplantes > 0 && (
            <div className="px-2.5 py-1 bg-teal-50 border border-teal-200 text-teal-800 rounded">
              <strong>{totalImplantes}</strong> Implantes
            </div>
          )}
          {totalExtracciones > 0 && (
            <div className="px-2.5 py-1 bg-slate-100 border border-slate-300 text-slate-600 rounded">
              <strong>{totalExtracciones}</strong> Extracciones
            </div>
          )}
        </div>
      </div>

      {/* Anatomical Quad Layout */}
      <div className="bg-slate-50/70 border border-slate-200 rounded-lg p-4 sm:p-6 space-y-6">
        
        {/* UPPER ARCH (MAXILAR SUPERIOR) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 uppercase px-1">
            <span>Cuadrante 1: Superior Derecho (Vestibular)</span>
            <span className="font-bold text-slate-800">ARCADA MAXILAR SUPERIOR</span>
            <span>Cuadrante 2: Superior Izquierdo</span>
          </div>

          <div className="grid grid-cols-2 gap-2 relative">
            {/* Midline divider */}
            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-slate-300 -translate-x-1/2 z-0 hidden sm:block" />

            {/* Q1: 18 -> 11 */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 z-10">
              {q1.map(renderToothCard)}
            </div>

            {/* Q2: 21 -> 28 */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 z-10">
              {q2.map(renderToothCard)}
            </div>
          </div>
        </div>

        {/* OCCLUSAL PLANE DIVIDER */}
        <div className="relative py-2 flex items-center justify-center">
          <div className="border-t-2 border-dashed border-slate-300 w-full" />
          <span className="absolute bg-white px-3 py-0.5 border border-slate-300 rounded text-[9px] font-mono text-slate-500 uppercase tracking-widest">
            PLANO DE OCLUSIÓN INTERDENTAL & LÍNEA MEDIA FACIAL
          </span>
        </div>

        {/* LOWER ARCH (MANDÍBULA INFERIOR) */}
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2 relative">
            {/* Midline divider */}
            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-slate-300 -translate-x-1/2 z-0 hidden sm:block" />

            {/* Q4: 48 -> 41 */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 z-10">
              {q4.map(renderToothCard)}
            </div>

            {/* Q3: 31 -> 38 */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 z-10">
              {q3.map(renderToothCard)}
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 uppercase px-1 pt-1">
            <span>Cuadrante 4: Inferior Derecho</span>
            <span className="font-bold text-slate-800">ARCADA MANDIBULAR INFERIOR</span>
            <span>Cuadrante 3: Inferior Izquierdo</span>
          </div>
        </div>

      </div>

      {/* Selected Tooth Diagnostic Details Drawer */}
      {selectedTooth && (
        <div className="p-4 bg-white border border-slate-300 rounded-md shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                Pieza #{selectedTooth.toothNumber}
              </span>
              <span className="text-sm font-semibold text-slate-900">
                {getToothName(selectedTooth.toothNumber)}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                  getStatusColor(selectedTooth.status).bg
                } ${getStatusColor(selectedTooth.status).text}`}
              >
                {selectedTooth.status.replace("_", " ")}
              </span>
            </div>
            <p className="text-xs text-slate-600 font-light">
              {selectedTooth.surfaceNotes || "Sin hallazgos patológicos en caras mesial, distal, oclusal o vestibular."}
            </p>
          </div>

          {isDoctorMode ? (
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-slate-500">
                Clic sobre la pieza para rotar estado
              </span>
            </div>
          ) : (
            <div className="text-xs font-mono text-slate-500">
              Información sincronizada con ficha clínica del box
            </div>
          )}
        </div>
      )}

      {/* Universal Legend */}
      <div className="flex flex-wrap items-center gap-3 pt-2 text-[10px] font-mono border-t border-slate-100">
        <span className="text-slate-400 uppercase">Referencias:</span>
        <span className="flex items-center gap-1.5 text-emerald-800">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Sano
        </span>
        <span className="flex items-center gap-1.5 text-rose-800">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-600" /> Caries Activa
        </span>
        <span className="flex items-center gap-1.5 text-blue-800">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Obturación / Tapadura
        </span>
        <span className="flex items-center gap-1.5 text-purple-800">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-600" /> Corona Porcelana / Zirconio
        </span>
        <span className="flex items-center gap-1.5 text-teal-800">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-600" /> Implante Titanio
        </span>
        <span className="flex items-center gap-1.5 text-slate-500 line-through">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-400" /> Extracción Realizada
        </span>
      </div>

    </div>
  );
}
