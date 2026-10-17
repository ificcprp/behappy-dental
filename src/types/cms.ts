import { Treatment } from "@/data/treatments";
import { Doctor } from "@/data/doctors";
import { CLINIC_INFO } from "@/data/clinicInfo";

export interface TreatmentTariff {
  baseCLP: number;
  clubCLP: number;
  fonasaCode?: string;
  installmentsMax?: number;
}

export interface ClinicalGovernance {
  indications?: string;
  contraindications?: string[];
  consentPdfUrl?: string;
  boxSlotMinutes?: 30 | 45 | 60 | 90;
  beforeAfterGallery?: {
    before: string;
    after: string;
    caption: string;
  }[];
}

export interface DoctorAccreditation {
  sisRegistrationNumber?: string;
  universityDegree?: string;
  assignedBox?: "Box 1" | "Box 2" | "Box 3";
  isAvailableOnline?: boolean;
  allowedTreatmentIds?: string[];
}

export interface FlowMembershipConfig {
  flowPlanId?: string;
  billingCycle?: "monthly" | "annual";
  priceMonthlyCLP?: number;
  priceAnnualCLP?: number;
  maxFamilyMembers?: number;
  activeSubscriberSlots?: number;
  zeroCopayProcedures?: string[];
}

export interface CMSAuditLogEntry {
  id: string;
  timestamp: string;
  userId?: string;
  userEmail: string;
  action: "publish" | "draft_save" | "rollback";
  sectionModified: string;
  summary: string;
}

export interface CMSVersion {
  id: string;
  createdAt: string;
  createdBy?: string;
  userEmail?: string;
  versionTag: string;
  status: "draft" | "review" | "published" | "archived";
  payload: any;
  changeSummary?: string;
  isActiveProduction: boolean;
}

export interface EnhancedTreatment extends Treatment {
  priceBaseCLP?: number;
  priceClubCLP?: number;
  fonasaCode?: string;
  boxDurationMinutes?: number;
  isActive?: boolean;
  informedConsentUrl?: string;
  contraindications?: string[];
  beforeAfterImages?: { before: string; after: string; caption: string }[];
  installmentsMax?: number;
}

export interface EnhancedDoctor extends Doctor {
  sisRegistrationNumber?: string;
  universityDegree?: string;
  isAvailableOnline?: boolean;
  assignedBox?: "Box 1" | "Box 2" | "Box 3";
  allowedTreatmentIds?: string[];
}

export interface EnhancedMembershipPlan {
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

export interface EnhancedPromotion {
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

export interface EnhancedHero {
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

export interface StructuredAnnouncement {
  id: string;
  text: string;
  severity: "info" | "promo" | "alert";
  linkUrl?: string;
  active: boolean;
}

export type HeaderColorScheme = "blanco" | "negro" | "sistema";

export interface CMSHeaderConfig {
  layout: "classic" | "centered" | "split";
  navAlignment?: "center" | "left" | "right";
  mobileMenuType: "fullscreen" | "drawer-right" | "drawer-left";
  burgerOnDesktop: boolean;
  colorScheme: HeaderColorScheme; // "blanco" | "negro" | "sistema"
  desktopHeight: number; // px
  mobileHeight: number; // px
  logoSize: number; // px
  showBrandText: boolean;
  linksSpacing: number; // px
  fontSize: number; // px
  letterSpacing: string; // em
  textTransform: "uppercase" | "normal" | "capitalize";
  fontFamily: "mono" | "sans" | "serif";
  showDemoButton: boolean;
  demoButtonText: string;
  portalButtonText: string;
  bookingButtonText: string;
  isSticky: boolean;
  enableBlur: boolean;
}

