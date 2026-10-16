"use client";

import React from "react";
import Image from "next/image";
import { ArrowLeft, ShieldCheck, MapPin } from "lucide-react";

interface AuthNavbarHeaderProps {
  onBackUrl?: string;
  isDemoMode?: boolean;
  onToggleDemoMode?: () => void;
}

export function AuthNavbarHeader({
  onBackUrl = "/",
  isDemoMode,
  onToggleDemoMode,
}: AuthNavbarHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-[#faf8f5]/95 backdrop-blur-md border-b border-[#e5e0d5] px-4 sm:px-6 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand Ident */}
        <a href={onBackUrl} className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 rounded-full overflow-hidden bg-white p-0.5 border border-[#ded9cd] shadow-xs group-hover:scale-105 transition-transform">
            <Image
              src="/images/brand/logo.png"
              alt="Centro Dental BeHappy"
              fill
              className="object-cover rounded-full"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold tracking-tight text-[#141413] group-hover:text-black">
              Centro Dental BeHappy
            </span>
            <span className="text-[10px] font-mono tracking-wider uppercase text-[#78736a]">
              Portal Clínico & Pacientes OS
            </span>
          </div>
        </a>

        {/* Center: Security Badge (Desktop only) */}
        <div className="hidden md:flex items-center gap-4 text-[11px] font-mono text-[#78736a]">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#f0ede6]/60 border border-[#e5e0d5]">
            <MapPin className="w-3.5 h-3.5 text-[#0284c7]" />
            <span>Sede Ñuñoa · Suecia 3580</span>
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Acceso Seguro Cifrado SSL</span>
          </span>
        </div>

        {/* Right Actions: Back to Web */}
        <div className="flex items-center gap-3">
          {onToggleDemoMode && (
            <button
              onClick={onToggleDemoMode}
              className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded border transition-colors ${
                isDemoMode
                  ? "bg-amber-100 text-amber-900 border-amber-300 font-bold"
                  : "bg-white text-neutral-600 border-neutral-300 hover:border-neutral-900"
              }`}
              title="Alternar entre vista de producción y accesos rápidos de presentación"
            >
              {isDemoMode ? "Modo Demo Activo" : "Sandbox Demo"}
            </button>
          )}

          <a
            href={onBackUrl}
            className="flex items-center gap-1.5 text-xs font-mono tracking-wider uppercase text-[#78736a] hover:text-[#141413] px-3 py-1.5 rounded border border-transparent hover:border-[#ded9cd] transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Volver a la Web</span>
            <span className="sm:hidden">Salir</span>
          </a>
        </div>

      </div>
    </header>
  );
}
