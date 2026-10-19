import { supabase } from "@/lib/supabase";
import { DEFAULT_CMS_DATA, CMSData } from "@/lib/cmsStore";

function cloudReady(): boolean {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder-project.supabase.co"
  );
}

export async function getPublishedCMS(): Promise<CMSData> {
  if (!cloudReady()) return DEFAULT_CMS_DATA;

  try {
    const { data, error } = await supabase
      .from("site_cms_payloads")
      .select("full_payload")
      .eq("id", "current")
      .single();

    if (error || !data?.full_payload) return DEFAULT_CMS_DATA;

    const payload = data.full_payload as Partial<CMSData>;
    const defaults = DEFAULT_CMS_DATA;
    const incomingClinic = (payload.clinicInfo || {}) as Partial<typeof defaults.clinicInfo>;

    return {
      ...defaults,
      ...payload,
      clinicInfo: {
        ...defaults.clinicInfo,
        ...incomingClinic,
        address: { ...defaults.clinicInfo.address, ...(incomingClinic.address || {}) },
        contact: { ...defaults.clinicInfo.contact, ...(incomingClinic.contact || {}) },
        hours: { ...defaults.clinicInfo.hours, ...(incomingClinic.hours || {}) },
        stats: { ...defaults.clinicInfo.stats, ...(incomingClinic.stats || {}) },
      },
      hero: payload.hero ? { ...defaults.hero, ...payload.hero } : defaults.hero,
      whatsappBooking: payload.whatsappBooking ? { ...defaults.whatsappBooking, ...payload.whatsappBooking } : defaults.whatsappBooking,
      flashAlert: payload.flashAlert ? { ...defaults.flashAlert, ...payload.flashAlert } : defaults.flashAlert,
      seoMarketing: payload.seoMarketing ? { ...defaults.seoMarketing, ...payload.seoMarketing } : defaults.seoMarketing,
      pricingProcedures: payload.pricingProcedures && payload.pricingProcedures.length > 0 ? payload.pricingProcedures : defaults.pricingProcedures,
    };
  } catch {
    return DEFAULT_CMS_DATA;
  }
}

export function parseTimeRange(
  label: string | undefined,
  fallback: { opens: string; closes: string } | null
): { opens: string; closes: string } | null {
  const match = label?.match(/(\d{1,2}:\d{2})\s*[-–~]\s*(\d{1,2}:\d{2})/);
  if (match) return { opens: match[1], closes: match[2] };
  return fallback;
}
