"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getCMSData, CMSData, CMSHero, DEFAULT_HERO } from "@/lib/cmsStore";

export function Hero() {
  const [heroData, setHeroData] = useState<CMSHero>(DEFAULT_HERO);

  useEffect(() => {
    const cms = getCMSData();
    if (cms?.hero) {
      setHeroData(cms.hero);
    }

    const handleUpdate = (e: Event) => {
      const custom = (e as CustomEvent<CMSData>).detail;
      if (custom?.hero) {
        setHeroData(custom.hero);
      } else {
        const fresh = getCMSData();
        if (fresh?.hero) setHeroData(fresh.hero);
      }
    };

    window.addEventListener("behappy_cms_updated", handleUpdate);
    return () => window.removeEventListener("behappy_cms_updated", handleUpdate);
  }, []);

  const handleScrollToBooking = () => {
    const el = document.getElementById("agendar");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full min-h-[580px] sm:min-h-[640px] lg:min-h-[700px] flex items-center justify-center overflow-hidden bg-black text-white border-b border-neutral-800">
      
      {/* Background Image with Dark Vignette Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={heroData.bgImage || "/images/hero-woman.jpg"}
          alt="Centro Dental BeHappy Ñuñoa"
          fill
          priority
          className="object-cover object-center filter brightness-[0.72] contrast-[1.05]"
          sizes="100vw"
        />
        {/* Soft gradient overlay matching reference screenshot */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black/80" />
      </div>

      {/* Hero Content Box Centered */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-6">
        
        {/* Kicker: "Bienvenidos a" */}
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <span className="text-xl sm:text-2xl lg:text-3xl font-light tracking-wide text-neutral-200 block">
            {heroData.welcomeKicker || "Bienvenidos a"}
          </span>
        </div>

        {/* Main Title: "Centro Dental BeHappy" */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-white leading-tight drop-shadow-sm">
          {heroData.title || "Centro Dental BeHappy"}
        </h1>

        {/* Subtitle / Description */}
        <p className="text-base sm:text-lg lg:text-xl text-neutral-200 font-light max-w-2xl mx-auto leading-relaxed drop-shadow">
          {heroData.subtitle || "Centro dental en Ñuñoa con la última tecnología y tratamientos de la más alta calidad."}
        </p>

        {/* Call to Actions (Matching screenshot rounded pill CTA) */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={heroData.primaryCtaUrl || "https://api.whatsapp.com/send/?phone=56947578597&text&type=phone_number&app_absent=0"}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-10 py-3.5 rounded-full bg-black/80 border-2 border-white/90 text-white font-medium text-sm sm:text-base hover:bg-white hover:text-black transition-all duration-200 shadow-lg tracking-wide inline-flex items-center justify-center"
          >
            {heroData.primaryCtaText || "Reserva aquí"}
          </a>

          <button
            onClick={handleScrollToBooking}
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 text-neutral-200 text-xs sm:text-sm font-mono tracking-wider uppercase transition backdrop-blur-sm"
          >
            {heroData.secondaryCtaText || "Agendar con agendador →"}
          </button>
        </div>

        {/* Address and Communes Subtext */}
        <div className="pt-4">
          <span className="text-[11px] font-mono tracking-[0.22em] text-neutral-400 uppercase">
            Suecia 3580, OF. 304 · Ñuñoa, Santiago · Metro Chile España L3
          </span>
        </div>

      </div>

    </section>
  );
}
