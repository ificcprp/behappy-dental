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
  linkText: string;
  linkHref: string;
}

export interface CMSData {
  treatments: Treatment[];
  doctors: Doctor[];
  clinicInfo: typeof CLINIC_INFO;
  announcements: string[];
  promotions: CMSPromotion[];
  heroHeadline: string;
  heroSubheadline: string;
  lastUpdated: string;
}

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
    linkText: "Conocer aranceles del plan",
    linkHref: "/precios"
  },
  {
    id: "promo-evaluacion",
    tag: "CAMPAÑA PRIMER DIAGNÓSTICO",
    title: "Evaluación Clínica Digital + Rx",
    discount: "Sin Costo Inicial",
    description: "Diagnóstico completo con cámara intraoral y radiografía digital para pacientes que inician tratamiento.",
    badge: "Válido este mes",
    linkText: "Agendar evaluación",
    linkHref: "/#agendar"
  }
];

export const DEFAULT_CMS_DATA: CMSData = {
  treatments: TREATMENTS,
  doctors: DOCTORS,
  clinicInfo: CLINIC_INFO,
  announcements: DEFAULT_ANNOUNCEMENTS,
  promotions: DEFAULT_PROMOTIONS,
  heroHeadline: "Odontología de alta precisión en Ñuñoa.",
  heroSubheadline: "Diagnóstico digital avanzado, especialistas de posgrado y atención ética sin dolor en Av. Suecia 3580.",
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
