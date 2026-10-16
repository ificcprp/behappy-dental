"use client";

import React from "react";
import Image from "next/image";
import { CheckCircle2, ShieldCheck, HeartHandshake, Phone, Sparkles } from "lucide-react";
import { CLINIC_INFO, createWhatsAppUrl } from "@/data/clinicInfo";

export function AuthSplitBrandHero() {
  const whatsappUrl = createWhatsAppUrl(
    "Hola, necesito asistencia para ingresar al Portal de Centro Dental BeHappy."
  );

  return (
    <div className="relative hidden lg:flex lg:col-span-5 flex-col justify-between overflow-hidden bg-[#0d131f] text-white p-10 xl:p-14 border-r border-[#1f2937]">
      {/* Background Photography with Sophisticated Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/clinic-interior.jpg"
          alt="Clínica BeHappy Ñuñoa"
          fill
          className="object-cover opacity-25 scale-105 transition-transform duration-1000 ease-out"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1d] via-[#0a0f1d]/90 to-[#0a0f1d]/70" />
      </div>

      {/* Top Branding Section */}
      <div className="relative z-10 space-y-6">
        <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-[#38bdf8]" />
          <span className="text-[10px] font-mono tracking-widest uppercase text-slate-200">
            Odontología de Precisión · Ñuñoa
          </span>
        </div>

        <div className="space-y-3">
          <h2 className="text-3xl xl:text-4xl font-light tracking-tight text-white leading-tight">
            Tu sonrisa en manos de <span className="font-serif italic text-white/95">especialistas acreditados</span>.
          </h2>
          <p className="text-xs text-slate-300 font-light leading-relaxed max-w-md">
            Accede a tu ficha clínica digital, historial de atenciones SOAP, odontograma 3D, convenios y presupuestos transparentes en un solo lugar.
          </p>
        </div>
      </div>

      {/* Center Medical Trust Badges */}
      <div className="relative z-10 py-8 space-y-3.5 border-y border-white/10 my-6">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 w-5 h-5 rounded-full bg-[#0284c7]/20 border border-[#0284c7]/40 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#38bdf8]" />
          </div>
          <div>
            <h4 className="text-xs font-medium text-white">Trazabilidad Clínica Digital</h4>
            <p className="text-[11px] text-slate-400">Evoluciones y notas SOAP seguras bajo Ley 20.584.</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="mt-0.5 w-5 h-5 rounded-full bg-[#059669]/20 border border-[#059669]/40 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-xs font-medium text-white">Odontograma & Presupuesto Claro</h4>
            <p className="text-[11px] text-slate-400">Sin costos ocultos, con aranceles Fonasa, Isapre y Club BeHappy.</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="mt-0.5 w-5 h-5 rounded-full bg-slate-500/20 border border-slate-500/40 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-300" />
          </div>
          <div>
            <h4 className="text-xs font-medium text-white">Sede Ñuñoa · Suecia 3580</h4>
            <p className="text-[11px] text-slate-400">Más de 13 años al servicio de la salud bucal comunitaria.</p>
          </div>
        </div>
      </div>

      {/* Bottom Direct Assistance Support */}
      <div className="relative z-10 pt-2 flex items-center justify-between gap-4 text-xs">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
            ¿Dudas o necesitas asistencia?
          </span>
          <span className="text-xs text-slate-200">Recepción BeHappy disponible</span>
        </div>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#25D366] hover:bg-[#20ba59] text-white text-[11px] font-medium transition shadow-sm"
        >
          <Phone className="w-3 h-3" />
          <span>WhatsApp Box</span>
        </a>
      </div>
    </div>
  );
}
