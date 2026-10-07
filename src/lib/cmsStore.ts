import { TREATMENTS, Treatment } from "@/data/treatments";
import { DOCTORS, Doctor } from "@/data/doctors";
import { CLINIC_INFO } from "@/data/clinicInfo";

export interface CMSPromotion {
  id: string;
  tag: string;
  title: string;
  discount: string;
  description: string;
  badge?: string;
  image: string;
  linkText: string;
  linkHref: string;
}

export interface CMSHero {
  welcomeKicker: string;
  title: string;
  subtitle: string;
  primaryCtaText: string;
  primaryCtaUrl: string;
  secondaryCtaText: string;
  secondaryCtaUrl: string;
  bgImage: string;
}

export interface CMSWelcomeCard {
  id: string;
  number: string;
  tag: string;
  title: string;
  description: string;
  linkText: string;
  linkUrl: string;
}

export interface CMSNewPatientSection {
  tag: string;
  title: string;
  description1: string;
  description2: string;
  buttonText: string;
  buttonUrl: string;
  image: string;
  imageCaption: string;
}

export interface CMSWelcomeSection {
  kicker: string;
  title: string;
  subtitle: string;
  cards: CMSWelcomeCard[];
  newPatient: CMSNewPatientSection;
}

export interface CMSPreventionSection {
  kicker: string;
  title: string;
  quote: string;
  paragraph1: string;
  paragraph2: string;
  ctaText: string;
  ctaUrl: string;
}

export interface CMSData {
  treatments: Treatment[];
  doctors: Doctor[];
  clinicInfo: typeof CLINIC_INFO;
  announcements: string[];
  promotions: CMSPromotion[];
  hero: CMSHero;
  welcomeSection: CMSWelcomeSection;
  preventionSection: CMSPreventionSection;
  heroHeadline: string;
  heroSubheadline: string;
  lastUpdated: string;
}

export const DEFAULT_HERO: CMSHero = {
  welcomeKicker: "Bienvenidos a",
  title: "Centro Dental BeHappy",
  subtitle: "Centro dental en Ñuñoa con la última tecnología y tratamientos de la más alta calidad.",
  primaryCtaText: "Reserva aquí",
  primaryCtaUrl: "https://api.whatsapp.com/send/?phone=56947578597&text&type=phone_number&app_absent=0",
  secondaryCtaText: "Agendar con agendador →",
  secondaryCtaUrl: "#agendar",
  bgImage: "/images/hero-woman.jpg"
};

export const DEFAULT_WELCOME_SECTION: CMSWelcomeSection = {
  kicker: "ACCESOS Y PILARES INSTITUCIONALES",
  title: "Un solo centro, todas las disciplinas de la salud dental.",
  subtitle: "Consulte según su necesidad clínica. El método BeHappy no improvisa: diagnóstico digital, protocolo bioseguro y presupuesto claro desde la primera consulta.",
  cards: [
    {
      id: "card-llegar",
      number: "01",
      tag: "LOCALIZACIÓN & ACCESO",
      title: "Conoce cómo llegar a nuestra clínica",
      description: "Visítanos en Suecia 3580, of. 304, Ñuñoa. A pasos de Metro Chile España (Línea 3).",
      linkText: "Explorar",
      linkUrl: "https://www.instagram.com/p/CktaZC8pojP/"
    },
    {
      id: "card-convenio",
      number: "02",
      tag: "SISTEMA PREVENTIVO",
      title: "Descubre nuestro convenio dental",
      description: "Beneficios del convenio, coberturas escalonadas y tarifas preferenciales para toda la familia.",
      linkText: "Lee sobre nuestro seguro →",
      linkUrl: "/precios"
    },
    {
      id: "card-tratamientos",
      number: "03",
      tag: "CATÁLOGO CLÍNICO",
      title: "Revisa nuestros tratamientos y servicios dentales",
      description: "Desde ortodoncia invisible Invisalign e implantes hasta odontopediatría y blanqueamiento.",
      linkText: "Ver tratamientos →",
      linkUrl: "/tratamientos"
    },
    {
      id: "card-derivaciones",
      number: "04",
      tag: "EQUIPO ACREDITADO",
      title: "¿Necesita un especialista? Recibimos derivaciones",
      description: "8 especialistas registrados en la Superintendencia de Salud con derivaciones en diversas áreas.",
      linkText: "Agenda Aquí →",
      linkUrl: "https://api.whatsapp.com/send/?phone=56947578597&text=Hola%20Centro%20Dental%20BeHappy,%20me%20gustar%C3%ADa%20coordinar%20una%20cita%20con%20un%20especialista.&type=phone_number&app_absent=0"
    }
  ],
  newPatient: {
    tag: "PRIMERA ATENCIÓN & ADMISIÓN",
    title: "¿Nuevo como paciente?\nContáctenos hoy mismo",
    description1: "Cámbiate a nosotros fácilmente. Gestiona y mantén tu salud dental.",
    description2: "Escríbenos directamente para recibir detalles personalizados y resolver tus dudas clínicas.",
    buttonText: "Enviar mensaje por WhatsApp",
    buttonUrl: "https://api.whatsapp.com/send/?phone=56947578597&text=Hola%20Centro%20Dental%20BeHappy,%20soy%20un%20nuevo%20paciente%20y%20me%20gustar%C3%ADa%20recibir%20informaci%C3%B3n%20sobre%20la%20primera%20consulta.&type=phone_number&app_absent=0",
    image: "/images/clinic-interior.jpg",
    imageCaption: "Box Dental · Suecia 3580, Ñuñoa"
  }
};

