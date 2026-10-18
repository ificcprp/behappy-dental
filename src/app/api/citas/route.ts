import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { CLINIC_INFO } from "@/data/clinicInfo";
import { isStaffSession } from "@/lib/cmsAuth";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { citaSchema, citaPatchSchema, firstIssueMessage } from "@/lib/validation";

function cloudReady(): boolean {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder-project.supabase.co"
  );
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
      doctor_id,
      doctor_name,
      treatment_id,
      treatment_name,
      preferred_date,
      preferred_time_slot,
      notes,
      utm_source,
    } = parsed.data;

    let persistedInSupabase = false;
    try {
      if (cloudReady()) {
        const { error } = await supabase.from("citas").insert([
          {
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
          },
        ]);
        if (!error) persistedInSupabase = true;
      }
    } catch (dbError) {
      console.warn("Supabase record creation fallback:", dbError);
    }

    const docText = doctor_name ? ` con ${doctor_name}` : "";
    const slotText = preferred_time_slot ? ` (${preferred_time_slot})` : "";
    const dateText = preferred_date ? ` para el ${preferred_date}${slotText}` : "";
    const message = `Hola Centro Dental BeHappy, mi nombre es ${patient_name}. Deseo confirmar una cita para *${treatment_name}*${docText}${dateText}. Mi teléfono de contacto es ${patient_phone}.`;

    const whatsappUrl = `https://api.whatsapp.com/send/?phone=${CLINIC_INFO.contact.whatsappNumber}&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`;

    return NextResponse.json({
      success: true,
      persistedInCloud: persistedInSupabase,
      message: "Solicitud registrada con éxito",
      whatsappUrl,
    });
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

    let updatedInSupabase = false;
    try {
      if (cloudReady()) {
        const { error } = await supabase
          .from("citas")
          .update({ status })
          .eq("id", id);
        if (!error) updatedInSupabase = true;
      }
    } catch (dbErr) {
      console.warn("Supabase PATCH /api/citas fallback:", dbErr);
    }

    return NextResponse.json({
      success: true,
      persistedInCloud: updatedInSupabase,
      message: "Estado de cita actualizado",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al actualizar el estado de la cita." },
      { status: 500 }
    );
  }
}
