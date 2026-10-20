"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { CLINIC_INFO } from "@/data/clinicInfo";
import { WhatsAppLink } from "./WhatsAppLink";
import { getCMSData, CMSData, DEFAULT_HEADER_CONFIG } from "@/lib/cmsStore";
import { getCurrentSession, clearCurrentSession } from "@/lib/authService";
import { clearClinicalLocalData } from "@/lib/clinicalStore";
import { UserProfile } from "@/types/auth";
import { CMSHeaderConfig } from "@/types/cms";
import { Menu, X, Sparkles, LogOut, ArrowRight, ShieldCheck } from "lucide-react";

export interface NavbarProps {
  initialHeaderConfig?: CMSHeaderConfig;
  initialClinicInfo?: typeof CLINIC_INFO;
}

export function Navbar({ initialHeaderConfig, initialClinicInfo }: NavbarProps = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const [clinicInfo, setClinicInfo] = useState(initialClinicInfo || CLINIC_INFO);
  const [headerConfig, setHeaderConfig] = useState<CMSHeaderConfig>(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("behappy_cms_data_v2");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed?.headerConfig) {
            return { ...(initialHeaderConfig || DEFAULT_HEADER_CONFIG), ...parsed.headerConfig };
          }
        }
      } catch {}
    }
    return initialHeaderConfig || DEFAULT_HEADER_CONFIG;
  });
  const [sessionUser, setSessionUser] = useState<UserProfile | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [systemIsDark, setSystemIsDark] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemIsDark(mq.matches);

    const handler = (e: MediaQueryListEvent) => setSystemIsDark(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    setSessionUser(getCurrentSession());

    const cms = getCMSData();
    if (cms?.clinicInfo) setClinicInfo(cms.clinicInfo);
    if (cms?.headerConfig) {
      setHeaderConfig((prev) => {
        if (
          prev.logoSize === cms.headerConfig.logoSize &&
          prev.desktopHeight === cms.headerConfig.desktopHeight &&
          prev.colorScheme === cms.headerConfig.colorScheme &&
          prev.linksSpacing === cms.headerConfig.linksSpacing &&
          prev.fontSize === cms.headerConfig.fontSize &&
          prev.navAlignment === cms.headerConfig.navAlignment &&
          prev.layout === cms.headerConfig.layout &&
          prev.showBrandText === cms.headerConfig.showBrandText &&
          prev.fontFamily === cms.headerConfig.fontFamily
        ) {
          return prev;
        }
        return { ...prev, ...cms.headerConfig };
      });
    }

    const handleUpdate = (e: Event) => {
      const custom = (e as CustomEvent<CMSData>).detail;
      const nextClinic = custom?.clinicInfo || getCMSData()?.clinicInfo;
      const nextHeader = custom?.headerConfig || getCMSData()?.headerConfig;
      if (nextClinic) setClinicInfo(nextClinic);
      if (nextHeader) {
        setHeaderConfig((prev) => {
          if (
            prev.logoSize === nextHeader.logoSize &&
            prev.desktopHeight === nextHeader.desktopHeight &&
            prev.colorScheme === nextHeader.colorScheme &&
            prev.linksSpacing === nextHeader.linksSpacing &&
            prev.fontSize === nextHeader.fontSize &&
            prev.navAlignment === nextHeader.navAlignment &&
            prev.layout === nextHeader.layout &&
            prev.showBrandText === nextHeader.showBrandText &&
            prev.fontFamily === nextHeader.fontFamily
          ) {
            return prev;
          }
          return { ...prev, ...nextHeader };
        });
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

  const effectiveScheme: "blanco" | "negro" =
    headerConfig.colorScheme === "sistema"
      ? (systemIsDark ? "negro" : "blanco")
      : (headerConfig.colorScheme || "blanco");
  const isDark = effectiveScheme === "negro";

  const safeLogoSize = Math.max(Number(headerConfig?.logoSize) || 52, 36);
  const safeDesktopHeight = Math.max(Number(headerConfig?.desktopHeight) || 84, safeLogoSize + 16);

  return (
    <header
      style={{
        minHeight: `${safeDesktopHeight}px`,
      }}
      className={`${
        headerConfig.isSticky ? "sticky top-0" : "relative"
      } z-50 transition-colors duration-200 border-b ${
        isDark
          ? headerConfig.enableBlur
            ? "bg-[#0e0e0d]/95 backdrop-blur-md border-[#262421] text-[#faf8f5]"
            : "bg-[#0e0e0d] border-[#262421] text-[#faf8f5]"
          : headerConfig.enableBlur
          ? "bg-[#faf8f5]/95 backdrop-blur-md border-[#e5e0d5] text-[#141413]"
          : "bg-[#faf8f5] border-[#e5e0d5] text-[#141413]"
      }`}
    >
      <div className="max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        
        {/* Contenedor con altura y aire configurables */}
        <div
          style={{
            minHeight: `${safeDesktopHeight}px`,
            height: headerConfig.layout === "centered" ? "auto" : `${safeDesktopHeight}px`,
          }}
          className={`flex items-center justify-between ${
            headerConfig.layout === "centered" ? "lg:flex-col lg:justify-center lg:py-4 gap-2" : ""
          }`}
        >
          
          {/* Logo Institucional BeHappy con jerarquía y escala optimizada */}
          <a
            href="/"
            className="flex items-center gap-3 group shrink-0 mr-4 lg:mr-6 xl:mr-8"
          >
            <div
              style={{
                width: `${safeLogoSize}px`,
                height: `${safeLogoSize}px`,
              }}
              className={`relative rounded-full overflow-hidden p-0.5 shadow-2xs group-hover:scale-105 transition-transform duration-200 shrink-0 ${
                isDark ? "bg-neutral-900 border border-neutral-700" : "bg-white border border-[#ded9cd]"
              }`}
            >
              <Image
                src="/images/brand/logo.png"
                alt="Centro Dental BeHappy"
                fill
                sizes="(max-width: 768px) 42px, 80px"
                className="object-cover rounded-full"
                priority
              />
            </div>

            {headerConfig.showBrandText && (
              <div className="flex flex-col whitespace-nowrap shrink-0">
                <span
                  className={`text-[15px] sm:text-[16px] xl:text-[17px] font-semibold tracking-tight leading-none transition-colors ${
                    isDark ? "text-[#faf8f5] group-hover:text-white" : "text-[#141413] group-hover:text-black"
                  }`}
                >
                  Centro Dental BeHappy
                </span>
                <span
                  className={`text-[10px] font-mono tracking-[0.22em] uppercase mt-1.5 block transition-colors ${
                    isDark ? "text-[#a8a398]" : "text-[#78736a]"
                  }`}
                >
                  Ñuñoa · Suecia 3580
                </span>
              </div>
            )}
          </a>

          {/* Navegación Desktop con aire generoso */}
          {!headerConfig.burgerOnDesktop && (
            <nav
              style={{
                columnGap: `clamp(10px, 1.6vw, ${headerConfig.linksSpacing || 28}px)`,
              }}
              className={`hidden lg:flex items-center min-w-0 ${
                headerConfig.layout === "split"
                  ? "ml-auto mr-6 shrink-0"
                  : headerConfig.layout === "centered"
                  ? "justify-center flex-1 mx-4"
                  : headerConfig.navAlignment === "left"
                  ? "mr-auto justify-start ml-2"
                  : headerConfig.navAlignment === "right"
                  ? "ml-auto justify-end mr-6"
                  : "justify-center flex-1 mx-2 lg:mx-4 xl:mx-8"
              }`}
            >
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    style={{
                      fontSize: `${headerConfig.fontSize || 12}px`,
                      letterSpacing: headerConfig.letterSpacing || "0.14em",
                      textTransform: headerConfig.textTransform || "uppercase",
                      fontFamily: getLinkFontFamily(),
                    }}
                    className={`transition-colors duration-150 py-1.5 px-1 relative whitespace-nowrap shrink-0 ${
                      isActive
                        ? isDark
                          ? "text-[#faf8f5] font-bold border-b-2 border-[#faf8f5]"
                          : "text-[#141413] font-bold border-b-2 border-[#141413]"
                        : isDark
                        ? "text-[#a8a398] hover:text-[#faf8f5] font-normal"
                        : "text-[#66635d] hover:text-[#141413] font-normal"
                    }`}
                  >
                    {link.name}
                  </a>
                );
              })}

            </nav>
          )}

          {/* Acciones de la Derecha: Jerarquía clara (Portal Clínico Real + Cita) */}
          <div className="hidden lg:flex items-center space-x-2.5 sm:space-x-3 shrink-0 ml-auto pl-2">
            {sessionUser ? (
              <>
                <a
                  href={`/portal?role=${sessionUser.role}`}
                  className={`px-3.5 py-2 text-xs font-mono tracking-wider uppercase rounded-xs flex items-center gap-2 shadow-2xs transition whitespace-nowrap shrink-0 ${
                    isDark
                      ? "border border-white/30 bg-white/10 text-white hover:bg-white/20"
                      : "border border-[#141413] bg-[#141413] text-[#faf8f5] hover:bg-black"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  <span>Portal ({sessionUser.role})</span>
                </a>
                <button
                  onClick={() => {
                    clearClinicalLocalData();
                    clearCurrentSession();
                    setSessionUser(null);
                    window.location.href = "/";
                  }}
                  className={`p-2 transition shrink-0 ${isDark ? "text-[#a8a398] hover:text-white" : "text-[#78736a] hover:text-[#141413]"}`}
                  title="Cerrar sesión"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <a
                href="/login"
                className={`px-3.5 xl:px-4 py-2 text-xs font-mono tracking-wider uppercase rounded-xs transition font-medium whitespace-nowrap shrink-0 ${
                  isDark
                    ? "border border-[#3e3b35] text-[#faf8f5] hover:border-white hover:bg-white/10"
                    : "border border-[#cfc9be] text-[#141413] hover:border-[#141413] hover:bg-[#ece7de]/60"
                }`}
              >
                {headerConfig.portalButtonText || "Portal Clínico"}
              </a>
            )}

            {/* Botón Principal CTA: Reservar Cita */}
            <button
              onClick={handleScrollToBooking}
              className={`px-3.5 xl:px-4 py-2 text-xs font-mono tracking-wider uppercase rounded-xs font-medium shadow-2xs transition whitespace-nowrap shrink-0 ${
                isDark
                  ? "bg-[#faf8f5] hover:bg-white text-[#141413]"
                  : "bg-[#141413] hover:bg-black text-[#faf8f5]"
              }`}
            >
              {headerConfig.bookingButtonText || "Reservar Cita"}
            </button>
          </div>

          {/* Botón Hamburguesa (Móvil o Desktop si burgerOnDesktop está activo) */}
          <div className={`flex ${headerConfig.burgerOnDesktop ? "" : "lg:hidden"} items-center space-x-2`}>
            <a
              href={sessionUser ? `/portal?role=${sessionUser.role}` : "/login"}
              className={`px-2.5 py-1 text-[10px] font-mono tracking-wider uppercase rounded-xs ${
                isDark
                  ? "border border-[#3e3b35] text-[#faf8f5]"
                  : "border border-[#cfc9be] text-[#141413]"
              }`}
            >
              {sessionUser ? `Portal (${sessionUser.role})` : "Portal"}
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 focus:outline-none transition ${
                isDark ? "text-[#faf8f5] hover:text-white" : "text-[#141413] hover:text-black"
              }`}
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
          className={`border-t transition-colors duration-200 ${
            isDark
              ? "border-[#262421] bg-[#0e0e0d] text-[#faf8f5]"
              : "border-[#e5e0d5] bg-[#faf8f5] text-[#141413]"
          } ${
            headerConfig.mobileMenuType === "drawer-right"
              ? "fixed inset-y-0 right-0 w-80 max-w-[85vw] z-50 shadow-2xl p-6 overflow-y-auto animate-in slide-in-from-right duration-200"
              : headerConfig.mobileMenuType === "drawer-left"
              ? "fixed inset-y-0 left-0 w-80 max-w-[85vw] z-50 shadow-2xl p-6 overflow-y-auto animate-in slide-in-from-left duration-200"
              : "px-6 pt-4 pb-8 space-y-5 animate-in fade-in duration-200"
          }`}
        >
          {/* Cabecera del drawer si es lateral */}
          {(headerConfig.mobileMenuType === "drawer-right" || headerConfig.mobileMenuType === "drawer-left") && (
            <div
              className={`flex items-center justify-between pb-4 border-b mb-4 ${
                isDark ? "border-[#262421]" : "border-[#e5e0d5]"
              }`}
            >
              <span className="text-xs font-bold uppercase tracking-wider font-mono">
                Menú BeHappy
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className={`p-1 ${isDark ? "text-[#a8a398] hover:text-white" : "text-[#78736a] hover:text-[#141413]"}`}
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
                  className={`block py-3 text-xs font-mono tracking-widest uppercase transition border-b ${
                    isDark
                      ? `border-[#262421] ${isActive ? "text-white font-bold" : "text-[#a8a398] hover:text-white"}`
                      : `border-[#f0ede6] ${isActive ? "text-[#141413] font-bold" : "text-[#66635d] hover:text-[#141413]"}`
                  }`}
                >
                  {link.name}
                </a>
              );
            })}

          </div>

          {/* Botones de acción móvil */}
          <div className="pt-3 space-y-2.5">
            {sessionUser ? (
              <div
                className={`flex items-center justify-between py-2 px-1 border-b text-xs font-mono ${
                  isDark ? "border-[#262421]" : "border-[#e5e0d5]"
                }`}
              >
                <span className="text-[11px] font-bold text-emerald-400">● {sessionUser.fullName}</span>
                <button
                  onClick={() => {
                    clearClinicalLocalData();
                    clearCurrentSession();
                    setSessionUser(null);
                    window.location.href = "/";
                  }}
                  className={`uppercase text-[10px] font-mono ${
                    isDark ? "text-[#a8a398] hover:text-white" : "text-[#78736a] hover:text-[#141413]"
                  }`}
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <a
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className={`block w-full py-3 text-center text-xs font-mono tracking-wider uppercase rounded-xs font-medium ${
                  isDark
                    ? "border border-[#3e3b35] text-[#faf8f5] hover:bg-white/10"
                    : "border border-[#cfc9be] text-[#141413]"
                }`}
              >
                {headerConfig.portalButtonText || "Portal Clínico (Modo Real)"}
              </a>
            )}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleScrollToBooking();
              }}
              className={`w-full py-3 text-xs font-mono tracking-wider uppercase rounded-xs font-medium shadow-xs ${
                isDark
                  ? "bg-[#faf8f5] text-[#141413] hover:bg-white"
                  : "bg-[#141413] text-[#faf8f5]"
              }`}
            >
              {headerConfig.bookingButtonText || "Reservar Cita Online"}
            </button>

            <WhatsAppLink
              message="Hola Centro Dental BeHappy, me gustaría coordinar una hora de atención en Suecia 3580."
              className={`block w-full py-2.5 text-center text-xs font-mono tracking-wider uppercase rounded-xs ${
                isDark
                  ? "border border-[#3e3b35] text-[#a8a398] hover:text-white"
                  : "border border-[#cfc9be] text-[#141413]"
              }`}
            >
              Contactar por WhatsApp
            </WhatsAppLink>
          </div>
        </div>
      )}
    </header>
  );
}
