"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  { text: "¡Te estábamos esperando con alegría!", link: null },
  { text: "La transformación de tu sonrisa comienza aquí con nosotros.", link: null },
  { text: "Diseñamos con cuidado tu mejor versión.", link: null },
  { text: "Hecho con precisión y un toque transformador.", link: null },
  { text: "¡Tú mereces una sonrisa extraordinaria!", link: null },
  { text: "Sonríe con calidad, haz que cada una cuente.", link: null },
  { text: "Cada tratamiento renueva tu confianza interior.", link: null },
  { text: "Nuestra odontología crea legados duraderos de sonrisas.", link: null },
  { text: "Cada visita es un nuevo inicio emocionante.", link: null },
  { text: "Consulta inicial gratuita con evaluaciones expertas.", link: "/contacto" },
  { text: "Especialistas en Ortodoncia, Implantes y Estética en Ñuñoa.", link: "/tratamientos" },
];

export function TopAnnouncementTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      nextSlide();
    }, 5200);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused]);

  const current = SLIDES[currentIndex];

  return (
    <div
      className="bg-[#141413] text-[#e8e4db] border-b border-[#292825] relative z-40 w-full overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-10 flex items-center justify-between relative">
        {/* Prev Arrow */}
        <button
          onClick={prevSlide}
          className="text-[#969288] hover:text-white p-1 transition-colors duration-200 z-10 focus:outline-none"
          aria-label="Mensaje anterior"
        >
          <ChevronLeft className="w-3.5 h-3.5 opacity-80 hover:opacity-100" />
        </button>

        {/* Text Slide */}
        <div className="flex-1 text-center px-3 sm:px-6 overflow-hidden">
          <div
            key={currentIndex}
            className="animate-in fade-in duration-500 font-mono text-[11px] tracking-[0.14em] uppercase text-[#ded9cd] truncate sm:whitespace-normal"
          >
            {current.link ? (
              <Link
                href={current.link}
                className="hover:text-white underline decoration-[#6e6a61] underline-offset-4 transition-colors"
              >
                {current.text}
              </Link>
            ) : (
              <span>{current.text}</span>
            )}
          </div>
        </div>

        {/* Next Arrow */}
        <button
          onClick={nextSlide}
          className="text-[#969288] hover:text-white p-1 transition-colors duration-200 z-10 focus:outline-none"
          aria-label="Siguiente mensaje"
        >
          <ChevronRight className="w-3.5 h-3.5 opacity-80 hover:opacity-100" />
        </button>
      </div>
    </div>
  );
}
