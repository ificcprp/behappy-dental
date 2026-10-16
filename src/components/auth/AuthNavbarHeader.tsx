"use client";

import React from "react";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

interface AuthNavbarHeaderProps {
  onBackUrl?: string;
}

export function AuthNavbarHeader({ onBackUrl = "/" }: AuthNavbarHeaderProps) {
  return (
    <header className="w-full bg-[#faf8f5] px-6 sm:px-10 py-5 flex items-center justify-between border-b border-[#ece7de]">
      <a href={onBackUrl} className="flex items-center gap-3 group">
        <div className="relative w-8 h-8 rounded-full overflow-hidden bg-white p-0.5 border border-[#ded9cd]">
          <Image
            src="/images/brand/logo.png"
            alt="Centro Dental BeHappy"
            fill
            className="object-cover rounded-full"
            priority
          />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-medium tracking-tight text-[#141413]">
            Centro Dental BeHappy
          </span>
          <span className="text-[10px] font-mono tracking-wider uppercase text-[#78736a]">
            Portal Pacientes & Clínico
          </span>
        </div>
      </a>

      <a
        href={onBackUrl}
        className="inline-flex items-center gap-1.5 text-xs text-[#78736a] hover:text-[#141413] transition font-mono tracking-wider uppercase"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Volver a la web</span>
      </a>
    </header>
  );
}
