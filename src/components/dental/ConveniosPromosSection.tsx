"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getCMSData, CMSData, CMSPromotion, DEFAULT_PROMOTIONS } from "@/lib/cmsStore";

export function ConveniosPromosSection() {
  const [promotions, setPromotions] = useState<CMSPromotion[]>(DEFAULT_PROMOTIONS);

  useEffect(() => {
    const cms = getCMSData();
    if (cms?.promotions && cms.promotions.length > 0) {
      setPromotions(cms.promotions);
    }

    const handleUpdate = (e: Event) => {
      const custom = (e as CustomEvent<CMSData>).detail;
      if (custom?.promotions && custom.promotions.length > 0) {
        setPromotions(custom.promotions);
      } else {
        setPromotions(getCMSData().promotions);
      }
    };

    window.addEventListener("behappy_cms_updated", handleUpdate);
    return () => window.removeEventListener("behappy_cms_updated", handleUpdate);
  }, []);

  const promoImages = [
    "/images/promos/seguro-dental.png",
    "/images/promos/promos-vigentes.png"
  ];

  return (
    <section className="bg-[#faf8f5] text-[#141413] py-24 px-4 sm:px-6 lg:px-8 border-b border-[#e5e0d5]">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="space-y-3">
          <span className="text-[11px] font-mono tracking-[0.22em] text-[#78736a] uppercase block">
            CONVENIOS INSTITUCIONALES & BENEFICIOS
          </span>
          <h2 className="text-3xl sm:text-5xl font-normal tracking-[-0.03em] text-[#141413]">
            Conveníos y Promociones
          </h2>
          <p className="text-sm sm:text-base text-[#66635d] font-light max-w-2xl leading-relaxed">
            En Centro Dental BeHappy, ofrecemos convenios, promociones y facilidades de pago para garantizar la continuidad ininterrumpida de su tratamiento.
          </p>
        </div>

        {/* Dynamic Promos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {promotions.map((promo, idx) => (
            <div
              key={promo.id || idx}
              className="flex flex-col justify-between border border-[#e5e0d5] bg-white p-6 sm:p-8 hover:border-[#141413] transition-colors group"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#e5e0d5] pb-3">
                  <span className="text-[10px] font-mono tracking-[0.2em] text-[#78736a] uppercase">
                    {promo.tag || `PL-0${idx + 1} · BENEFICIO`}
                  </span>
                  <span className="text-[11px] font-mono text-[#141413] font-bold">
                    {promo.discount || "20% ~ 60%"}
                  </span>
                </div>

                {/* Photo */}
                <div className="relative w-full h-[240px] sm:h-[280px] bg-[#f5f2eb] overflow-hidden border border-[#e5e0d5]">
                  <Image
                    src={promoImages[idx % promoImages.length]}
                    alt={promo.title}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 550px"
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-normal tracking-tight text-[#141413]">
                    {promo.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#66635d] font-light leading-relaxed">
                    {promo.description}
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-[#e5e0d5] mt-6">
                <Link
                  href={promo.linkHref || "/precios"}
                  className="inline-flex w-full items-center justify-center py-3.5 px-6 rounded-[2px] bg-[#141413] text-[#faf8f5] hover:bg-black text-xs font-mono tracking-[0.16em] uppercase font-bold transition shadow-sm"
                >
                  {promo.linkText || (idx === 0 ? "Lee Sobre Nuestro Seguro" : "Explora Promociones Vigentes")}
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
