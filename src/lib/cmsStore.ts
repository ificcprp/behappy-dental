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

export interface CMSMembershipPlan {
  id: string;
  name: string;
  tag: string;
  monthlyPrice: number;
  monthlyPriceDisplay: string;
  annualPriceDisplay?: string;
  billingPeriod: string;
  description: string;
  popular?: boolean;
  badge?: string;
  features: string[];
  ctaText: string;
  ctaWhatsappMessage: string;
  ctaUrl?: string;
  coverageHighlight: string;
}

export interface CMSData {
  treatments: Treatment[];
  doctors: Doctor[];
  clinicInfo: typeof CLINIC_INFO;
  announcements: string[];
  promotions: CMSPromotion[];
  membershipPlans: CMSMembershipPlan[];
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
      tag: "MEMBRESÍA PREVENTIVA",
      title: "Descubre el Club Familiar BeHappy",
      description: "Planes mensuales y anuales con limpiezas y radiografías $0 copago y hasta 50% en arancel clínico.",
      linkText: "Ver planes del Club →",
      linkUrl: "/club"
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
    tag: "MEMBRESÍA PREVENTIVA BEHAPPY",
    title: "Club Dental Familiar Propio",
    discount: "40% al 55%",
    description: "Planes de cuidado continuo con 2 limpiezas anuales $0 copago, radiografías incluidas y arancel preferente sin letra chica.",
    badge: "Club BeHappy",
    image: "/images/promos/seguro-dental.png",
    linkText: "Ver planes del Club BeHappy",
    linkHref: "/club"
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

export const DEFAULT_MEMBERSHIP_PLANS: CMSMembershipPlan[] = [
  {
    id: "plan-sonrisa",
    name: "Plan BeHappy Sonrisa",
    tag: "INDIVIDUAL · PREVENCIÓN TOTAL",
    monthlyPrice: 14990,
    monthlyPriceDisplay: "$14.990",
    annualPriceDisplay: "$149.900 al año (Ahorra 2 meses)",
    billingPeriod: "mes",
    description: "Cuidado preventivo continuo para adultos y jóvenes profesionales. Elimina gastos imprevistos y mantén tu salud bucal impecable todo el año.",
    popular: false,
    badge: "Activación Día 1",
    features: [
      "2 Limpiezas y Destartrajes al año $0 copago (1ª desde el Día 1 · 2ª al mes 6 o inmediata en plan anual)",
      "Set de Radiografías Bite-wing digitales anuales ($0 copago)",
      "Evaluación y diagnóstico clínico semestral ($0 copago)",
      "1 Atención de Urgencia diurna al año sin costo de consulta",
      "45% arancel preferente en resinas compuestas y tapaduras",
      "40% de descuento en Blanqueamiento dental LED",
      "Sin multas de salida: pausa o cancela antes de tu próximo ciclo"
    ],
    ctaText: "Suscribirme al Plan Sonrisa",
    ctaWhatsappMessage: "Hola Centro Dental BeHappy, me interesa suscribirme al Plan BeHappy Sonrisa ($14.990/mes). ¿Me pueden enviar el link de inscripción?",
    ctaUrl: "",
    coverageHighlight: "2 limpiezas al año + Radiografías $0 copago"
  },
  {
    id: "plan-familia",
    name: "Plan Familia Protegida",
    tag: "TITULAR + 2 CARGAS DIRECTAS",
    monthlyPrice: 32990,
    monthlyPriceDisplay: "$32.990",
    annualPriceDisplay: "$329.900 al año (Ahorra 2 meses)",
    billingPeriod: "mes (total familia)",
    description: "Cobertura integral para el titular y hasta 2 cargas familiares (hijos, pareja o padres). La forma más honesta de proteger la salud dental sin letra chica.",
    popular: true,
    badge: "MÁS ELEGIDO POR FAMILIAS",
    features: [
      "Cobertura para 3 beneficiarios (carga adicional: +$8.990/mes)",
      "Limpieza semestral $0 copago para los 3 inscritos (1ª activa desde el mes 1 · 2ª al mes 6)",
      "Set radiográfico y diagnóstico preventivo para toda la familia ($0 copago)",
      "1 Aplicación de Flúor barniz y sellantes para niños al año ($0 copago)",
      "50% de arancel preferente en restauraciones y odontopediatría",
      "Arancel preferencial fijado en controles mensuales de ortodoncia",
      "Prioridad de atención en box Suecia 3580 ante urgencias",
      "Suscripción mensual vía Flow.cl (Tarjetas, PAC o link directo)"
    ],
    ctaText: "Activar Plan Familiar",
    ctaWhatsappMessage: "Hola Centro Dental BeHappy, quiero activar el Plan Familia Protegida ($32.990/mes para 3 personas). ¿Cómo procedemos?",
    ctaUrl: "",
    coverageHighlight: "3 personas cubiertas · Limpiezas semestrales $0 copago"
  },
  {
    id: "plan-pyme",
    name: "Plan BeHappy Convenio Pyme",
    tag: "EMPRESAS & EQUIPOS (DESDE 4 PERSONAS)",
    monthlyPrice: 11900,
    monthlyPriceDisplay: "$11.900",
    annualPriceDisplay: "Facturación mensual exenta de IVA",
    billingPeriod: "mes por colaborador",
    description: "Convenio dental ágil para pymes, startups y locales comerciales de Ñuñoa y Santiago. Bienestar real para el equipo sin trámites burocráticos.",
    popular: false,
    badge: "Convenio Local Ñuñoa",
    features: [
      "Desde 4 colaboradores con incorporación flexible",
      "Facturación directa exenta a la empresa (gasto deducible)",
      "1 Limpieza anual profunda con ultrasonido por colaborador ($0 copago)",
      "Diagnóstico radiográfico digital de admisión ($0 copago)",
      "40% al 55% arancel preferente en todos los tratamientos",
      "Extensible con arancel preferente al grupo familiar directo",
      "Canal prioritario de agendamiento ejecutivo por WhatsApp"
    ],
    ctaText: "Cotizar Convenio Pyme",
    ctaWhatsappMessage: "Hola Centro Dental BeHappy, represento a una empresa/pyme y me interesa cotizar el Plan Convenio Corporativo para nuestro equipo.",
    ctaUrl: "",
    coverageHighlight: "Factura exenta deducible + Chequeo anual $0 copago"
  }
];

export const DEFAULT_CMS_DATA: CMSData = {
  treatments: TREATMENTS,
  doctors: DOCTORS,
  clinicInfo: CLINIC_INFO,
  announcements: DEFAULT_ANNOUNCEMENTS,
  promotions: DEFAULT_PROMOTIONS,
  membershipPlans: DEFAULT_MEMBERSHIP_PLANS,
  hero: DEFAULT_HERO,
  welcomeSection: DEFAULT_WELCOME_SECTION,
  preventionSection: DEFAULT_PREVENTION_SECTION,
  heroHeadline: "Centro Dental BeHappy",
  heroSubheadline: "Centro dental en Ñuñoa con la última tecnología y tratamientos de la más alta calidad.",
  lastUpdated: new Date().toISOString()
};

const STORAGE_CMS_KEY = "behappy_cms_data";
const CMS_CHANGE_EVENT = "behappy_cms_updated";
let hasHydratedFromSupabase = false;

function normalizeLegacySeguroTerms(data: CMSData): CMSData {
  // Upgrade any cached "Seguro" references to "Club BeHappy" for CMF regulatory & commercial consistency
  if (data.welcomeSection?.cards) {
    data.welcomeSection.cards = data.welcomeSection.cards.map((c) => {
      if (c.id === "card-convenio" && c.linkText?.toLowerCase().includes("seguro")) {
        return {
          ...c,
          tag: "MEMBRESÍA PREVENTIVA",
          title: "Descubre el Club Familiar BeHappy",
          description: "Planes mensuales y anuales con limpiezas y radiografías $0 copago y hasta 50% en arancel clínico.",
          linkText: "Ver planes del Club →",
          linkUrl: "/club"
        };
      }
      return c;
    });
  }
  if (data.promotions) {
    data.promotions = data.promotions.map((p) => {
      if (p.id === "promo-seguro" && p.title?.toLowerCase().includes("seguro")) {
        return {
          ...p,
          tag: "MEMBRESÍA PREVENTIVA BEHAPPY",
          title: "Club Dental Familiar Propio",
          discount: "40% al 55%",
          description: "Planes de cuidado continuo con 2 limpiezas anuales $0 copago, radiografías incluidas y arancel preferente sin letra chica.",
          badge: "Club BeHappy",
          linkText: "Ver planes del Club BeHappy",
          linkHref: "/club"
        };
      }
      return p;
    });
  }
  return data;
}

export async function syncCMSFromServer(): Promise<CMSData | null> {
  if (typeof window === "undefined") return null;
  try {
    const res = await fetch("/api/cms", { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    if (json?.success && json?.source === "supabase" && json?.data) {
      const merged: CMSData = normalizeLegacySeguroTerms({
        ...DEFAULT_CMS_DATA,
        ...json.data,
        membershipPlans:
          json.data.membershipPlans && json.data.membershipPlans.length > 0
            ? json.data.membershipPlans
            : DEFAULT_MEMBERSHIP_PLANS
      });
      localStorage.setItem(STORAGE_CMS_KEY, JSON.stringify(merged));
      window.dispatchEvent(new CustomEvent(CMS_CHANGE_EVENT, { detail: merged }));
      return merged;
    }
    return null;
  } catch {
    return null;
  }
}

export function getCMSData(): CMSData {
  if (typeof window === "undefined") return DEFAULT_CMS_DATA;

  if (!hasHydratedFromSupabase) {
    hasHydratedFromSupabase = true;
    syncCMSFromServer();
  }

  try {
    const raw = localStorage.getItem(STORAGE_CMS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_CMS_KEY, JSON.stringify(DEFAULT_CMS_DATA));
      return DEFAULT_CMS_DATA;
    }
    const parsed = JSON.parse(raw);
    const merged: CMSData = {
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
      membershipPlans: parsed.membershipPlans && parsed.membershipPlans.length > 0 ? parsed.membershipPlans : DEFAULT_MEMBERSHIP_PLANS,
      promotions: parsed.promotions && parsed.promotions.length > 0 ? parsed.promotions.map((p: any, idx: number) => ({
        ...p,
        image: p.image || (idx === 0 ? "/images/promos/seguro-dental.png" : "/images/promos/promos-vigentes.png")
      })) : DEFAULT_PROMOTIONS,
    };
    return normalizeLegacySeguroTerms(merged);
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

    // Send async sync to API route (persists to Supabase site_cms_payloads)
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
    fetch("/api/cms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(DEFAULT_CMS_DATA)
    }).catch(() => {});
    return DEFAULT_CMS_DATA;
  } catch (err) {
    console.error("Error resetting CMS data:", err);
    return DEFAULT_CMS_DATA;
  }
}
