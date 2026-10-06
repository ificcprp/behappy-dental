"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TreatmentSlideItem {
  id: string;
  num: string;
  tag: string;
  title: string;
  description: string;
  image: string;
  link: string;
}

const ALL_TREATMENT_SLIDES: TreatmentSlideItem[] = [
  // Page 1
  {
    id: "blanqueamiento",
    num: "01",
    tag: "TRATAMIENTOS ESTÉTICOS",
    title: "Blanqueamiento Dental",
    description: "Tu camino de vuelta a una sonrisa blanca y luminosa.",
    image: "/images/treatments_real/blanqueamiento.jpg",
    link: "/tratamientos#estetica"
  },
  {
    id: "ortodoncia",
    num: "02",
    tag: "TRATAMIENTOS ESTÉTICOS",
    title: "Ortodoncia",
    description: "Alineación perfecta para una sonrisa saludable y estética.",
    image: "/images/treatments_real/ortodoncia.jpg",
    link: "/tratamientos#ortodoncia"
  },
  {
    id: "implantes",
    num: "03",
    tag: "ESPECIALIDADES",
    title: "Implantes Dentales",
    description: "La única solución que reemplaza la raíz para una sensación 100% natural.",
    image: "/images/treatments_real/implantes.jpg",
    link: "/tratamientos#implantes"
  },
  {
    id: "radiografias",
    num: "04",
    tag: "TRATAMIENTOS GENERALES",
    title: "Radiografías",
    description: "Diagnóstico preciso, tratamiento efectivo.",
    image: "/images/treatments_real/radiografias.jpg",
    link: "/tratamientos#diagnostico"
  },

  // Page 2
  {
    id: "extraccion",
    num: "05",
    tag: "TRATAMIENTOS GENERALES",
    title: "Extracción Dental",
    description: "Extracciones seguras sin complicaciones, con recuperación rápida.",
    image: "/images/treatments_real/extraccion.jpg",
    link: "/tratamientos#cirugia"
  },
  {
    id: "invisalign",
    num: "06",
    tag: "TRATAMIENTOS ESTÉTICOS",
    title: "Invisalign",
    description: "Alineación dental invisible con brackets Invisalign.",
    image: "/images/treatments_real/invisalign.jpg",
    link: "/tratamientos#invisalign"
  },
  {
    id: "coronas",
    num: "07",
    tag: "TRATAMIENTOS",
    title: "Coronas Dentales",
    description: "Fundas protésicas que restauran o pretegen dientes debilitados.",
    image: "/images/treatments_real/coronas.jpg",
    link: "/tratamientos#protesis"
  },
  {
    id: "revision",
    num: "08",
    tag: "PREVENCIÓN",
    title: "Revisión Dental",
    description: "La importancia de las revisiones dentales periódicas.",
    image: "/images/treatments_real/revision.jpg",
    link: "/tratamientos#preventiva"
  },

  // Page 3
  {
    id: "protesis",
    num: "09",
    tag: "ESPECIALIDADES",
    title: "Prótesis dentales",
    description: "Solución versátil para reemplazar dientes, apoyada en tu estructura natural.",
    image: "/images/treatments_real/protesis.jpg",
    link: "/tratamientos#protesis"
  },
  {
    id: "limpieza",
    num: "10",
    tag: "PREVENCIÓN",
    title: "Limpieza Dental",
    description: "Prevención experta para encías sanas y aliento fresco.",
    image: "/images/treatments_real/limpieza.jpg",
    link: "/tratamientos#preventiva"
  },
  {
    id: "bruxismo",
    num: "11",
    tag: "TRATAMIENTOS",
    title: "Protector Bucal (Bruxismo)",
    description: "Férulas a medida que protegen tus dientes del rechinar nocturno.",
    image: "/images/treatments_real/bruxismo.jpg",
    link: "/tratamientos#bruxismo"
  },
  {
    id: "endodoncia",
    num: "12",
    tag: "ESPECIALIDADES",
    title: "Endodoncia",
    description: "Salva tus dientes dañados y elimina el dolor de raíz.",
    image: "/images/treatments_real/implantes.jpg",
    link: "/tratamientos#endodoncia"
  }
];

export function EspecialidadesTratamientosCarousel() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(ALL_TREATMENT_SLIDES.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = ALL_TREATMENT_SLIDES.slice(startIndex, startIndex + itemsPerPage);

  const goToPrev = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : totalPages));
  };

  const goToNext = () => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : 1));
  };

  return (
    <section className="bg-[#faf8f5] text-[#141413] py-24 px-4 sm:px-6 lg:px-8 border-b border-[#e5e0d5]">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header (Clean, Restrained, Editorial) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#e5e0d5] pb-6">
          <div className="space-y-2">
            <span className="text-[11px] font-mono tracking-[0.22em] text-[#78736a] uppercase block">
              CUADERNO CLÍNICO · 12 DISCIPLINAS ODONTOLÓGICAS
            </span>
            <h2 className="text-3xl sm:text-4xl font-normal tracking-[-0.03em] text-[#141413]">
              Especialidades y Tratamientos
            </h2>
            <p className="text-xs sm:text-sm text-[#66635d] font-light max-w-xl">
              Atención dental integral y estética bajo un protocolo médico riguroso y personalizado.
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
          {currentItems.map((item) => (
            <Link
              key={item.id}
              href={item.link}
              className="group flex flex-col justify-between border border-[#e5e0d5] bg-white p-5 hover:border-[#141413] transition-all duration-300"
            >
              <div className="space-y-4">
                {/* Top Number & Tag */}
                <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-[#78736a] pb-2 border-b border-[#f0ede6]">
                  <span>Nº {item.num}</span>
                  <span className="uppercase text-[#141413] font-semibold">{item.tag}</span>
                </div>

                {/* Image */}
                <div className="relative w-full h-[180px] bg-[#f5f2eb] overflow-hidden border border-[#e5e0d5]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                  />
                </div>

                {/* Text Info */}
                <div className="space-y-1.5 pt-1">
                  <h3 className="text-base font-normal tracking-tight text-[#141413] group-hover:text-neutral-950 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#66635d] font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#f0ede6] mt-4 flex items-center justify-between text-[11px] font-mono tracking-wider text-[#78736a] group-hover:text-[#141413]">
                <span>Consultar</span>
                <span>→</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom Pagination Bar (< 1 2 3 > matching reference) */}
        <div className="flex items-center justify-center space-x-4 pt-4 border-t border-[#e5e0d5]">
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