export const DEFAULT_PREVENTION_SECTION: CMSPreventionSection = {
  kicker: "CRITERIO PREVENTIVO · FILOSOFÍA CLÍNICA",
  title: "Una visita al dentista puede ahorrarte dinero y preservar tu estructura natural.",
  quote: "“La odontología contemporánea ya no consiste en reparar cuando el diente duele, sino en monitorear para que el dolor jamás acontezca.”",
  paragraph1: "Al revisar sus piezas dentales con regularidad mediante diagnóstico clínico e imagenología digital, detectamos caries iniciales y desajustes oclusales antes de que requieran tratamientos de conducto, coronas o extracciones invasivas.",
  paragraph2: "Por lo tanto, postergar la consulta dental suele resultar costoso tanto para la conservación biológica como para su presupuesto familiar. En Centro Dental BeHappy concebimos la prevención como un compromiso ético con cada paciente.",
  ctaText: "Conocer el protocolo de revisión →",
  ctaUrl: "/tratamientos"
};

export const DEFAULT_ANNOUNCEMENTS = [
  "¡Te estábamos esperando con alegría!",
  "La transformación de tu sonrisa comienza aquí con nosotros.",
  "Diseñamos con cuidado tu mejor versión.",
  "Hecho con precisión y un toque transformador.",
  "¡Tú mereces una sonrisa extraordinaria!",
  "Sonríe con calidad, haz que cada una cuente.",
  "Cada tratamiento renueva tu confianza interior.",
  "Nuestra odontología crea legados duraderos de sonrisas.",
  "Cada visita es un nuevo inicio emocionante.",
  "Consulta inicial con evaluaciones digitales avanzadas en Suecia 3580.",
  "Especialistas certificados en Ortodoncia, Implantes y Estética en Ñuñoa.",
];

export const DEFAULT_PROMOTIONS: CMSPromotion[] = [
  {
    id: "promo-seguro",
    tag: "PLAN PREVENTIVO BEHAPPY",
    title: "Seguro Dental Familiar Propio",
    discount: "20% al 60%",
    description: "Cobertura escalonada en todos los procedimientos odontológicos sin letra chica ni copagos abusivos.",
    badge: "Membresía Activa",
    image: "/images/promos/seguro-dental.png",
    linkText: "Lee sobre nuestro seguro",
    linkHref: "/precios"
  },
  {
    id: "promo-evaluacion",
    tag: "CAMPAÑA PRIMER DIAGNÓSTICO",
    title: "Evaluación Clínica Digital + Rx",
    discount: "Sin Costo Inicial",
    description: "Diagnóstico completo con cámara intraoral y radiografía digital para pacientes que inician tratamiento.",
    badge: "Válido este mes",
    image: "/images/promos/promos-vigentes.png",
    linkText: "Explora Promociones Vigentes",
    linkHref: "/#agendar"
  }
];

