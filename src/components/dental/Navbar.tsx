"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { CLINIC_INFO, createWhatsAppUrl } from "@/data/clinicInfo";
import { getCMSData, CMSData, DEFAULT_HEADER_CONFIG } from "@/lib/cmsStore";
import { getCurrentSession, clearCurrentSession } from "@/lib/authService";
import { UserProfile } from "@/types/auth";
import { CMSHeaderConfig } from "@/types/cms";
import { Menu, X, Sparkles, LogOut, ArrowRight, ShieldCheck } from "lucide-react";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [clinicInfo, setClinicInfo] = useState(CLINIC_INFO);
  const [headerConfig, setHeaderConfig] = useState<CMSHeaderConfig>(DEFAULT_HEADER_CONFIG);
  const [sessionUser, setSessionUser] = useState<UserProfile | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).__nextRouter = router;
    }
    setSessionUser(getCurrentSession());

    const cms = getCMSData();
    if (cms?.clinicInfo) setClinicInfo(cms.clinicInfo);
    if (cms?.headerConfig) setHeaderConfig(cms.headerConfig);

    const handleUpdate = (e: Event) => {
      const custom = (e as CustomEvent<CMSData>).detail;
      if (custom?.clinicInfo) setClinicInfo(custom.clinicInfo);
      if (custom?.headerConfig) setHeaderConfig(custom.headerConfig);
      else {
        const fresh = getCMSData();
        if (fresh?.headerConfig) setHeaderConfig(fresh.headerConfig);
      }
    };

    window.addEventListener("behappy_cms_updated", handleUpdate);
    return () => window.removeEventListener("behappy_cms_updated", handleUpdate);
  }, [pathname, router]);

  const navLinks = [
    { name: "Inicio", href: "/" },
    { name: "Tratamientos", href: "/tratamientos" },
    { name: "Precios", href: "/precios" },
    { name: "Club BeHappy", href: "/club" },
    { name: "Nosotros", href: "/nosotros" },
    { name: "Galería", href: "/galeria" },
    { name: "Contacto", href: "/contacto" },
  ];

  const handleScrollToBooking = () => {
    const el = document.getElementById("agendar");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push("/#agendar");
    }
  };

  // Ocultar navbar en vistas especializadas que usan su propio encabezado o layout independiente
  if (
    pathname?.startsWith("/portal") ||
    pathname === "/login" ||
    pathname === "/registro" ||
    pathname === "/demo"
  ) {
    return null;
  }

  // Estilos tipográficos dinámicos de los enlaces
  const getLinkFontFamily = () => {
    if (headerConfig.fontFamily === "serif") return "var(--font-newsreader), Georgia, serif";
    if (headerConfig.fontFamily === "sans") return "var(--font-geist-sans), system-ui, sans-serif";
    return "var(--font-geist-mono), monospace";
  };

  return (
    <header
      className={`${
        headerConfig.isSticky ? "sticky top-0" : "relative"
      } z-50 transition-colors border-b border-[#e5e0d5] ${
        headerConfig.enableBlur ? "bg-[#faf8f5]/95 backdrop-blur-md" : "bg-[#faf8f5]"
      } text-[#141413]`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Contenedor con altura y aire configurables */}
        <div
          style={{
            height: `${headerConfig.desktopHeight}px`,
          }}
          className={`flex items-center justify-between transition-all ${
            headerConfig.layout === "centered" ? "lg:flex-col lg:justify-center lg:py-2" : ""
          }`}
        >
          
          {/* Logo Institucional BeHappy con jerarquía y escala optimizada */}
          <a href="/" className="flex items-center gap-3.5 group flex-shrink-0">
            <div
              style={{
                width: `${headerConfig.logoSize}px`,
                height: `${headerConfig.logoSize}px`,
              }}
              className="relative rounded-full overflow-hidden bg-white border border-[#ded9cd] p-0.5 shadow-2xs group-hover:scale-105 transition-transform duration-200 flex-shrink-0"
            >
              <Image
                src="/images/brand/logo.png"
                alt="Centro Dental BeHappy"
                fill
                className="object-cover rounded-full"
                priority
              />
            </div>

            {headerConfig.showBrandText && (
              <div className="flex flex-col">
                <span className="text-[16px] sm:text-[17px] font-semibold tracking-tight text-[#141413] leading-none group-hover:text-black">
                  Centro Dental BeHappy
                </span>
                <span className="text-[10px] font-mono tracking-[0.22em] uppercase text-[#78736a] mt-1.5 block">
                  Ñuñoa · Suecia 3580
                </span>
              </div>
            )}
          </a>

          {/* Navegación Desktop con aire generoso */}
          {!headerConfig.burgerOnDesktop && (
            <nav
              style={{
                gap: `${headerConfig.linksSpacing}px`,
              }}
              className={`hidden ${
                headerConfig.layout === "split" ? "lg:flex" : "md:flex"
              } items-center`}
            >
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    style={{
                      fontSize: `${headerConfig.fontSize}px`,
                      letterSpacing: headerConfig.letterSpacing,
                      textTransform: headerConfig.textTransform,
                      fontFamily: getLinkFontFamily(),
                    }}
                    className={`transition-colors duration-150 py-1.5 relative ${
                      isActive
                        ? "text-[#141413] font-bold border-b-2 border-[#141413]"
                        : "text-[#66635d] hover:text-[#141413] font-normal"
                    }`}
                  >
                    {link.name}
                  </a>
                );
              })}

              {/* Modo Demo explicitado en la barra de navegación */}
              {headerConfig.showDemoButton && (
                <a
                  href="/demo"
                  style={{
                    fontSize: `${headerConfig.fontSize}px`,
                    letterSpacing: headerConfig.letterSpacing,
                    textTransform: headerConfig.textTransform,
                    fontFamily: getLinkFontFamily(),
                  }}
                  className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-900 hover:bg-amber-500/20 hover:border-amber-500 transition-colors inline-flex items-center gap-1.5 font-bold shadow-2xs"
                  title="Explorar la suite interactiva de presentación para inversionistas (4 Roles)"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                  <span>{headerConfig.demoButtonText || "Demo OS (4 Roles)"}</span>
                </a>
              )}
            </nav>
          )}

          {/* Acciones de la Derecha: Jerarquía clara (Portal Clínico Real + Cita) */}
          <div className="hidden md:flex items-center space-x-3 flex-shrink-0">
            {sessionUser ? (
              <>
                <a
                  href={`/portal?role=${sessionUser.role}`}
                  className="px-3.5 py-2 text-xs font-mono tracking-wider uppercase border border-[#141413] bg-[#141413] text-[#faf8f5] hover:bg-black rounded-xs flex items-center gap-2 shadow-2xs transition"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Portal ({sessionUser.role})</span>
                </a>
                <button
                  onClick={() => {
                    clearCurrentSession();
                    setSessionUser(null);
                    window.location.href = "/";
                  }}
                  className="p-2 text-[#78736a] hover:text-[#141413] transition"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <a
                href="/login"
                className="px-4 py-2 text-xs font-mono tracking-wider uppercase border border-[#cfc9be] text-[#141413] hover:border-[#141413] hover:bg-[#ece7de]/60 rounded-xs transition font-medium"
              >
                {headerConfig.portalButtonText || "Portal Clínico"}
              </a>
            )}

            {/* Botón Principal CTA: Reservar Cita */}
            <button
              onClick={handleScrollToBooking}
              className="px-4 py-2 text-xs font-mono tracking-wider uppercase bg-[#141413] hover:bg-black text-[#faf8f5] rounded-xs font-medium shadow-2xs transition"
            >
              {headerConfig.bookingButtonText || "Reservar Cita"}
            </button>
          </div>

          {/* Botón Hamburguesa (Móvil o Desktop si burgerOnDesktop está activo) */}
          <div className={`flex ${headerConfig.burgerOnDesktop ? "" : "md:hidden"} items-center space-x-2`}>
            <a
              href={sessionUser ? `/portal?role=${sessionUser.role}` : "/login"}
              className="px-2.5 py-1 text-[10px] font-mono tracking-wider uppercase border border-[#cfc9be] text-[#141413] rounded-xs"
            >
              {sessionUser ? `Portal (${sessionUser.role})` : "Portal"}
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#141413] hover:text-black focus:outline-none"
              aria-label="Abrir menú de navegación"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Menú Desplegable Móvil / Panel Drawer */}
      {mobileMenuOpen && (
        <div
          className={`border-t border-[#e5e0d5] bg-[#faf8f5] text-[#141413] ${
            headerConfig.mobileMenuType === "drawer-right"
              ? "fixed inset-y-0 right-0 w-80 max-w-[85vw] z-50 shadow-2xl p-6 overflow-y-auto animate-in slide-in-from-right duration-200"
              : headerConfig.mobileMenuType === "drawer-left"
              ? "fixed inset-y-0 left-0 w-80 max-w-[85vw] z-50 shadow-2xl p-6 overflow-y-auto animate-in slide-in-from-left duration-200"
              : "px-6 pt-4 pb-8 space-y-5 animate-in fade-in duration-200"
          }`}
        >
          {/* Cabecera del drawer si es lateral */}
          {(headerConfig.mobileMenuType === "drawer-right" || headerConfig.mobileMenuType === "drawer-left") && (
            <div className="flex items-center justify-between pb-4 border-b border-[#e5e0d5] mb-4">
              <span className="text-xs font-bold uppercase tracking-wider font-mono">
                Menú BeHappy
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 text-[#78736a] hover:text-[#141413]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Enlaces de navegación */}
          <div className="space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-3 text-xs font-mono tracking-widest uppercase border-b border-[#f0ede6] transition ${
                    isActive ? "text-[#141413] font-bold" : "text-[#66635d] hover:text-[#141413]"
                  }`}
                >
                  {link.name}
                </a>
              );
            })}

            {/* Enlace explícito de Modo Demo en menú móvil */}
            {headerConfig.showDemoButton && (
              <a
                href="/demo"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 text-xs font-mono tracking-widest uppercase text-amber-900 font-bold border-b border-amber-200/60 bg-amber-50/50 px-2 rounded-xs my-2 flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>{headerConfig.demoButtonText || "Demo OS (4 Roles)"}</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-600" />
              </a>
            )}
          </div>

          {/* Botones de acción móvil */}
          <div className="pt-3 space-y-2.5">
            {sessionUser ? (
              <div className="flex items-center justify-between py-2 px-1 border-b border-[#e5e0d5] text-xs font-mono">
                <span className="text-[11px] font-bold text-emerald-700">● {sessionUser.fullName}</span>
                <button
                  onClick={() => {
                    clearCurrentSession();
                    setSessionUser(null);
                    window.location.href = "/";
                  }}
                  className="uppercase text-[10px] font-mono text-[#78736a] hover:text-[#141413]"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <a
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full py-3 text-center text-xs font-mono tracking-wider uppercase border border-[#cfc9be] text-[#141413] rounded-xs font-medium"
              >
                {headerConfig.portalButtonText || "Portal Clínico (Modo Real)"}
              </a>
            )}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleScrollToBooking();
              }}
              className="w-full py-3 text-xs font-mono tracking-wider uppercase bg-[#141413] text-[#faf8f5] rounded-xs font-medium shadow-xs"
            >
              {headerConfig.bookingButtonText || "Reservar Cita Online"}
            </button>

            <a
              href={createWhatsAppUrl("Hola Centro Dental BeHappy, me gustaría coordinar una hora de atención en Suecia 3580.")}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-2.5 text-center text-xs font-mono tracking-wider uppercase border border-[#cfc9be] text-[#141413] rounded-xs"
            >
              Contactar por WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
