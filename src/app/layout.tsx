import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import { Toaster } from "sonner";
import { FlashAlertBanner } from "@/components/dental/FlashAlertBanner";
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
  
  // Custom SEO from CMS if defined
  const seo = cms.seoMarketing;
  const title = seo?.metaTitle?.trim()
    ? seo.metaTitle.trim()
    : (customHeroTitle ? `${cms.hero.title} | Centro Dental BeHappy Ñuñoa` : DEFAULT_TITLE);

  const description = seo?.metaDescription?.trim()
    ? seo.metaDescription.trim()
    : (cms.hero?.subtitle || DEFAULT_DESCRIPTION);

  const ogTitle = seo?.ogTitle?.trim() ? seo.ogTitle.trim() : title;
  const ogDescription = seo?.ogDescription?.trim() ? seo.ogDescription.trim() : description;

  const rawOgImage = seo?.ogImage?.trim();
  const ogImage = rawOgImage
    ? (rawOgImage.startsWith("http") ? rawOgImage : `${siteUrl}${rawOgImage}`)
    : (cms.hero?.bgImage ? `${siteUrl}${cms.hero.bgImage}` : `${siteUrl}/images/brand/logo.png`);

  const keywords = Array.isArray(seo?.keywords) && seo.keywords.length > 0
    ? seo.keywords
    : (typeof (seo?.keywords as unknown) === "string" && (seo?.keywords as unknown as string).trim()
      ? (seo?.keywords as unknown as string).split(",").map((k: string) => k.trim()).filter(Boolean)
      : [
          "centro dental en ñuñoa",
          "dentista ñuñoa",
          "invisalign santiago",
          "implantes dentales ñuñoa",
          "blanqueamiento dental",
          "odontologia estetica santiago",
          "Centro Dental BeHappy"
        ]);

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords,
    authors: [{ name: cms.clinicInfo.name || "Centro Dental BeHappy" }],
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: siteUrl,
      siteName: cms.clinicInfo.name || "Centro Dental BeHappy",
      images: [
        {
          url: ogImage,
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
  const { clinicInfo, seoMarketing } = cms;

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

  const gaId = seoMarketing?.googleAnalyticsId?.trim();
  const pixelId = seoMarketing?.metaPixelId?.trim();

  return (
    <html lang="es-CL">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {gaId && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${gaId}');`,
              }}
            />
          </>
        )}
        {pixelId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '${pixelId}');fbq('track', 'PageView');`,
            }}
          />
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} min-h-screen bg-[#faf8f5] text-[#141413] font-sans antialiased selection:bg-[#141413] selection:text-[#faf8f5]`}
      >
        <FlashAlertBanner />
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
