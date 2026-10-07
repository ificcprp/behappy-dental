"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { TopAnnouncementTicker } from "@/components/dental/TopAnnouncementTicker";
import { Navbar } from "@/components/dental/Navbar";
import { Footer } from "@/components/dental/Footer";
import { WhatsAppFloatingButton } from "@/components/dental/WhatsAppFloatingButton";

interface PublicLayoutWrapperProps {
  children: React.ReactNode;
}

export function PublicLayoutWrapper({ children }: PublicLayoutWrapperProps) {
  const pathname = usePathname();
  
  // The clinical portal is a dedicated standalone medical application:
  // It should never render public marketing headers, announcement tickers, footers, or public floating buttons.
  const isPortalApp = pathname.startsWith("/portal");

  if (isPortalApp) {
    return <main className="min-h-screen bg-[#f8fafc] text-[#0f172a]">{children}</main>;
  }

  return (
    <>
      <TopAnnouncementTicker />
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <WhatsAppFloatingButton />
    </>
  );
}
