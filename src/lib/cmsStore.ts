import { TREATMENTS, Treatment } from "@/data/treatments";
import { DOCTORS, Doctor } from "@/data/doctors";
import { CLINIC_INFO } from "@/data/clinicInfo";
import { CMSHeaderConfig } from "@/types/cms";

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
  startDate?: string;
  endDate?: string;
  enableCountdown?: boolean;
  maxRedemptions?: number;
  disclaimer?: string;
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
  statusBadge?: string;
  abVariantTitle?: string;
  enableAbTesting?: boolean;
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
  flowPlanId?: string;
  maxFamilyMembers?: number;
  activeSubscriberSlots?: number;
  zeroCopayProcedures?: string[];
}

export interface CMSAuthPortal {
  badge: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  loginTabLabel: string;
  registerTabLabel: string;
  loginButtonText: string;
  registerButtonText: string;
  forgotPasswordText: string;
  directBookingText: string;
  demoAccessText: string;
  securityNotice: string;
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
  authPortal: CMSAuthPortal;
  headerConfig: CMSHeaderConfig;
  heroHeadline: string;
  heroSubheadline: string;
  lastUpdated: string;
  versionTag?: string;
  currentStatus?: "draft" | "published";
  auditSummary?: string;
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
    id: "plan-plus",
    name: "Plan Dental Plus",
    tag: "INDIVIDUAL · JOVEN PROFESIONAL",
    monthlyPrice: 14990,
    monthlyPriceDisplay: "$14.990",
    annualPriceDisplay: "$149.900 al año (2 meses $0)",
    billingPeriod: "mes titular",
    description: "Cobertura completa individual con arancel preferente para beneficiarios adicionales. Diseñado para mantener tu sonrisa protegida todo el año.",
    popular: false,
    badge: "100% Diagnóstico & Limpiezas",
    features: [
      "Mensualidad Titular: $14.990 | Beneficiario adicional: $11.900 | Menor de 18: $8.990",
      "100% Cobertura en Evaluación y diagnóstico integral de salud dental",
      "100% Cobertura en Limpieza general eliminando manchas, tinciones y destartraje",
      "100% Cobertura en Radiografías Panorámica, Bite-Wing y Periapicales digitales",
      "100% Cobertura en Evaluación prioritaria de urgencia y mitigación del dolor",
      "Hasta 70% Cobertura en todas las especialidades (Resinas, Ortodoncia, Endodoncia e Implantes)",
      "Garantía de 2 años en todas las prestaciones restauradoras",
      "Descuento por permanencia: -10% en mensualidad al año 1, -20% al año 2, -30% al año 3",
      "Pago automático mensual con tu Cuenta Corriente o Tarjeta de Crédito (PAC/PAT)"
    ],
    ctaText: "Suscribirme al Plan Plus",
    ctaWhatsappMessage: "Hola Centro Dental BeHappy, deseo suscribirme al Plan Dental Plus ($14.990/mes). ¿Me pueden guiar con la activación?",
    ctaUrl: "",
    coverageHighlight: "100% Prevención + 70% Especialidades + 2 Años Garantía"
  },
  {
    id: "plan-integral",
    name: "Plan Dental Integral Familiar",
    tag: "GRUPO FAMILIAR PROTEGIDO",
    monthlyPrice: 32990,
    monthlyPriceDisplay: "$32.990",
    annualPriceDisplay: "$329.900 al año (2 meses $0)",
    billingPeriod: "mes (titular + 2 cargas)",
    description: "La mejor solución para la salud dental de tu familia. Cobertura en todas las especialidades, odontopediatría y arancel fijado sin letra chica.",
    popular: true,
    badge: "PLAN MÁS ELEGIDO",
    features: [
      "Cobertura para Titular + 2 beneficiarios directos (carga adicional: +$8.990/mes)",
      "100% Cobertura en Diagnósticos, exámenes e interconsultas en todas las especialidades",
      "100% Cobertura en Limpieza general y destartraje semestral para todos los inscritos",
      "100% Cobertura en Set de Radiografías digitales (Panorámicas y Bite-Wing)",
      "100% Cobertura en Fluoración tópica y sellantes dentales para niños ($0 copago)",
      "100% Cobertura en Urgencias correspondientes a mitigación del dolor",
      "Hasta 70% Cobertura en todas las especialidades (Ortodoncia, Implantes, Prótesis y Cirugía)",
      "Garantía de 2 años en prestaciones y garantía en implantes oseointegrados",
      "Descuento por permanencia acumulable del 10% anual en la mensualidad familiar",
      "Pago automático PAC/PAT por Cuenta Corriente o Tarjeta vía Flow.cl"
    ],
    ctaText: "Activar Plan Familiar",
    ctaWhatsappMessage: "Hola Centro Dental BeHappy, quiero activar el Plan Dental Integral Familiar ($32.990/mes para 3 personas). ¿Cómo procedemos?",
    ctaUrl: "",
    coverageHighlight: "Familia protegida · 100% Prevención · 70% Especialidades"
  },
  {
    id: "plan-empresa",
    name: "Plan Convenio Empresa / Pyme",
    tag: "EQUIPOS & COLABORADORES (DESDE 4 PERSONAS)",
    monthlyPrice: 11900,
    monthlyPriceDisplay: "$11.900",
    annualPriceDisplay: "Facturación mensual exenta de IVA",
    billingPeriod: "mes por colaborador",
    description: "Convenio dental ágil para pymes y empresas de Ñuñoa y Santiago. Cobertura preferente para el equipo y sus familias sin costo de administración.",
    popular: false,
    badge: "Convenio Corporativo",
    features: [
      "Desde 4 colaboradores con incorporación ágil y flexible",
      "Facturación mensual directa a la empresa (gasto 100% deducible)",
      "100% Cobertura en Evaluación clínica inicial y set radiográfico digital",
      "100% Cobertura en 1 Limpieza anual profunda con ultrasonido por colaborador",
      "Hasta 70% Cobertura en todas las especialidades odontológicas",
      "Beneficios y aranceles preferentes extensibles al grupo familiar directo",
      "Canal preferencial de agendamiento ejecutivo en Suecia 3580"
    ],
    ctaText: "Cotizar Convenio Empresa",
    ctaWhatsappMessage: "Hola Centro Dental BeHappy, represento a una empresa y deseo cotizar el Plan Convenio Corporativo para nuestro equipo.",
    ctaUrl: "",
    coverageHighlight: "Factura exenta deducible + 100% Chequeo y Limpieza anual"
  }
];

