import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import { Toaster } from "sonner";
import { TopAnnouncementTicker } from "@/components/dental/TopAnnouncementTicker";
import { Navbar } from "@/components/dental/Navbar";
import { Footer } from "@/components/dental/Footer";
import { WhatsAppFloatingButton } from "@/components/dental/WhatsAppFloatingButton";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#faf8f5",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://behappydental.cl"),
  title: "Centro Dental BeHappy Ñuñoa | Odontología Avanzada y Citas Online",
  description:
    "Centro Dental BeHappy en Ñuñoa (Suecia 3580). Especialistas en Ortodoncia Invisalign, Implantes Dentales, Diseño de Sonrisa, Odontopediatría y Prevención con más de 13 años de experiencia.",
  keywords: [
    "centro dental en ñuñoa",
    "dentista ñuñoa",
    "invisalign santiago",
    "implantes dentales ñuñoa",
    "blanqueamiento dental",
    "odontologia estetica santiago",
    "Centro Dental BeHappy"
  ],
  authors: [{ name: "Centro Dental BeHappy" }],
  openGraph: {
    title: "Centro Dental BeHappy Ñuñoa | Sonrisas Felices",
    description: "Tratamientos odontológicos avanzados con tecnología de punta en Ñuñoa. Agenda tu hora online.",
    url: "https://behappydental.cl",
    siteName: "Centro Dental BeHappy",
    images: [
      {
        url: "/images/brand/logo.png",
        width: 800,
        height: 800,
        alt: "Centro Dental BeHappy Ñuñoa"
      }
    ],
    locale: "es_CL",
    type: "website",
  },
  icons: {
    icon: "/images/brand/logo.png",
    apple: "/images/brand/logo.png"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-CL">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} min-h-screen bg-[#faf8f5] text-[#141413] font-sans antialiased selection:bg-[#141413] selection:text-[#faf8f5]`}
      >
        <TopAnnouncementTicker />
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <WhatsAppFloatingButton />
        <Toaster position="top-right" richColors theme="light" />
      </body>
    </html>
  );
}
