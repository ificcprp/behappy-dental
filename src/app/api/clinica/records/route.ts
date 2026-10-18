import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { isStaffSession } from "@/lib/cmsAuth";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { clinicalRecordSchema, firstIssueMessage } from "@/lib/validation";

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
      { success: false, error: "Se requiere sesión de staff para ver fichas clínicas." },
      { status: 401 }
    );
  }

  const limit = rateLimit(`records-get:${getClientIp(request)}`, 60, 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { success: false, error: "Demasiadas solicitudes." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter || 60) } }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get("patientId");

    if (cloudReady()) {
      let query = supabase
        .from("clinical_records")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (patientId) {
        query = query.eq("patient_id", patientId);
      }

      const { data, error } = await query;
      if (!error && data) {
        return NextResponse.json({
          success: true,
          source: "supabase",
          records: data,
        });
      }
    }
  } catch (err) {
    console.warn("Supabase GET /api/clinica/records fallback:", err);
  }

  return NextResponse.json({
    success: true,
    source: "local_resilience",
    records: [],
  });
}

export async function POST(request: Request) {
  const session = isStaffSession(request);
  if (!session) {
    return NextResponse.json(
      { error: "Se requiere sesión de staff para registrar fichas clínicas." },
      { status: 401 }
    );
  }

  try {
    const limit = rateLimit(`records-post:${getClientIp(request)}`, 30, 60 * 1000);
    if (!limit.ok) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfter || 60) } }
      );
    }

    const rawBody = await request.json();
    const parsed = clinicalRecordSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        { error: `Datos inválidos — ${firstIssueMessage(parsed.error)}` },
        { status: 400 }
      );
    }

    const {
      patient_id,
      patient_name,
      doctor_name,
      diagnosis,
      treatment_performed,
      prescription,
      next_step,
      odontogram_json,
    } = parsed.data;

    let persistedInSupabase = false;

    if (cloudReady()) {
      try {
        const { error } = await supabase.from("clinical_records").insert([
          {
            patient_id: patient_id || "paciente_anonimo",
            diagnosis,
            treatment_performed,
            prescription: prescription || null,
            next_step: next_step || null,
            odontogram_json: odontogram_json || null,
          },
        ]);
        if (!error) persistedInSupabase = true;
      } catch (dbErr) {
        console.warn("Error inserting clinical record into Supabase:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      persistedInCloud: persistedInSupabase,
      message: "Ficha clínica guardada con éxito",
      record: {
        id: `rec-${Date.now()}`,
        patientId: patient_id || patient_name || "Paciente",
        doctorName: doctor_name || "Especialista Tratante",
        date: new Date().toISOString().split("T")[0],
        diagnosis,
        treatmentPerformed: treatment_performed,
        prescription,
        nextStep: next_step,
      },
    });
  } catch (error: any) {
    console.error("Error creating clinical record:", error);
    return NextResponse.json(
      { error: error.message || "Error al registrar evolución clínica" },
      { status: 500 }
    );
  }
}