export const DEFAULT_AUTH_PORTAL: CMSAuthPortal = {
  badge: "SEDE ÑUÑOA · SUECIA 3580",
  title: "Portal Clínico & Pacientes",
  titleHighlight: "BeHappy",
  subtitle: "Acceso seguro a ficha clínica digital, citas, presupuestos y convenios.",
  loginTabLabel: "Iniciar Sesión",
  registerTabLabel: "Crear Ficha Paciente",
  loginButtonText: "Ingresar al Portal",
  registerButtonText: "Crear Ficha y Acceder",
  forgotPasswordText: "¿Olvidaste tu clave?",
  directBookingText: "¿Deseas atención directa? Reservar cita online",
  demoAccessText: "Acceso a Entorno de Demostración (Pitch & Roles)",
  securityNotice: "Acceso protegido bajo Ley 20.584 · Cifrado Clínico TLS 1.3"
};

export const DEFAULT_HEADER_CONFIG: CMSHeaderConfig = {
  layout: "classic",
  mobileMenuType: "fullscreen",
  burgerOnDesktop: false,
  desktopHeight: 84,
  mobileHeight: 72,
  logoSize: 52,
  showBrandText: true,
  linksSpacing: 28,
  fontSize: 12,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  fontFamily: "mono",
  showDemoButton: true,
  demoButtonText: "Demo Suite (4 Roles)",
  portalButtonText: "Portal Clínico",
  bookingButtonText: "Reservar Cita",
  isSticky: true,
  enableBlur: true,
};

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
  authPortal: DEFAULT_AUTH_PORTAL,
  headerConfig: DEFAULT_HEADER_CONFIG,
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
        authPortal: json.data.authPortal ? { ...DEFAULT_AUTH_PORTAL, ...json.data.authPortal } : DEFAULT_AUTH_PORTAL,
        headerConfig: json.data.headerConfig ? { ...DEFAULT_HEADER_CONFIG, ...json.data.headerConfig } : DEFAULT_HEADER_CONFIG,
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
      authPortal: parsed.authPortal ? { ...DEFAULT_AUTH_PORTAL, ...parsed.authPortal } : DEFAULT_AUTH_PORTAL,
      headerConfig: parsed.headerConfig ? { ...DEFAULT_HEADER_CONFIG, ...parsed.headerConfig } : DEFAULT_HEADER_CONFIG,
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

export interface SaveCMSOptions {
  status?: "draft" | "published";
  versionTag?: string;
  changeSummary?: string;
  userEmail?: string;
}

export function saveCMSData(data: Partial<CMSData>, options: SaveCMSOptions = {}): CMSData {
  if (typeof window === "undefined") return DEFAULT_CMS_DATA;
  try {
    const current = getCMSData();
    const updated: CMSData = {
      ...current,
      ...data,
      currentStatus: options.status || current.currentStatus || "published",
      versionTag: options.versionTag || current.versionTag,
      auditSummary: options.changeSummary || current.auditSummary,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_CMS_KEY, JSON.stringify(updated));

    // Dispatch custom event for real-time reactive re-renders
    window.dispatchEvent(new CustomEvent(CMS_CHANGE_EVENT, { detail: updated }));

    // Send async sync to API route with extended action payload
    fetch("/api/cms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...updated,
        __action: options.status === "draft" ? "save_draft" : "publish",
        __versionTag: options.versionTag || `v-${new Date().toISOString().slice(0, 10)}`,
        __changeSummary: options.changeSummary || "Actualización desde editor CMS",
        __userEmail: options.userEmail || "admin@behappydental.cl"
      })
    }).catch(() => {
      // Offline or network error handled gracefully
    });

    return updated;
  } catch (err) {
    console.error("Error saving CMS data:", err);
    return DEFAULT_CMS_DATA;
  }
}

export function publishCMSData(data: Partial<CMSData>, versionTag?: string, changeSummary?: string, userEmail?: string): CMSData {
  return saveCMSData(data, {
    status: "published",
    versionTag: versionTag || `v${new Date().toISOString().slice(0, 16).replace("T", " ")}`,
    changeSummary: changeSummary || "Publicación oficial en producción",
    userEmail: userEmail || "admin@behappydental.cl"
  });
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
