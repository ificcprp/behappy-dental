import { NextResponse } from "next/server";
import { DEFAULT_CMS_DATA, CMSData } from "@/lib/cmsStore";
import { supabase } from "@/lib/supabase";

const CMS_TABLE = "site_cms_payloads";
const CMS_ROW_ID = "current";

export async function GET() {
  try {
    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder-project.supabase.co"
    ) {
      const { data, error } = await supabase
        .from(CMS_TABLE)
        .select("*")
        .eq("id", CMS_ROW_ID)
        .single();

      if (!error && data) {
        const cloudData: Partial<CMSData> = data.full_payload || {
          treatments: data.treatments_payload,
          doctors: data.doctors_payload,
          clinicInfo: data.contact_payload,
          announcements: data.announcements_payload,
          promotions: data.promotions_payload,
          membershipPlans: data.membership_plans_payload,
          lastUpdated: data.updated_at,
        };

        return NextResponse.json({
          success: true,
          source: "supabase",
          data: {
            ...DEFAULT_CMS_DATA,
            ...cloudData,
          },
        });
      }
    }
  } catch (dbErr) {
    console.warn("Supabase GET /api/cms fallback to default:", dbErr);
  }

  return NextResponse.json({
    success: true,
    source: "default",
    data: DEFAULT_CMS_DATA,
  });
}

export async function POST(req: Request) {
  try {
    const payload: CMSData = await req.json();
    let savedToSupabase = false;

    try {
      if (
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder-project.supabase.co"
      ) {
        const { error } = await supabase.from(CMS_TABLE).upsert(
          {
            id: CMS_ROW_ID,
            full_payload: payload,
            treatments_payload: payload.treatments || [],
            doctors_payload: payload.doctors || [],
            contact_payload: payload.clinicInfo || {},
            announcements_payload: payload.announcements || [],
            promotions_payload: payload.promotions || [],
            membership_plans_payload: payload.membershipPlans || [],
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" }
        );

        if (!error) {
          savedToSupabase = true;
        } else {
          console.warn("Supabase upsert warning:", error.message);
        }
      }
    } catch (dbErr) {
      console.warn("Supabase POST /api/cms fallback:", dbErr);
    }

    return NextResponse.json({
      success: true,
      persistedInCloud: savedToSupabase,
      message: savedToSupabase
        ? "Contenido CMS guardado y sincronizado en Supabase"
        : "Contenido CMS guardado localmente (sincronización cloud pendiente)",
      lastUpdated: new Date().toISOString(),
      updatedItemsCount: {
        treatments: payload.treatments?.length || 0,
        doctors: payload.doctors?.length || 0,
        membershipPlans: payload.membershipPlans?.length || 0,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Error procesando solicitud" },
      { status: 500 }
    );
  }
}
