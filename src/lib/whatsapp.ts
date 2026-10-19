import { CLINIC_INFO } from "@/data/clinicInfo";
import { getCMSData, CMSWhatsappBooking, DEFAULT_WHATSAPP_BOOKING } from "@/lib/cmsStore";

export function getWhatsAppBookingConfig(): CMSWhatsappBooking {
  if (typeof window !== "undefined") {
    try {
      const data = getCMSData();
      if (data?.whatsappBooking) {
        return {
          ...DEFAULT_WHATSAPP_BOOKING,
          ...data.whatsappBooking,
        };
      }
    } catch {
      // Fallback
    }
  }
  return DEFAULT_WHATSAPP_BOOKING;
}

export function getWhatsAppNumber(): string {
  if (typeof window !== "undefined") {
    try {
      const cms = getCMSData();
      const num = cms?.whatsappBooking?.whatsappNumber || cms?.clinicInfo?.contact?.whatsappNumber;
      if (num) return num.replace(/[^0-9]/g, "");
    } catch {
      // Fallback to static clinic info below
    }
  }
  return CLINIC_INFO.contact.whatsappNumber;
}

export function getEmergencyWhatsAppNumber(): string {
  if (typeof window !== "undefined") {
    try {
      const cms = getCMSData();
      const num = cms?.whatsappBooking?.emergencyWhatsappNumber;
      if (num) return num.replace(/[^0-9]/g, "");
    } catch {
      // Fallback
    }
  }
  return getWhatsAppNumber();
}

export function getFloatingWhatsAppMessage(): string {
  if (typeof window !== "undefined") {
    try {
      const msg = getCMSData()?.whatsappBooking?.floatingButtonMessage;
      if (msg) return msg;
    } catch {
      // Fallback
    }
  }
  return DEFAULT_WHATSAPP_BOOKING.floatingButtonMessage;
}

export function buildWhatsAppUrl(message: string, phone?: string): string {
  const target = (phone || getWhatsAppNumber()).replace(/[^0-9]/g, "");
  const encoded = encodeURIComponent(message || "");
  return `https://api.whatsapp.com/send/?phone=${target}&text=${encoded}&type=phone_number&app_absent=0`;
}

export function buildFormattedBookingWhatsAppUrl(params: {
  paciente: string;
  rut?: string;
  tratamiento: string;
  doctor?: string;
  fecha?: string;
  horario?: string;
  notas?: string;
}): string {
  const config = getWhatsAppBookingConfig();
  const template = config.bookingConfirmationTemplate || DEFAULT_WHATSAPP_BOOKING.bookingConfirmationTemplate;

  const filled = template
    .replace("{paciente}", params.paciente || "Paciente")
    .replace("{rut}", params.rut || "Sin RUT")
    .replace("{tratamiento}", params.tratamiento || "Evaluación")
    .replace("{doctor}", params.doctor || "Especialista Asignado")
    .replace("{fecha}", params.fecha || "A convenir")
    .replace("{horario}", params.horario || "A convenir")
    .replace("{notas}", params.notas || "Sin observaciones");

  return buildWhatsAppUrl(filled, config.whatsappNumber);
}
