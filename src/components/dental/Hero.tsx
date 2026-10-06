"use client";

import React from "react";

export function Hero() {
  const whatsappUrl =
    "https://api.whatsapp.com/send/?phone=56947578597&text&type=phone_number&app_absent=0";

  const handleScrollToBooking = () => {
    const el = document.getElementById("agendar");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="bg-[#faf8f5] text-[#141413] border-b border-[#e5e0d5] pt-16 pb-20 sm:pt-20 sm:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Kicker */}
        <div className="mb-6">
          <span className="text-[11px] font-mono tracking-[0.24em] text-[#78736a] uppercase block">
            ODONTOLOGÍA AVANZADA & PREVENCIÓN CLÍNICA · SUECIA 3580, ÑUÑOA
          </span>
        </div>

        {/* Asymmetrical 2-Column Grid (Mirroring Reference Blueprint) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Thesis & Call to Action (65% width) */}
          <div className="lg:col-span-8 space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-normal tracking-[-0.035em] text-[#141413] leading-[1.12]">
              Trece años de práctica odontológica orientada a la salud integral y la armonía de tu sonrisa.
            </h1>

            <div className="space-y-4 text-[15px] text-[#4d4943] font-light leading-relaxed max-w-2xl">
              <p>
                Para quien busca un diagnóstico certero antes de iniciar cualquier tratamiento: en Centro Dental BeHappy estructuramos la atención médica desde la imagenología digital computarizada, la ortodoncia invisible y la implantología de precisión.
              </p>
              <p>
                Protocolos indoloros, preservación de la estructura dental biológica y un presupuesto cerrado con aranceles transparentes y facilidades de financiamiento.
              </p>
            </div>

            {/* Editorial Action Desk */}
            <div className="pt-4 flex flex-wrap items-center gap-5 sm:gap-6">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#141413] text-[#faf8f5] text-[12px] font-mono tracking-[0.14em] uppercase px-6 py-3.5 hover:bg-black transition rounded-none font-bold inline-flex items-center gap-2 shadow-sm"
              >
                Reservar por WhatsApp
              </a>

              <button
                onClick={handleScrollToBooking}
                className="text-[13px] text-[#141413] underline underline-offset-4 decoration-[#b8b2a5] hover:decoration-[#141413] font-normal transition-colors"
              >
                o agendar en línea con nuestro agendador →
              </button>
            </div>
          </div>

          {/* Right Column: Literary Serif Quote (35% width) */}
          <div className="lg:col-span-4 lg:pt-8 flex flex-col justify-end lg:text-right border-l lg:border-l-0 lg:border-r-0 border-[#ded9cd] pl-5 lg:pl-0">
            <blockquote className="font-serif italic text-lg sm:text-[20px] text-[#3c3933] leading-[1.45] max-w-sm ml-auto">
              &ldquo;La odontología contemporánea no consiste en imponer procedimientos, sino en comprender la estructura biológica de cada paciente y construir un plan médico ético, indoloro y predecible.&rdquo;
            </blockquote>
            <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#78736a] mt-4">
              — Dirección Médica · Suecia 3580, OF. 304
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
