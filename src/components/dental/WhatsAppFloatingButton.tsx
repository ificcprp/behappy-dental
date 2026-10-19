"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useWhatsAppUrl, useFloatingWhatsAppMessage } from "./WhatsAppLink";
import { MessageCircle } from "lucide-react";

export function WhatsAppFloatingButton() {
  const pathname = usePathname();
  const floatingMsg = useFloatingWhatsAppMessage();
  const whatsappLink = useWhatsAppUrl(floatingMsg);

  if (pathname?.startsWith("/portal") || pathname === "/login" || pathname === "/registro" || pathname === "/demo") return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp a Centro Dental BeHappy"
        className="group flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white shadow-lg transition-transform duration-200 hover:scale-105 focus:outline-none"
      >
        <MessageCircle className="w-8 h-8 fill-current text-white" />
      </a>
    </div>
  );
}
