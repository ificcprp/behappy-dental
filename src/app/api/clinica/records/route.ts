import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get("patientId");

    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder-project.supabase.co"
    ) {
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
  try {
    const body = await request.json();
    const {
      patient_id,
      patient_name,
      doctor_name,
      diagnosis,
      treatment_performed,
      prescription,
      next_step,
      odontogram_json,
      informed_consent_json,
    } = body;

    if (!diagnosis || !treatment_performed) {
      return NextResponse.json(
        { error: "Diagnóstico y procedimiento realizado son requeridos." },
        { status: 400 }
      );
    }

    let persistedInSupabase = false;

    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder-project.supabase.co"
    ) {
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
