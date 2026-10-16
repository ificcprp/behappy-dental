"use client";

import React from "react";
import { CMSPreventionSection, DEFAULT_PREVENTION_SECTION } from "@/lib/cmsStore";
import { HeartHandshake, ShieldCheck, DollarSign } from "lucide-react";

interface PrevencionEditorProps {
  preventionSection: CMSPreventionSection;
  onUpdatePreventionSection: (updated: CMSPreventionSection) => void;
}

export function PrevencionEditor({
  preventionSection,
  onUpdatePreventionSection,
}: PrevencionEditorProps) {
  const current = preventionSection || DEFAULT_PREVENTION_SECTION;

  const handleChange = (field: keyof CMSPreventionSection, value: string) => {
    onUpdatePreventionSection({ ...current, [field]: value });
  };

  return (
    <div className="border border-[#222228] bg-[#121216] p-6 space-y-6">
      <div className="border-b border-[#222228] pb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-normal text-white flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-emerald-400" />
            <span>Criterio Preventivo & Filosofía Clínica</span>
          </h3>
          <p className="text-xs text-neutral-400 font-light mt-0.5">
            &quot;Una visita al dentista puede ahorrarte dinero&quot;: texto editorial que educa al paciente sobre revisiones periódicas.
          </p>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 border border-emerald-800/60 bg-emerald-950/30 px-2.5 py-1">
          SECCIÓN 3
        </span>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
              Kicker Superior
            </label>
            <input
              type="text"
              value={current.kicker || DEFAULT_PREVENTION_SECTION.kicker}
              onChange={(e) => handleChange("kicker", e.target.value)}
              className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
              Texto del Botón / Enlace CTA
            </label>
            <input
              type="text"
              value={current.ctaText || DEFAULT_PREVENTION_SECTION.ctaText}
              onChange={(e) => handleChange("ctaText", e.target.value)}
              className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
            Gran Titular Editorial
          </label>
          <textarea
            rows={2}
            value={current.title || DEFAULT_PREVENTION_SECTION.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-sm font-serif"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
            Cita Médica Destacada (Frase en Cursiva con Respaldo)
          </label>
          <textarea
            rows={2}
            value={current.quote || DEFAULT_PREVENTION_SECTION.quote}
            onChange={(e) => handleChange("quote", e.target.value)}
            className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs italic"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
              Párrafo Explicativo 1 (Biológico)
            </label>
            <textarea
              rows={4}
              value={current.paragraph1 || DEFAULT_PREVENTION_SECTION.paragraph1}
              onChange={(e) => handleChange("paragraph1", e.target.value)}
              className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
              Párrafo Explicativo 2 (Económico / Familiar)
            </label>
            <textarea
              rows={4}
              value={current.paragraph2 || DEFAULT_PREVENTION_SECTION.paragraph2}
              onChange={(e) => handleChange("paragraph2", e.target.value)}
              className="w-full px-3 py-2 bg-[#18181f] border border-[#2b2b34] text-white text-xs leading-relaxed"
            />
          </div>
        </div>

        {/* Cost Comparison Education Card */}
        <div className="p-4 bg-[#15151b] border border-[#222228] space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase font-bold">
            <DollarSign className="w-4 h-4" />
            <span>Matriz Comparativa de Ahorro: Prevención vs Tratamiento Tardío</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
            <div className="p-3 bg-emerald-950/20 border border-emerald-800/40">
              <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold block mb-1">
                Detección Temprana en BeHappy
              </span>
              <p className="text-white font-bold">Profilaxis + Evaluación: $0 a $35.000</p>
              <p className="text-neutral-400 text-[11px] mt-1 font-light">
                Preserva el 100% del esmalte dental y evita dolor e intervenciones invasivas.
              </p>
            </div>
            <div className="p-3 bg-red-950/20 border border-red-800/40">
              <span className="text-[10px] font-mono text-red-400 uppercase font-bold block mb-1">
                Postergar la Atención (Daño Biológico)
              </span>
              <p className="text-white font-bold">Endodoncia + Perno + Corona: $380.000+</p>
              <p className="text-neutral-400 text-[11px] mt-1 font-light">
                Múltiples sesiones de box, pérdida de estructura natural y mayor costo presupuestario.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