export const DEFAULT_CMS_DATA: CMSData = {
  treatments: TREATMENTS,
  doctors: DOCTORS,
  clinicInfo: CLINIC_INFO,
  announcements: DEFAULT_ANNOUNCEMENTS,
  promotions: DEFAULT_PROMOTIONS,
  hero: DEFAULT_HERO,
  welcomeSection: DEFAULT_WELCOME_SECTION,
  preventionSection: DEFAULT_PREVENTION_SECTION,
  heroHeadline: "Centro Dental BeHappy",
  heroSubheadline: "Centro dental en Ñuñoa con la última tecnología y tratamientos de la más alta calidad.",
  lastUpdated: new Date().toISOString()
};

const STORAGE_CMS_KEY = "behappy_cms_data";
const CMS_CHANGE_EVENT = "behappy_cms_updated";

export function getCMSData(): CMSData {
  if (typeof window === "undefined") return DEFAULT_CMS_DATA;
  try {
    const raw = localStorage.getItem(STORAGE_CMS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_CMS_KEY, JSON.stringify(DEFAULT_CMS_DATA));
      return DEFAULT_CMS_DATA;
    }
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_CMS_DATA,
      ...parsed,
      treatments: parsed.treatments && parsed.treatments.length > 0 ? parsed.treatments : DEFAULT_CMS_DATA.treatments,
      doctors: parsed.doctors && parsed.doctors.length > 0 ? parsed.doctors : DEFAULT_CMS_DATA.doctors,
      clinicInfo: parsed.clinicInfo ? { ...DEFAULT_CMS_DATA.clinicInfo, ...parsed.clinicInfo } : DEFAULT_CMS_DATA.clinicInfo,
      hero: parsed.hero ? { ...DEFAULT_CMS_DATA.hero, ...parsed.hero } : DEFAULT_CMS_DATA.hero,
      welcomeSection: parsed.welcomeSection ? {
        ...DEFAULT_WELCOME_SECTION,
        ...parsed.welcomeSection,
        cards: parsed.welcomeSection.cards || DEFAULT_WELCOME_SECTION.cards,
        newPatient: { ...DEFAULT_WELCOME_SECTION.newPatient, ...(parsed.welcomeSection.newPatient || {}) }
      } : DEFAULT_WELCOME_SECTION,
      preventionSection: parsed.preventionSection ? { ...DEFAULT_PREVENTION_SECTION, ...parsed.preventionSection } : DEFAULT_PREVENTION_SECTION,
      promotions: parsed.promotions && parsed.promotions.length > 0 ? parsed.promotions.map((p: any, idx: number) => ({
        ...p,
        image: p.image || (idx === 0 ? "/images/promos/seguro-dental.png" : "/images/promos/promos-vigentes.png")
      })) : DEFAULT_PROMOTIONS,
    };
  } catch (err) {
    console.error("Error reading CMS data:", err);
    return DEFAULT_CMS_DATA;
  }
}

export function saveCMSData(data: Partial<CMSData>): CMSData {
  if (typeof window === "undefined") return DEFAULT_CMS_DATA;
  try {
    const current = getCMSData();
    const updated: CMSData = {
      ...current,
      ...data,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_CMS_KEY, JSON.stringify(updated));

    // Dispatch custom event for real-time reactive re-renders
    window.dispatchEvent(new CustomEvent(CMS_CHANGE_EVENT, { detail: updated }));

    // Send async sync to API route
    fetch("/api/cms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated)
    }).catch(() => {
      // Offline or network error handled gracefully
    });

    return updated;
  } catch (err) {
    console.error("Error saving CMS data:", err);
    return DEFAULT_CMS_DATA;
  }
}

export function resetCMSData(): CMSData {
  if (typeof window === "undefined") return DEFAULT_CMS_DATA;
  try {
    localStorage.setItem(STORAGE_CMS_KEY, JSON.stringify(DEFAULT_CMS_DATA));
    window.dispatchEvent(new CustomEvent(CMS_CHANGE_EVENT, { detail: DEFAULT_CMS_DATA }));
    return DEFAULT_CMS_DATA;
  } catch (err) {
    console.error("Error resetting CMS data:", err);
    return DEFAULT_CMS_DATA;
  }
}
