import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { isAdminSession } from "@/lib/cmsAuth";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { syncClubSubscriberConvenio } from "@/lib/clubConvenios";
import {
  findDentalinkPacienteByRut,
  getDentalinkPacienteConvenios,
  isDentalinkConfigured,
} from "@/lib/dentalink";

function cloudReady(): boolean {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder-project.supabase.co"
  );
}

async function resolveSubscriptionRut(subscriptionId: string): Promise<string | null> {
  if (!cloudReady()) return null;
  const { data } = await supabase
    .from("suscripciones_club")
    .select("id, titular_rut")
    .eq("id", subscriptionId)
    .maybeSingle();
  return data?.titular_rut || null;
}

export async function GET(request: Request) {
  const session = isAdminSession(request);
  if (!session) {
    return NextResponse.json(
      { error: "Se requiere sesión de administrador para consultar convenios." },
      { status: 401 }
    );
  }

  const limit = rateLimit(`club-convenios-get:${getClientIp(request)}`, 60, 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter || 60) } }
    );
  }

  if (!isDentalinkConfigured()) {
    return NextResponse.json({
      ok: false,
      reason: "Dentalink no configurado (modo preview).",
    });
  }

  const { searchParams } = new URL(request.url);
  const subscriptionId = searchParams.get("subscription_id");
  const rutParam = searchParams.get("rut");

  let rut = rutParam?.trim() || null;
  if (!rut && subscriptionId) {
    rut = await resolveSubscriptionRut(subscriptionId);
  }
  if (!rut) {
    return NextResponse.json(
      { error: "Indica 'rut' o 'subscription_id' con titular_rut." },
      { status: 400 }
    );
  }

  try {
    const paciente = await findDentalinkPacienteByRut(rut);
    if (!paciente) {
      return NextResponse.json(
        { ok: false, reason: "Paciente no encontrado en Dentalink.", rut },
        { status: 404 }
      );
    }
    const convenios = await getDentalinkPacienteConvenios(paciente.id);
    return NextResponse.json({ ok: true, pacienteId: paciente.id, convenios });
  } catch (error) {
    console.error("Error al consultar convenios Dentalink:", error);
    return NextResponse.json(
      { ok: false, reason: "No fue posible consultar los convenios en este momento." },
      { status: 502 }
    );
  }
}

export async function POST(request: Request) {
  const session = isAdminSession(request);
  if (!session) {
    return NextResponse.json(
      { error: "Se requiere sesión de administrador para sincronizar convenios." },
      { status: 401 }
    );
  }

  const limit = rateLimit(`club-convenios-post:${getClientIp(request)}`, 30, 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter || 60) } }
    );
  }

  try {
    const body = await request.json();
    const action = body?.action;
    if (action !== "assign" && action !== "remove") {
      return NextResponse.json(
        { error: "Acción inválida. Usa 'assign' o 'remove'." },
        { status: 400 }
      );
    }

    const subscriptionId =
      typeof body.subscription_id === "string" && body.subscription_id.trim()
        ? body.subscription_id.trim()
        : undefined;
    let rut =
      typeof body.rut === "string" && body.rut.trim() ? body.rut.trim() : null;

    if (!rut && subscriptionId) {
      rut = await resolveSubscriptionRut(subscriptionId);
      if (rut === null && cloudReady()) {
        const { data } = await supabase
          .from("suscripciones_club")
          .select("id")
          .eq("id", subscriptionId)
          .maybeSingle();
        if (!data) {
          return NextResponse.json(
            { error: "Suscripción no encontrada." },
            { status: 404 }
          );
        }
      }
    }

    if (!rut) {
      return NextResponse.json(
        { error: "Indica 'rut' o 'subscription_id' con titular_rut." },
        { status: 400 }
      );
    }

    const result = await syncClubSubscriberConvenio({ subscriptionId, rut, action });
    return NextResponse.json(result, { status: result.ok ? 200 : 422 });
  } catch (error) {
    console.error("Error al sincronizar convenio del Club:", error);
    return NextResponse.json(
      { error: "Error interno al sincronizar el convenio." },
      { status: 500 }
    );
  }
}
