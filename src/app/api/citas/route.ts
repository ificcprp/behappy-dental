import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { CLINIC_INFO } from "@/data/clinicInfo";
import { isStaffSession } from "@/lib/cmsAuth";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { citaSchema, citaPatchSchema, firstIssueMessage } from "@/lib/validation";
import {
  findOrCreateDentalinkPaciente,
  createDentalinkCita,
  isDentalinkConfigured,
  getDentalinkDisponibilidad,
  resolveDentalinkDentistaId,
  resolveDentalinkEstadoId,
  updateDentalinkCitaEstado,
  addMinutesToTime,
  DENTALINK_ESTADO_CANDIDATAS,
} from "@/lib/dentalink";

const DEDUPE_WINDOW_MS = 10 * 60 * 1000;
const inflightBookings = new Set<string>();

function cloudReady(): boolean {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder-project.supabase.co"
  );
}

function buildWhatsappUrl(params: {
  patientName: string;
  treatmentName: string;
  doctorName?: string | null;
  dateIso?: string | null;
  timeSlotText?: string | null;
  patientPhone: string;
}): string {
  const docText = params.doctorName ? ` con ${params.doctorName}` : "";
  const slotText = params.timeSlotText ? ` (${params.timeSlotText})` : "";
  const dateText = params.dateIso ? ` para el ${params.dateIso}${slotText}` : "";
  const message = `Hola Centro Dental BeHappy, mi nombre es ${params.patientName}. Deseo confirmar una cita para *${params.treatmentName}*${docText}${dateText}. Mi teléfono de contacto es ${params.patientPhone}.`;
  return `https://api.whatsapp.com/send/?phone=${CLINIC_INFO.contact.whatsappNumber}&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`;
}

export async function GET(request: Request) {
  const session = isStaffSession(request);
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Se requiere sesión de staff para ver las citas." },
      { status: 401 }
    );
  }

  const limit = rateLimit(`citas-get:${getClientIp(request)}`, 60, 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { success: false, error: "Demasiadas solicitudes." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter || 60) } }
    );
  }

  try {
    if (cloudReady()) {
      const { data, error } = await supabase
        .from("citas")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (!error && data) {
        return NextResponse.json({
          success: true,
          source: "supabase",
          citas: data,
        });
      }
    }
  } catch (dbErr) {
    console.warn("Supabase GET /api/citas fallback:", dbErr);
  }

  return NextResponse.json({
    success: true,
    source: "local_fallback",
    citas: [],
  });
}

