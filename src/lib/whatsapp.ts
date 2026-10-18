import { CLINIC_INFO } from "@/data/clinicInfo";
import { getCMSData } from "@/lib/cmsStore";

export function getWhatsAppNumber(): string {
  if (typeof window !== "undefined") {
    try {
      const cmsNumber = getCMSData()?.clinicInfo?.contact?.whatsappNumber;
      if (cmsNumber) return cmsNumber.replace(/[^0-9]/g, "");
    } catch {
      // Fallback to static clinic info below
    }
  }
  return CLINIC_INFO.contact.whatsappNumber;
}

export function buildWhatsAppUrl(message: string, phone?: string): string {
  const target = (phone || getWhatsAppNumber()).replace(/[^0-9]/g, "");
  const encoded = encodeURIComponent(message || "");
  return `https://api.whatsapp.com/send/?phone=${target}&text=${encoded}&type=phone_number&app_absent=0`;
}
