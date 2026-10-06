import { Metadata } from "next";
import Image from "next/image";
import { AppointmentBookingSection } from "@/components/dental/AppointmentBookingSection";

export const metadata: Metadata = {
  title: "Galería Clínica & Instalaciones | Centro Dental BeHappy Ñuñoa",
  description:
    "Registro fotográfico de Centro Dental BeHappy en Suecia 3580, Ñuñoa: boxes clínicos de última generación, ortodoncia Invisalign, implantes y estética restauradora.",
};

const GALLERY_ARCHIVE = [
  {
    code: "ARCH-01",
    title: "Box Clínico Principal & Ergonomía Dental",
    category: "Infraestructura",
    src: "/images/clinic-interior.jpg",
    desc: "Sillones odontológicos ergonómicos, iluminación LED de campo quirúrgico y sistemas de bioseguridad certificados.",
  },
  {
    code: "ARCH-02",
    title: "Ortodoncia Invisible Invisalign & Brackets",
    category: "Ortodoncia",
    src: "/images/treatments_real/invisalign.jpg",
    desc: "Planificación digital 3D y alineadores removibles transparentes para corrección oclusal y armonía estética.",
  },
  {
    code: "ARCH-03",
    title: "Blanqueamiento Dental en Consulta",
    category: "Estética",
    src: "/images/treatments_real/blanqueamiento.jpg",
    desc: "Protocolo de aclaramiento dental seguro con peróxido supervisado y protección gingival aislada.",
  },
  {
    code: "ARCH-04",
    title: "Implantología Oseointegrada de Titanio",
    category: "Cirugía",
    src: "/images/treatments_real/implantes.jpg",
    desc: "Reemplazo radicular definitivo con fijaciones biocompatibles para restaurar función masticatoria y estética.",
  },
  {
    code: "ARCH-05",
    title: "Imagenología y Radiología Digital",
    category: "Diagnóstico",
    src: "/images/treatments_real/radiografias.jpg",
    desc: "Captura radiográfica intraoral instantánea con emisión radiológica de mínima dosis para diagnósticos inmediatos.",
  },
  {
    code: "ARCH-06",
    title: "Rehabilitación Oral & Coronas de Zirconio",
    category: "Rehabilitación",
    src: "/images/treatments_real/coronas.jpg",
    desc: "Estructuras cerámicas monolíticas de alta resistencia y translucidez idéntica al esmalte dental natural.",
  },
  {
    code: "ARCH-07",
    title: "Higiene y Profilaxis Profunda",
    category: "Prevención",
    src: "/images/treatments_real/limpieza.jpg",
    desc: "Destartraje supragingival con ultrasonido y pulido coronario con pasta profiláctica fluorada.",
  },
  {
    code: "ARCH-08",
    title: "Tratamiento de Bruxismo & Planos Oclusales",
    category: "ATM & Oclusión",
    src: "/images/treatments_real/bruxismo.jpg",
    desc: "Planos de relajación miotensivos confeccionados a medida para proteger articulación temporomandibular y esmalte.",
  },
];

export default function GaleriaPage() {
  return (
    <div className="bg-[#faf8f5] text-[#141413]">
      {/* Editorial Header */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-3 border-b border-[#e5e0d5]">
        <span className="text-[11px] font-mono tracking-[0.24em] text-[#78736a] uppercase block">
          REGISTRO FOTOGRÁFICO & ESPACIOS CLÍNICOS · SUECIA 3580
        </span>
        <h1 className="text-4xl sm:text-6xl font-normal tracking-[-0.03em] text-[#141413]">
          Galería Clínica y Procedimientos
        </h1>
        <p className="text-base text-[#66635d] font-light max-w-2xl leading-relaxed">
          Documentación de nuestras instalaciones en la comuna de Ñuñoa, equipamiento biomédico y casos clínicos de ortodoncia, rehabilitación y prevención dental.
        </p>
      </div>

      {/* Gallery Grid (Clean Architectural Ledger) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-[#e5e0d5]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {GALLERY_ARCHIVE.map((item, idx) => (
            <div
              key={idx}
              className="border border-[#e5e0d5] bg-white p-5 hover:border-[#141413] transition-colors flex flex-col justify-between group"
            >
              <div className="space-y-4">
                {/* Meta Top Line */}
                <div className="flex items-center justify-between border-b border-[#f0ede6] pb-2.5">
                  <span className="text-[10px] font-mono tracking-[0.18em] text-[#78736a] uppercase">
                    {item.code}
                  </span>
                  <span className="text-[10px] font-mono tracking-widest text-[#141413] uppercase">
                    {item.category}
                  </span>
                </div>

                {/* Photo Frame */}
                <div className="relative h-56 w-full bg-[#f5f2eb] overflow-hidden border border-[#e5e0d5]">
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                </div>

                {/* Caption */}
                <div className="space-y-1.5">
                  <h3 className="text-sm font-normal tracking-tight text-[#141413]">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#5d5952] font-light leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#f0ede6]">
                <span className="text-[10px] font-mono tracking-widest uppercase text-[#78736a]">
                  Centro Dental BeHappy · Ñuñoa
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Appointment Desk */}
      <AppointmentBookingSection />
    </div>
  );
}
