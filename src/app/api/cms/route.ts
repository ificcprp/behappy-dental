import { NextResponse } from "next/server";
import { DEFAULT_CMS_DATA, CMSData } from "@/lib/cmsStore";
import { supabase } from "@/lib/supabase";
import { getSessionFromRequest, isAdminSession } from "@/lib/cmsAuth";

const CMS_TABLE = "site_cms_payloads";
const CMS_ROW_ID = "current";
const CMS_DRAFT_ROW_ID = "draft";
const CMS_VERSIONS_TABLE = "cms_versions";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const isHistoryRequest = searchParams.get("history") === "true";
  const isDraftRequest = searchParams.get("draft") === "true";

  if ((isHistoryRequest || isDraftRequest) && !isAdminSession(req)) {
    return NextResponse.json(
      { success: false, error: "No autorizado. Se requiere sesión administrativa." },
      { status: 401 }
    );
  }

  try {
    const isSupabaseReady =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder-project.supabase.co";

    if (isSupabaseReady) {
      // 1. Si solicitan el borrador activo para el editor del portal
      if (isDraftRequest) {
        const { data: draftRow, error: dErr } = await supabase
          .from(CMS_TABLE)
          .select("*")
          .eq("id", CMS_DRAFT_ROW_ID)
          .maybeSingle();

        if (!dErr && draftRow?.full_payload) {
          return NextResponse.json({
            success: true,
            source: "supabase-draft",
            data: draftRow.full_payload,
          });
        }
        return NextResponse.json({ success: true, source: "none", data: null });
      }

      // 2. Si solicitan historial de versiones y auditoría
      if (isHistoryRequest) {
        const { data: versions, error: vErr } = await supabase
          .from(CMS_VERSIONS_TABLE)
          .select("id, created_at, user_email, version_tag, status, change_summary, is_active_production")
          .order("created_at", { ascending: false })
          .limit(25);

        if (!vErr && versions) {
          return NextResponse.json({
            success: true,
            versions,
          });
        }
        return NextResponse.json({ success: true, versions: [] });
      }

      // 3. Consulta regular del estado actual del CMS (solo lectura pública del contenido publicado)
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

  if (isHistoryRequest) {
    return NextResponse.json({ success: true, versions: [] });
  }

  return NextResponse.json({
    success: true,
    source: "default",
    data: DEFAULT_CMS_DATA,
  });
}

export async function POST(req: Request) {
  const session = getSessionFromRequest(req);
  if (!isAdminSession(req) || !session) {
    return NextResponse.json(
      { success: false, error: "No autorizado. Inicia sesión como administrador para editar el CMS." },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const action = body.__action || "publish";
    const versionTag = body.__versionTag || `v-${new Date().toISOString().slice(0, 10)}`;
    const changeSummary = body.__changeSummary || "Actualización desde editor CMS";
    const userEmail = session.email || body.__userEmail || "admin@behappydental.cl";

    // Limpiar campos de control antes de persistir payload canónico
    const {
      __action,
      __versionTag,
      __changeSummary,
      __userEmail,
      ...cleanedPayload
    } = body;
    const payload: CMSData = cleanedPayload as CMSData;

    let savedToSupabase = false;
    let versionRecorded = false;

    try {
      const isSupabaseReady =
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder-project.supabase.co";

      if (isSupabaseReady) {
        // Guardado de Borrador: NO toca la fila de producción ("current") ni el historial de versiones
        if (action === "save_draft") {
          const { error: draftErr } = await supabase.from(CMS_TABLE).upsert(
            {
              id: CMS_DRAFT_ROW_ID,
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

          const draftSaved = !draftErr;
          if (draftErr) console.warn("Supabase draft upsert warning:", draftErr.message);

          return NextResponse.json({
            success: true,
            persistedInCloud: draftSaved,
            versionRecorded: false,
            message: draftSaved
              ? "Borrador guardado en la nube (no visible al público hasta publicar)"
              : "Borrador guardado localmente (sincronización cloud pendiente)",
            lastUpdated: new Date().toISOString(),
          });
        }

        // Manejo de Rollback
        if (action === "rollback" && body.__versionId) {
          const { data: targetVersion, error: rErr } = await supabase
            .from(CMS_VERSIONS_TABLE)
            .select("payload")
            .eq("id", body.__versionId)
            .single();

          if (!rErr && targetVersion?.payload) {
            await supabase.from(CMS_TABLE).upsert(
              {
                id: CMS_ROW_ID,
                full_payload: targetVersion.payload,
                treatments_payload: targetVersion.payload.treatments || [],
                doctors_payload: targetVersion.payload.doctors || [],
                contact_payload: targetVersion.payload.clinicInfo || {},
                announcements_payload: targetVersion.payload.announcements || [],
                promotions_payload: targetVersion.payload.promotions || [],
                membership_plans_payload: targetVersion.payload.membershipPlans || [],
                updated_at: new Date().toISOString(),
              },
              { onConflict: "id" }
            );

            // El rollback reemplaza producción: el borrador anterior queda obsoleto
            await supabase.from(CMS_TABLE).delete().eq("id", CMS_DRAFT_ROW_ID);

            // Registrar el evento de rollback en auditoría
            await supabase.from(CMS_VERSIONS_TABLE).insert({
              version_tag: `Rollback a ${body.__versionId.slice(0, 8)}`,
              status: "published",
              payload: targetVersion.payload,
              change_summary: `Restauración de versión histórica ${body.__versionId}`,
              user_email: userEmail,
              is_active_production: true,
            });

            return NextResponse.json({
              success: true,
              message: "Rollback ejecutado con éxito",
              restoredPayload: targetVersion.payload,
            });
          }
        }

        // 1. Guardar en tabla de estado activo site_cms_payloads
        const { error: upsertErr } = await supabase.from(CMS_TABLE).upsert(
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

        if (!upsertErr) {
          savedToSupabase = true;

          // La publicación reemplaza el borrador: se limpia para evitar restauraciones accidentales
          await supabase.from(CMS_TABLE).delete().eq("id", CMS_DRAFT_ROW_ID);

          // 2. Registrar versión en public.cms_versions si es publicación
          if (action === "publish") {
            // Desmarcar previas
            await supabase
              .from(CMS_VERSIONS_TABLE)
              .update({ is_active_production: false })
              .eq("is_active_production", true);

            // Insertar nueva versión activa
            const { error: verErr } = await supabase.from(CMS_VERSIONS_TABLE).insert({
              version_tag: versionTag,
              status: "published",
              payload,
              change_summary: changeSummary,
              user_email: userEmail,
              is_active_production: true,
            });

            if (!verErr) {
              versionRecorded = true;
            }
          }
        } else {
          console.warn("Supabase upsert warning:", upsertErr.message);
        }
      }
    } catch (dbErr) {
      console.warn("Supabase POST /api/cms fallback:", dbErr);
    }

    return NextResponse.json({
      success: true,
      persistedInCloud: savedToSupabase,
      versionRecorded,
      message: savedToSupabase
        ? action === "publish"
          ? "Contenido publicado y versionado con éxito en Supabase"
          : "Borrador guardado en la nube"
        : action === "save_draft"
          ? "Borrador guardado localmente (sincronización cloud pendiente)"
          : "Contenido guardado localmente (sincronización cloud pendiente)",
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
