import { NextResponse } from "next/server";
import { getDentalinkDisponibilidad, isDentalinkConfigured } from "@/lib/dentalink";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

const FECHA_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export async function GET(request: Request) {
  const limit = rateLimit(`dentalink-disp:${getClientIp(request)}`, 60, 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Demasiadas consultas de disponibilidad." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter || 60) } }
    );
  }

  const { searchParams } = new URL(request.url);
  const fecha = searchParams.get("fecha") || new Date().toISOString().split("T")[0];
  if (!FECHA_REGEX.test(fecha)) {
    return NextResponse.json(
      { error: "Parámetro 'fecha' inválido. Formato esperado: YYYY-MM-DD." },
      { status: 400 }
    );
  }

  const dentistaIdParam = searchParams.get("id_dentista");
  let dentistaId: number | undefined;
  if (dentistaIdParam) {
    dentistaId = parseInt(dentistaIdParam, 10);
    if (!Number.isFinite(dentistaId)) {
      return NextResponse.json(
        { error: "Parámetro 'id_dentista' inválido." },
        { status: 400 }
      );
    }
  }

  try {
    const slots = await getDentalinkDisponibilidad({ idDentista: dentistaId, fecha });

    return NextResponse.json({
      success: true,
      fecha,
      source: isDentalinkConfigured() ? "dentalink_live_api" : "dentalink_preview_mode",
      slots,
    });
  } catch (error) {
    console.error("Error al consultar disponibilidad Dentalink:", error);
    return NextResponse.json(
      { error: "No fue posible consultar la agenda en este momento." },
      { status: 502 }
    );
  }
}
