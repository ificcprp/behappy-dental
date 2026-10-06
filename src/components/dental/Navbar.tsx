"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { CLINIC_INFO, createWhatsAppUrl } from "@/data/clinicInfo";
import { Menu, X, ArrowUpRight } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Tratamientos", href: "/tratamientos" },
    { name: "Precios", href: "/precios" },
    { name: "Nosotros", href: "/nosotros" },
    { name: "Galería", href: "/galeria" },
    { name: "Contacto", href: "/contacto" },
  ];

  const handleScrollToBooking = () => {
    const el = document.getElementById("agendar");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = "/#agendar";
    }
  };

  return (
    <header className="bg-[#faf8f5] text-[#141413] border-b border-[#e5e0d5] sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          
          {/* Brand Mark (Left) */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 rounded-full overflow-hidden bg-white border border-[#ded9cd] p-0.5 shadow-sm group-hover:scale-105 transition-transform duration-200">
              <Image
                src="/images/brand/logo.png"
                alt="Centro Dental BeHappy"
                fill
                className="object-cover rounded-full"
                priority
              />
            </div>
            <div>
              <span className="text-[15px] font-normal tracking-tight text-[#141413] block leading-none">
                Centro Dental BeHappy
              </span>
              <span className="text-[9px] font-mono tracking-[0.2em] text-[#78736a] uppercase block mt-1">
                Ñuñoa · Suecia 3580
              </span>
            </div>
          </Link>

          {/* Desktop Navigation (Center) */}
          <nav className="hidden md:flex items-center space-x-7 lg:space-x-9">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-[11px] font-mono tracking-[0.18em] uppercase transition-colors duration-150 py-1 ${
                    isActive
                      ? "text-[#141413] font-semibold underline underline-offset-8 decoration-1 decoration-[#141413]"
                      : "text-[#66635d] hover:text-[#141413]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Desk (Editorial Boxed Buttons) */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              href="/portal"
              className="border border-[#cfc9be] px-3.5 py-1.5 text-[11px] font-mono tracking-widest text-[#141413] uppercase hover:bg-[#eae5da] hover:border-[#141413] transition"
            >
              Portal Clínico
            </Link>
            <button
              onClick={handleScrollToBooking}
              className="bg-[#141413] text-[#faf8f5] px-4 py-1.5 text-[11px] font-mono tracking-widest uppercase hover:bg-black transition font-medium"
            >
              Reservar Cita
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex md:hidden items-center space-x-2">
            <Link
              href="/portal"
              className="border border-[#cfc9be] px-2.5 py-1 text-[10px] font-mono tracking-wider text-[#141413] uppercase"
            >
              Portal
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-[#141413] hover:text-black focus:outline-none"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer (Warm Paper) */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#faf8f5] border-t border-[#e5e0d5] px-6 py-6 space-y-4">
          <nav className="space-y-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block text-xs font-mono tracking-[0.16em] uppercase py-1.5 ${
                    isActive ? "text-[#141413] font-bold underline underline-offset-4" : "text-[#66635d]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-[#e5e0d5] space-y-2">
            <Link
              href="/portal"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center border border-[#141413] py-2.5 text-xs font-mono tracking-widest uppercase text-[#141413]"
            >
              Acceso a Portal Clínico (4 Roles)
            </Link>
            <a
              href="https://api.whatsapp.com/send/?phone=56947578597&text&type=phone_number&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-[#141413] text-[#faf8f5] py-2.5 text-xs font-mono tracking-widest uppercase font-bold"
            >
              Reserva por WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
