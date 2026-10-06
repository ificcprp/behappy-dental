"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TREATMENTS } from "@/data/treatments";

export function EspecialidadesTratamientosCarousel() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(TREATMENTS.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = TREATMENTS.slice(startIndex, startIndex + itemsPerPage);

  const goToPrev = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : totalPages));
  };

  const goToNext = () => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : 1));
  };

  return (
    <section className="bg-[#faf8f5] text-[#141413] py-20 px-4 sm:px-6 lg:px-8 border-b border-[#e5e0d5]">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#e5e0d5] pb-6">
          <div className="space-y-2">
            <span className="text-[11px] font-mono tracking-[0.22em] text-[#78736a] uppercase block">
              CATÁLOGO CLÍNICO REAL · 20 DISCIPLINAS ODONTOLÓGICAS
            </span>
            <h2 className="text-3xl sm:text-4xl font-normal tracking-[-0.03em] text-[#141413]">
              Especialidades y Tratamientos
            </h2>
            <p className="text-xs sm:text-sm text-[#66635d] font-light max-w-xl">
              Atención dental integral bajo protocolo médico riguroso, tecnología digital y presupuesto transparente.
            </p>
          </div>

          {/* Minimalist Pagination Controls in Header */}
          <div className="flex items-center space-x-3 text-xs font-mono tracking-widest">
            <span className="text-[#78736a]">PÁGINA 0{currentPage} / 0{totalPages}</span>
            <div className="flex items-center space-x-1">
              <button
                onClick={goToPrev}
                aria-label="Página anterior"
                className="p-1.5 border border-[#e5e0d5] hover:border-[#141413] transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={goToNext}
                aria-label="Página siguiente"
                className="p-1.5 border border-[#e5e0d5] hover:border-[#141413] transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentItems.map((item, index) => {
            const globalIndex = startIndex + index + 1;
            const formattedNum = globalIndex < 10 ? `0${globalIndex}` : `${globalIndex}`;

            return (
              <Link
                key={item.id}
                href={`/tratamientos#${item.slug}`}
                className="group flex flex-col justify-between border border-[#e5e0d5] bg-white p-5 hover:border-[#141413] hover:shadow-sm transition-all duration-300"
              >
                <div className="space-y-4">
                  {/* Top Number & Tag */}
                  <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-[#78736a] pb-2 border-b border-[#f0ede6]">
                    <span>Nº {formattedNum}</span>
                    <span className="uppercase text-[#141413] font-semibold">{item.tag}</span>
                  </div>

                  {/* Image */}
                  <div className="relative w-full h-[180px] bg-[#f5f2eb] overflow-hidden border border-[#e5e0d5]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                    />
                  </div>

                  {/* Text Info */}
                  <div className="space-y-1.5 pt-1">
                    <h3 className="text-base font-normal tracking-tight text-[#141413] group-hover:text-black transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-[#66635d] font-light leading-relaxed">
                      {item.shortDescription}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#f0ede6] mt-4 flex items-center justify-between text-[11px] font-mono tracking-wider text-[#78736a] group-hover:text-[#141413]">
                  <span>Ver detalles</span>
                  <span>→</span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom Pagination Bar (< 1 2 3 4 5 >) */}
        <div className="flex items-center justify-center space-x-3 pt-4 border-t border-[#e5e0d5]">
          <button
            onClick={goToPrev}
            aria-label="Página anterior"
            className="p-1 text-[#78736a] hover:text-[#141413] transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => setCurrentPage(pageNumber)}
              className={`text-xs font-mono px-2.5 py-1 transition ${
                currentPage === pageNumber
                  ? "font-bold text-[#141413] border-b-2 border-[#141413]"
                  : "text-[#78736a] hover:text-[#141413] font-normal"
              }`}
            >
              0{pageNumber}
            </button>
          ))}

          <button
            onClick={goToNext}
            aria-label="Página siguiente"
            className="p-1 text-[#78736a] hover:text-[#141413] transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </section>
  );
}
