import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import { Toaster } from "sonner";
import { TopAnnouncementTicker } from "@/components/dental/TopAnnouncementTicker";
import { Navbar } from "@/components/dental/Navbar";
import { Footer } from "@/components/dental/Footer";
import { WhatsAppFloatingButton } from "@/components/dental/WhatsAppFloatingButton";
import { getPublishedCMS, parseTimeRange } from "@/lib/cmsServer";
import { DEFAULT_HERO } from "@/lib/cmsStore";
import "./globals.css";

export const revalidate = 300;

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

const DEFAULT_TITLE = "Centro Dental BeHappy Ñuñoa | Odontología Avanzada y Citas Online";
const DEFAULT_DESCRIPTION =
  "Centro Dental BeHappy en Ñuñoa (Suecia 3580). Especialistas en Ortodoncia Invisalign, Implantes Dentales, Diseño de Sonrisa, Odontopediatría y Prevención con más de 13 años de experiencia.";

export async function generateMetadata(): Promise<Metadata> {
  const cms = await getPublishedCMS();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://behappydental.cl";
  const customHeroTitle = cms.hero?.title && cms.hero.title !== DEFAULT_HERO.title;
  const title = customHeroTitle ? `${cms.hero.title} | Centro Dental BeHappy Ñuñoa` : DEFAULT_TITLE;
  const description = cms.hero?.subtitle || DEFAULT_DESCRIPTION;

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords: [
      "centro dental en ñuñoa",
      "dentista ñuñoa",
      "invisalign santiago",
      "implantes dentales ñuñoa",
      "blanqueamiento dental",
      "odontologia estetica santiago",
      "Centro Dental BeHappy"
    ],
    authors: [{ name: cms.clinicInfo.name || "Centro Dental BeHappy" }],
    openGraph: {
      title: cms.hero?.title || "Centro Dental BeHappy Ñuñoa | Sonrisas Felices",
      description,
      url: siteUrl,
      siteName: cms.clinicInfo.name || "Centro Dental BeHappy",
      images: [
        {
          url: cms.hero?.bgImage || "/images/brand/logo.png",
          width: 800,
          height: 800,
          alt: cms.clinicInfo.name || "Centro Dental BeHappy Ñuñoa"
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
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cms = await getPublishedCMS();
  const { clinicInfo } = cms;

  const weekdayHours = parseTimeRange(clinicInfo.hours?.weekdays, { opens: "10:00", closes: "20:00" });
  const saturdayHours = parseTimeRange(clinicInfo.hours?.saturday, { opens: "10:00", closes: "18:00" });
  const sundayHours = parseTimeRange(clinicInfo.hours?.sunday, null);

  const openingHoursSpecification: Array<Record<string, unknown>> = [];
  if (weekdayHours) {
    openingHoursSpecification.push({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: weekdayHours.opens,
      closes: weekdayHours.closes,
    });
  }
  if (saturdayHours) {
    openingHoursSpecification.push({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday"],
      opens: saturdayHours.opens,
      closes: saturdayHours.closes,
    });
  }
  if (sundayHours) {
    openingHoursSpecification.push({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Sunday"],
      opens: sundayHours.opens,
      closes: sundayHours.closes,
    });
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: clinicInfo.name || "Centro Dental BeHappy",
    image: "https://behappydental.cl/images/brand/logo.png",
    "@id": "https://behappydental.cl",
    url: "https://behappydental.cl",
    telephone: clinicInfo.contact?.phoneClean
      ? `+${clinicInfo.contact.phoneClean.replace(/^\+/, "")}`
      : "+56947578597",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: clinicInfo.address?.street || "Suecia 3580, OF. 304",
      addressLocality: clinicInfo.address?.commune || "Ñuñoa",
      addressRegion: clinicInfo.address?.region || "Región Metropolitana",
      addressCountry: "CL",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -33.4542,
      longitude: -70.6015,
    },
    openingHoursSpecification,
    sameAs: [clinicInfo.contact?.instagram || "https://www.instagram.com/dentalbehappynunoa"],
  };

  return (
    <html lang="es-CL">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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