export async function POST(request: Request) {
  try {
    const limit = rateLimit(`citas-post:${getClientIp(request)}`, 5, 10 * 60 * 1000);
    if (!limit.ok) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes de reserva. Intenta nuevamente en unos minutos." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfter || 60) } }
      );
    }

    const rawBody = await request.json();
    const parsed = citaSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        { error: `Datos inválidos — ${firstIssueMessage(parsed.error)}` },
        { status: 400 }
      );
    }
    const {
      patient_name,
      patient_phone,
      patient_email,
      patient_rut,
      doctor_id,
      doctor_name,
      treatment_id,
      treatment_name,
      preferred_date,
      preferred_time_slot,
      notes,
      utm_source,
    } = parsed.data;

    const live = isDentalinkConfigured();
    const whatsappUrl = buildWhatsappUrl({
      patientName: patient_name,
      treatmentName: treatment_name,
      doctorName: doctor_name,
      dateIso: preferred_date,
      timeSlotText: preferred_time_slot,
      patientPhone: patient_phone,
    });

    let duplicated = false;
    if (cloudReady()) {
      try {
        const since = new Date(Date.now() - DEDUPE_WINDOW_MS).toISOString();
        const { data: recent } = await supabase
          .from("citas")
          .select("id")
          .eq("patient_phone", patient_phone)
          .eq("treatment_name", treatment_name)
          .gte("created_at", since)
          .limit(1);
        duplicated = !!recent && recent.length > 0;
      } catch (dedupeErr) {
        console.warn("Supabase dedupe check fallback:", dedupeErr);
      }
    }

    const inflightKey = `${patient_phone}|${treatment_name}|${preferred_date || ""}`;
    if (duplicated || inflightBookings.has(inflightKey)) {
      return NextResponse.json({
        success: true,
        duplicate: true,
        dentalinkMode: live ? "live" : "preview",
        persistedInDentalink: false,
        dentalinkCitaId: null,
        dentalinkPending: false,
        persistedInCloud: duplicated,
        message:
          "Ya recibimos una solicitud idéntica hace instantes. La recepción te contactará para confirmar.",
        whatsappUrl,
      });
    }

    inflightBookings.add(inflightKey);

    try {
      let persistedInDentalink = false;
      let dentalinkCitaId: number | null = null;
      let dentalinkPending = false;

      if (live) {
        const rut = patient_rut?.trim() || "";
        const dentistaId = resolveDentalinkDentistaId(doctor_id);
        const fecha =
          preferred_date && /^\d{4}-\d{2}-\d{2}$/.test(preferred_date) ? preferred_date : null;

        let skipReason: string | null = null;
        if (!rut) skipReason = "RUT no informado";
        else if (!dentistaId) skipReason = `Profesional sin mapeo Dentalink (${doctor_id || "sin selección"})`;
        else if (!fecha) skipReason = "Fecha a coordinar";

        if (!skipReason && rut && dentistaId && fecha) {
          try {
            const parts = patient_name.trim().split(" ");
            const nombre = parts[0] || "Paciente";
            const apellidos = parts.slice(1).join(" ") || "Web";

            const pacienteId = await findOrCreateDentalinkPaciente({
              rut,
              nombre,
              apellidos,
              email: patient_email || undefined,
              telefono: patient_phone,
            });

            const slots = await getDentalinkDisponibilidad({ idDentista: dentistaId, fecha });
            const wantsAfternoon = (preferred_time_slot || "").toLowerCase().includes("tarde");
            const slot = slots.find((candidate) => {
              const hour = parseInt(candidate.hora_inicio.split(":")[0] || "0", 10);
              return wantsAfternoon ? hour >= 14 : hour < 14;
            });

            if (!slot) {
              skipReason = "Sin disponibilidad en la franja solicitada";
            } else {
              const estadoId = await resolveDentalinkEstadoId(
                DENTALINK_ESTADO_CANDIDATAS.solicitada
              );

              const dentalinkRes = await createDentalinkCita({
                id_paciente: pacienteId,
                id_dentista: dentistaId,
                id_sillon: slot.id_sillon || undefined,
                id_estado: estadoId ?? undefined,
                fecha,
                hora_inicio: slot.hora_inicio,
                hora_fin: slot.hora_fin || addMinutesToTime(slot.hora_inicio, 30),
                motivo: `[Web] ${treatment_name}`,
                comentarios: `[Captación Web BeHappy] Triaje: ${treatment_name} | Doctor preferente: ${doctor_name || "Primer disponible"} | Franja: ${preferred_time_slot || "A coordinar"} | UTM: ${utm_source || "web_direct"} | Notas paciente: ${notes || "Ninguna"}`,
              });

              persistedInDentalink = dentalinkRes.success;
              dentalinkCitaId = dentalinkRes.id;
            }
          } catch (dlErr) {
            skipReason = "Error de conexión con Dentalink";
            console.warn("[Dentalink Integration Warning]:", dlErr);
          }
        }

        if (!persistedInDentalink) {
          dentalinkPending = true;
          console.info(
            `[Dentalink] Cita web no sincronizada (${skipReason || "sin detalle"}). Queda pendiente para recepción vía WhatsApp.`
          );
        }
      }

      let persistedInSupabase = false;
      try {
        if (cloudReady()) {
          const baseRow = {
            patient_name,
            patient_phone,
            patient_email: patient_email || null,
            doctor_id: doctor_id || null,
            doctor_name: doctor_name || null,
            treatment_id: treatment_id || "general",
            treatment_name,
            preferred_date: preferred_date || null,
            preferred_time_slot: preferred_time_slot || null,
            notes: notes || null,
            utm_source: utm_source || "web_direct",
            status: "solicitada",
          };
          const row = dentalinkCitaId
            ? { ...baseRow, dentalink_cita_id: dentalinkCitaId }
            : baseRow;

          let { error } = await supabase.from("citas").insert([row]);
          if (error && dentalinkCitaId) {
            console.warn(
              "Supabase insert con dentalink_cita_id falló, reintentando sin la columna:",
              error.message
            );
            ({ error } = await supabase.from("citas").insert([baseRow]));
          }
          if (!error) persistedInSupabase = true;
        }
      } catch (dbError) {
        console.warn("Supabase record creation fallback:", dbError);
      }

      return NextResponse.json({
        success: true,
        duplicate: false,
        dentalinkMode: live ? "live" : "preview",
        persistedInDentalink,
        dentalinkCitaId,
        dentalinkPending,
        persistedInCloud: persistedInSupabase,
        message: "Solicitud registrada con éxito en la recepción clínica de BeHappy",
        whatsappUrl,
      });
    } finally {
      inflightBookings.delete(inflightKey);
    }
  } catch (error) {
    console.error("Error al procesar cita:", error);
    return NextResponse.json(
      { error: "Error interno al procesar la cita." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const session = isStaffSession(request);
  if (!session) {
    return NextResponse.json(
      { error: "Se requiere sesión de staff para actualizar citas." },
      { status: 401 }
    );
  }

  try {
    const limit = rateLimit(`citas-patch:${getClientIp(request)}`, 60, 60 * 1000);
    if (!limit.ok) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfter || 60) } }
      );
    }

    const rawBody = await request.json();
    const parsed = citaPatchSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        { error: `Datos inválidos — ${firstIssueMessage(parsed.error)}` },
        { status: 400 }
      );
    }

    const { id, status } = parsed.data;

    if (!cloudReady()) {
      return NextResponse.json({
        success: true,
        persistedInCloud: false,
        dentalinkSynced: null,
        message: "Entorno sin nube: nada que actualizar.",
      });
    }

    const { data: row, error: updateError } = await supabase
      .from("citas")
      .update({ status })
      .eq("id", id)
      .select("*")
      .maybeSingle();

    if (updateError) {
      return NextResponse.json(
        { success: false, error: `No se pudo actualizar la cita — ${updateError.message}` },
        { status: 502 }
      );
    }
    if (!row) {
      return NextResponse.json({ success: false, error: "Cita no encontrada." }, { status: 404 });
    }

    let dentalinkSynced: boolean | null = null;
    const dentalinkCitaId =
      typeof (row as { dentalink_cita_id?: unknown }).dentalink_cita_id === "number"
        ? (row as { dentalink_cita_id: number }).dentalink_cita_id
        : null;

    if (dentalinkCitaId && isDentalinkConfigured()) {
      try {
        const candidates = DENTALINK_ESTADO_CANDIDATAS[status] || [status];
        const estadoId = await resolveDentalinkEstadoId(candidates);
        if (estadoId) {
          await updateDentalinkCitaEstado(dentalinkCitaId, estadoId);
          dentalinkSynced = true;
        } else {
          dentalinkSynced = false;
        }
      } catch (dlErr) {
        dentalinkSynced = false;
        console.warn("[Dentalink] No se pudo sincronizar el estado de la cita:", dlErr);
      }
    }

    return NextResponse.json({
      success: true,
      persistedInCloud: true,
      dentalinkSynced,
      message: "Estado de cita actualizado",
    });
  } catch (error) {
    console.error("Error al actualizar estado de cita:", error);
    return NextResponse.json(
      { error: "Error al actualizar el estado de la cita." },
      { status: 500 }
    );
  }
}
