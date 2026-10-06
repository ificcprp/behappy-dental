"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { DOCTORS, Doctor } from "@/data/doctors";
import { getCMSData, CMSData } from "@/lib/cmsStore";
import { createWhatsAppUrl } from "@/data/clinicInfo";

export function DoctorsSection() {
  const [doctorsList, setDoctorsList] = useState<Doctor[]>(DOCTORS);

  useEffect(() => {
    const cms = getCMSData();
    if (cms?.doctors && cms.doctors.length > 0) {
      setDoctorsList(cms.doctors);
    }

    const handleUpdate = (e: Event) => {
      const custom = (e as CustomEvent<CMSData>).detail;
      if (custom?.doctors && custom.doctors.length > 0) {
        setDoctorsList(custom.doctors);
      } else {
        setDoctorsList(getCMSData().doctors);
      }
    };

    window.addEventListener("behappy_cms_updated", handleUpdate);
    return () => window.removeEventListener("behappy_cms_updated", handleUpdate);
  }, []);

  const handleSelectDoctor = (doctor: Doctor) => {
    const el = document.getElementById("agendar");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="nosotros" className="py-24 bg-[#faf8f5] text-[#141413] border-b border-[#e5e0d5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="space-y-3">
          <span className="text-[11px] font-mono tracking-[0.22em] text-[#78736a] uppercase block">
            CUERPO MÉDICO · SUPERINTENDENCIA DE SALUD
          </span>
          <h2 className="text-3xl sm:text-5xl font-normal tracking-[-0.03em] text-[#141413]">
            Especialistas del Centro Dental
          </h2>
          <p className="text-sm sm:text-base text-[#66635d] font-light max-w-2xl leading-relaxed">
            Un equipo multidisciplinario con más de 13 años de experiencia en Santiago, dedicado a la excelencia clínica, la precisión técnica y la atención personalizada sin dolor.
          </p>
        </div>

        {/* Doctors Grid (Editorial Medical Directory) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {doctorsList.map((doc) => (
            <div
              key={doc.id}
              className="group flex flex-col justify-between border border-[#e5e0d5] bg-white p-5 hover:border-[#141413] transition-colors"
            >
              <div className="space-y-4">
                {/* Photo container */}
                <div className="relative h-64 w-full bg-[#f5f2eb] overflow-hidden border border-[#e5e0d5]">
                  <Image
                    src={doc.image}
                    alt={doc.name}
                    fill
                    className="object-cover object-top filter grayscale contrast-[1.05] group-hover:grayscale-0 transition-all duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                </div>

                {/* Info */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono tracking-widest text-[#78736a] uppercase block">
                    {doc.role}
                  </span>
                  <h3 className="text-base font-normal tracking-tight text-[#141413]">
                    {doc.name}
                  </h3>
                  <p className="text-xs text-[#141413] font-medium">
                    {doc.specialty}
                  </p>
                  <p className="text-xs text-[#66635d] font-light leading-relaxed pt-1">
                    {doc.description}
                  </p>
                </div>
              </div>

              {/* Action */}
              <div className="pt-4 border-t border-[#f0ede6] mt-4 flex items-center justify-between">
                <button
                  onClick={() => handleSelectDoctor(doc)}
                  className="text-[11px] font-mono tracking-wider uppercase text-[#141413] font-semibold underline underline-offset-4 decoration-1"
                >
                  Agendar hora →
                </button>
                <span className="text-[10px] font-mono text-[#78736a]">{doc.schedule.split(" ")[0]}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
