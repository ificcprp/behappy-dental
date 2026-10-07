"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { CLINIC_INFO, createWhatsAppUrl } from "@/data/clinicInfo";
import { getCMSData, CMSData } from "@/lib/cmsStore";
import { getCurrentSession, clearCurrentSession } from "@/lib/authService";
import { UserProfile } from "@/types/auth";
import { Menu, X, ArrowUpRight } from "lucide-react";

export function Navbar() {
  const [clinicInfo, setClinicInfo] = useState(CLINIC_INFO);
  const [sessionUser, setSessionUser] = useState<UserProfile | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isDark = pathname === "/tratamientos" || pathname === "/portal";

  useEffect(() => {
    setSessionUser(getCurrentSession());

    const cms = getCMSData();
    if (cms?.clinicInfo) setClinicInfo(cms.clinicInfo);

    const handleUpdate = (e: Event) => {
      const custom = (e as CustomEvent<CMSData>).detail;
      if (custom?.clinicInfo) setClinicInfo(custom.clinicInfo);
      else setClinicInfo(getCMSData().clinicInfo);
    };

    window.addEventListener("behappy_cms_updated", handleUpdate);
    return () => window.removeEventListener("behappy_cms_updated", handleUpdate);
  }, [pathname]);

  const navLinks = [
    { name: "Inicio", href: "/" },
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
    <header
      className={`sticky top-0 z-50 transition-colors ${
        isDark
          ? "bg-black text-white border-b border-neutral-900"
          : "bg-[#faf8f5] text-[#141413] border-b border-[#e5e0d5]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          
          {/* Brand Mark (Left) */}
          <Link href="/" className="flex items-center gap-3 group">
            <div
              className={`relative w-9 h-9 rounded-full overflow-hidden border p-0.5 shadow-sm group-hover:scale-105 transition-transform duration-200 ${
                isDark ? "bg-black border-neutral-800" : "bg-white border-[#ded9cd]"
              }`}
            >
              <Image
                src="/images/brand/logo.png"
                alt="Centro Dental BeHappy"
                fill
                className="object-cover rounded-full"
                priority
              />
            </div>
            <div>
              <span
                className={`text-[15px] font-normal tracking-tight block leading-none ${
                  isDark ? "text-white" : "text-[#141413]"
                }`}
              >
                Centro Dental BeHappy
              </span>
              <span
                className={`text-[9px] font-mono tracking-[0.2em] uppercase block mt-1 ${
                  isDark ? "text-neutral-400" : "text-[#78736a]"
                }`}
              >
                Ñuñoa · Suecia 3580
              </span>
            </div>
          </Link>

          {/* Desktop Navigation (Center) */}
          <nav className="hidden md:flex items-center space-x-7 lg:space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-[11px] font-mono tracking-[0.18em] uppercase transition-colors duration-150 py-1 ${
                    isDark
                      ? isActive
                        ? "text-white font-semibold underline underline-offset-8 decoration-2 decoration-purple-500"
                        : "text-neutral-400 hover:text-white"
                      : isActive
                      ? "text-[#141413] font-semibold underline underline-offset-8 decoration-1 decoration-[#141413]"
                      : "text-[#66635d] hover:text-[#141413]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Desk */}
          <div className="hidden md:flex items-center space-x-2.5">
            {sessionUser ? (
              <>
                <Link
                  href={`/portal?role=${sessionUser.role}`}
                  className={`px-3 py-1.5 text-[11px] font-mono tracking-wider uppercase transition border flex items-center gap-1.5 ${
                    isDark
                      ? "border-neutral-700 bg-neutral-900 text-white hover:border-white"
                      : "border-[#141413] bg-[#141413] text-[#faf8f5] hover:bg-black"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Portal ({sessionUser.role})</span>
                </Link>
                <button
                  onClick={() => {
                    clearCurrentSession();
                    setSessionUser(null);
                    window.location.href = "/";
                  }}
                  className={`px-2 py-1.5 text-[10px] font-mono tracking-widest uppercase transition ${
                    isDark ? "text-neutral-400 hover:text-white" : "text-[#78736a] hover:text-[#141413]"
                  }`}
                  title="Cerrar sesión"
                >
                  Salir
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`px-2.5 py-1.5 text-[11px] font-mono tracking-widest uppercase transition ${
                    isDark
                      ? "text-neutral-300 hover:text-white"
                      : "text-[#66635d] hover:text-[#141413]"
                  }`}
                >
                  Acceso
                </Link>
                <Link
                  href="/portal"
                  className={`px-3 py-1.5 text-[11px] font-mono tracking-widest uppercase transition border ${
                    isDark
                      ? "border-neutral-800 text-neutral-300 hover:bg-neutral-900 hover:border-neutral-600 hover:text-white"
                      : "border-[#cfc9be] text-[#141413] hover:bg-[#eae5da] hover:border-[#141413]"
                  }`}
                >
                  Portal Clínico
                </Link>
              </>
            )}

            <button
              onClick={handleScrollToBooking}
              className={`px-3.5 py-1.5 text-[11px] font-mono tracking-widest uppercase transition font-medium ${
                isDark
                  ? "bg-white text-black hover:bg-neutral-200"
                  : "bg-[#141413] text-[#faf8f5] hover:bg-black"
              }`}
            >
              Reservar Cita
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex md:hidden items-center space-x-2">
            <Link
              href={sessionUser ? `/portal?role=${sessionUser.role}` : "/portal"}
              className={`px-2.5 py-1 text-[10px] font-mono tracking-wider uppercase border ${
                isDark
                  ? "border-neutral-800 text-neutral-300"
                  : "border-[#cfc9be] text-[#141413]"
              }`}
            >
              {sessionUser ? `Portal (${sessionUser.role})` : "Portal"}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-1.5 focus:outline-none ${
                isDark ? "text-neutral-300 hover:text-white" : "text-[#141413] hover:text-black"
              }`}
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden border-t px-4 pt-3 pb-6 space-y-4 ${
            isDark ? "bg-black border-neutral-900 text-white" : "bg-[#faf8f5] border-[#e5e0d5] text-[#141413]"
          }`}
        >
          <div className="space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-2.5 text-xs font-mono tracking-widest uppercase border-b ${
                    isDark
                      ? isActive
                        ? "text-white font-bold border-purple-500"
                        : "text-neutral-400 border-neutral-900"
                      : isActive
                      ? "text-[#141413] font-bold border-[#141413]"
                      : "text-[#66635d] border-[#f0ede6]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            {sessionUser ? (
              <div className="flex items-center justify-between py-2 px-1 border-b border-neutral-800 text-xs font-mono">
                <span className="text-emerald-400 text-[11px]">● {sessionUser.fullName}</span>
                <button
                  onClick={() => {
                    clearCurrentSession();
                    setSessionUser(null);
                    window.location.href = "/";
                  }}
                  className="text-neutral-400 hover:text-white uppercase text-[10px]"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pb-1">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-2 text-center text-xs font-mono tracking-wider uppercase border ${
                    isDark ? "border-neutral-800 text-neutral-300" : "border-[#cfc9be] text-[#141413]"
                  }`}
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/registro"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-2 text-center text-xs font-mono tracking-wider uppercase border ${
                    isDark ? "border-neutral-800 text-neutral-300" : "border-[#cfc9be] text-[#141413]"
                  }`}
                >
                  Crear Cuenta
                </Link>
              </div>
            )}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleScrollToBooking();
              }}
              className={`w-full py-2.5 text-xs font-mono tracking-wider uppercase font-medium ${
                isDark ? "bg-white text-black" : "bg-[#141413] text-white"
              }`}
            >
              Reservar Cita Online
            </button>
            <a
              href={createWhatsAppUrl("Hola Centro Dental BeHappy, me gustaría coordinar una hora de atención.")}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full py-2 text-center text-xs font-mono tracking-wider uppercase border ${
                isDark
                  ? "border-neutral-800 text-neutral-300 hover:text-white"
                  : "border-[#cfc9be] text-[#141413]"
              }`}
            >
              Contactar por WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
