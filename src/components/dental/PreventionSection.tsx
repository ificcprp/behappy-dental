"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getCMSData, CMSData, CMSPreventionSection, DEFAULT_PREVENTION_SECTION } from "@/lib/cmsStore";

export function PreventionSection() {
  const [data, setData] = useState<CMSPreventionSection>(DEFAULT_PREVENTION_SECTION);

  useEffect(() => {
    const cms = getCMSData();
    if (cms?.preventionSection) {
      setData(cms.preventionSection);
    }

    const handleUpdate = (e: Event) => {
      const custom = (e as CustomEvent<CMSData>).detail;
      if (custom?.preventionSection) {
        setData(custom.preventionSection);
      } else {
        const fresh = getCMSData();
        if (fresh?.preventionSection) setData(fresh.preventionSection);
      }
    };

    window.addEventListener("behappy_cms_updated", handleUpdate);
    return () => window.removeEventListener("behappy_cms_updated", handleUpdate);
  }, []);

  return (
    <section className="bg-[#faf8f5] text-[#141413] py-24 px-4 sm:px-6 lg:px-8 border-b border-[#e5e0d5]">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Tracked Label */}
        <div className="text-center">
          <span className="text-[11px] font-mono tracking-[0.22em] text-[#78736a] uppercase block">
            {data.kicker || "CRITERIO PREVENTIVO · FILOSOFÍA CLÍNICA"}
          </span>
        </div>

        {/* Big Editorial Headline */}
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h2 className="text-3xl sm:text-5xl font-normal tracking-[-0.03em] text-[#141413] leading-tight">
            {data.title || "Una visita al dentista puede ahorrarte dinero y preservar tu estructura natural."}
          </h2>
        </div>

        {/* Two-Column Editorial Text Block */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 max-w-4xl mx-auto pt-4 border-t border-[#e5e0d5] text-sm text-[#5d5952] font-light leading-relaxed">
          <div className="space-y-4">
            <p className="text-base text-[#141413] font-serif italic">
              {data.quote || "“La odontología contemporánea ya no consiste en reparar cuando el diente duele, sino en monitorear para que el dolor jamás acontezca.”"}
            </p>
            <p>
              {data.paragraph1 || "Al revisar sus piezas dentales con regularidad mediante diagnóstico clínico e imagenología digital, detectamos caries iniciales y desajustes oclusales antes de que requieran tratamientos de conducto, coronas o extracciones invasivas."}
            </p>
          </div>

          <div className="space-y-4">
            <p>
              {data.paragraph2 || "Por lo tanto, postergar la consulta dental suele resultar costoso tanto para la conservación biológica como para su presupuesto familiar. En Centro Dental BeHappy concebimos la prevención como un compromiso ético con cada paciente."}
            </p>
            <div className="pt-2">
              <Link
                href={data.ctaUrl || "/tratamientos"}
                className="inline-flex items-center gap-1.5 text-xs font-mono tracking-widest uppercase text-[#141413] font-semibold underline underline-offset-4 decoration-1 hover:text-neutral-900 transition"
              >
                {data.ctaText || "Conocer el protocolo de revisión →"}
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
