"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { CLINIC_INFO, createWhatsAppUrl } from "@/data/clinicInfo";

export function Footer() {
  return (
    <footer className="bg-[#0a0a0c] text-[#f4f4f6] text-xs border-t border-[#1f1f26] pt-16 pb-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top 4-Column Directory */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 items-start">
          
          {/* Col 1: Brand & Identity */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
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
            </Link>

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
                <Link href="/tratamientos" className="hover:text-white transition">
                  Tratamientos & Especialidades
                </Link>
              </li>
              <li>
                <Link href="/precios" className="hover:text-white transition">
                  Precios & Convenio BeHappy
                </Link>
              </li>
              <li>
                <Link href="/nosotros" className="hover:text-white transition">
                  Cuerpo Médico (8 Especialistas)
                </Link>
              </li>
              <li>
                <Link href="/galeria" className="hover:text-white transition">
                  Galería & Casos Clínicos
                </Link>
              </li>
              <li>
                <Link href="/portal" className="hover:text-white transition">
                  Portal Clínico (4 Roles)
                </Link>
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
                <strong className="text-white block font-normal">Suecia 3580, OF. 304</strong>
                Ñuñoa, Santiago, Chile
              </p>
              <p className="pt-1">
                <strong className="text-white block font-normal">WhatsApp / Teléfono:</strong>
                <a href="tel:56947578597" className="hover:text-white font-mono">
                  +56 9 4757 8597
                </a>
              </p>
              <p>
                <strong className="text-white block font-normal">Correo:</strong>
                <a href="mailto:ceobehappy@gmail.com" className="hover:text-white font-mono">
                  ceobehappy@gmail.com
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
                  href="https://www.instagram.com/dentalbehappynunoa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition flex items-center gap-1.5"
                >
                  Instagram ↗
                </a>
              </li>
              <li>
                <a
                  href="https://api.whatsapp.com/send/?phone=56947578597&text&type=phone_number&app_absent=0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition flex items-center gap-1.5"
                >
                  WhatsApp ↗
                </a>
              </li>
              <li>
                <a
                  href="https://maps.google.com/?q=Suecia+3580+Nunoa+Santiago"
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
