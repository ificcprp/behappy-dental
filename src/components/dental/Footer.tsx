"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { CLINIC_INFO } from "@/data/clinicInfo";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { getCMSData, CMSData } from "@/lib/cmsStore";

export function Footer() {
  const pathname = usePathname();
  const [clinicInfo, setClinicInfo] = useState(CLINIC_INFO);

  useEffect(() => {
    const cms = getCMSData();
    if (cms?.clinicInfo) setClinicInfo(cms.clinicInfo);

    const handleUpdate = (e: Event) => {
      const custom = (e as CustomEvent<CMSData>).detail;
      if (custom?.clinicInfo) setClinicInfo(custom.clinicInfo);
      else setClinicInfo(getCMSData().clinicInfo);
    };

    window.addEventListener("behappy_cms_updated", handleUpdate);
    return () => window.removeEventListener("behappy_cms_updated", handleUpdate);
  }, []);

  if (pathname?.startsWith("/portal") || pathname === "/login" || pathname === "/registro" || pathname === "/demo") return null;

  const phoneClean =
    (clinicInfo.contact.phoneClean || clinicInfo.contact.phone || "").replace(/[^0-9]/g, "");
  const whatsappHref = buildWhatsAppUrl("", clinicInfo.contact.whatsappNumber);
  const mapsHref =
    clinicInfo.address.googleMapsDirectUrl ||
    `https://maps.google.com/?q=${encodeURIComponent(
      `${clinicInfo.address.street} ${clinicInfo.address.commune} ${clinicInfo.address.city}`
    )}`;
  const instagramHref = clinicInfo.contact.instagram || "https://www.instagram.com/dentalbehappynunoa";

  return (
    <footer className="bg-[#0a0a0c] text-[#f4f4f6] text-xs border-t border-[#1f1f26] pt-16 pb-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top 4-Column Directory */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 items-start">
          
          {/* Col 1: Brand & Identity */}
          <div className="lg:col-span-4 space-y-4">
            <a href="/" className="flex items-center gap-3 group">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white p-0.5 border border-neutral-700">
                <Image
                  src="/images/brand/logo.png"
                  alt="Centro Dental BeHappy"
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <div>
                <h3 className="text-base font-semibold tracking-tight text-white leading-tight">
                  Centro Dental BeHappy
                </h3>
                <span className="text-[10px] font-mono tracking-[0.16em] text-neutral-400 uppercase">
                  Odontología Avanzada · Ñuñoa
                </span>
              </div>
            </a>

            <p className="text-xs text-neutral-400 font-light leading-relaxed max-w-sm">
              Más de 13 años brindando atención odontológica integral, estética y preventiva en la comuna de Ñuñoa, con especialistas acreditados en la Superintendencia de Salud.
            </p>
          </div>

          {/* Col 2: Navegación Editorial */}
          <div className="lg:col-span-3 space-y-3">
            <span className="text-[10px] font-mono tracking-[0.2em] text-neutral-400 uppercase block">
              DIRECTORIO CLÍNICO
            </span>
            <ul className="space-y-2 text-xs font-mono text-neutral-300">
              <li>
                <a href="/tratamientos" className="hover:text-white transition">
                  Tratamientos & Especialidades
                </a>
              </li>
              <li>
                <a href="/precios" className="hover:text-white transition">
                  Precios & Convenio BeHappy
                </a>
              </li>
              <li>
                <a href="/club" className="hover:text-white transition">
                  Club BeHappy (Planes de Membresía)
                </a>
              </li>
              <li>
                <a href="/nosotros" className="hover:text-white transition">
                  Cuerpo Médico Especialista
                </a>
              </li>
              <li>
                <a href="/galeria" className="hover:text-white transition">
                  Galería & Casos Clínicos
                </a>
              </li>
              <li>
                <a href="/portal" className="hover:text-white transition">
                  Portal Clínico
                </a>
              </li>
              <li>
                <a href="/demo" className="hover:text-amber-300 transition text-amber-400 font-medium">
                  Demo OS (4 Roles) ↗
                </a>
              </li>
              <li>
                <a href="/login" className="hover:text-white transition text-neutral-400">
                  Acceso / Iniciar Sesión ↗
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Contacto & Sede */}
          <div className="lg:col-span-3 space-y-3">
            <span className="text-[10px] font-mono tracking-[0.2em] text-neutral-400 uppercase block">
              SEDE & CONTACTO
            </span>
            <div className="space-y-2 text-xs text-neutral-300 font-light">
              <p>
                <strong className="text-white block font-normal">{clinicInfo.address.street}</strong>
                {clinicInfo.address.commune}, {clinicInfo.address.city}, {clinicInfo.address.country}
              </p>
              <p className="pt-1">
                <strong className="text-white block font-normal">WhatsApp / Teléfono:</strong>
                <a href={`tel:${phoneClean}`} className="hover:text-white font-mono">
                  {clinicInfo.contact.phone}
                </a>
              </p>
              <p>
                <strong className="text-white block font-normal">Correo:</strong>
                <a href={`mailto:${clinicInfo.contact.email}`} className="hover:text-white font-mono">
                  {clinicInfo.contact.email}
                </a>
              </p>
            </div>
          </div>

          {/* Col 4: Canales Digitales */}
          <div className="lg:col-span-2 space-y-3">
            <span className="text-[10px] font-mono tracking-[0.2em] text-neutral-400 uppercase block">
              CANALES OFICIALES
            </span>
            <ul className="space-y-2 text-xs font-mono text-neutral-300">
              <li>
                <a
                  href={instagramHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition flex items-center gap-1.5"
                >
                  Instagram ↗
                </a>
              </li>
              <li>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition flex items-center gap-1.5"
                >
                  WhatsApp ↗
                </a>
              </li>
              <li>
                <a
                  href={mapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition flex items-center gap-1.5"
                >
                  Google Maps ↗
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Hairline divider & Copyright */}
        <div className="pt-8 border-t border-[#1f1f26] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-neutral-400">
          <p>© 2026 Centro Dental BeHappy SpA. Todos los derechos reservados.</p>
          <p className="text-neutral-500">
            Odontología con rigor clínico y diseño editorial · Ñuñoa, Chile.
          </p>
        </div>

      </div>
    </footer>
  );
}
