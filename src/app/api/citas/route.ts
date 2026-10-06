import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { CLINIC_INFO } from "@/data/clinicInfo";

export async function POST(request: Request) {
  try {
    const body = await request.json();
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
    } = body;

    // Validación básica
    if (!patient_name || !patient_phone || !treatment_name) {
      return NextResponse.json(
        { error: "Nombre, teléfono y tratamiento son requeridos." },
        { status: 400 }
      );
    }

    // Intentar guardar en Supabase si está disponible
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder-project.supabase.co") {
        await supabase.from("citas").insert([
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
            status: "solicitada"
          }
        ]);
      }
    } catch (dbError) {
      console.warn("Supabase record creation fallback:", dbError);
    }

    // Generar texto para WhatsApp con formato listo para la recepcionista
    const docText = doctor_name ? ` con ${doctor_name}` : "";
    const slotText = preferred_time_slot ? ` (${preferred_time_slot})` : "";
    const dateText = preferred_date ? ` para el ${preferred_date}${slotText}` : "";
    const message = `Hola Centro Dental BeHappy, mi nombre es ${patient_name}. Deseo confirmar una cita para *${treatment_name}*${docText}${dateText}. Mi teléfono de contacto es ${patient_phone}.`;

    const whatsappUrl = `https://api.whatsapp.com/send/?phone=${CLINIC_INFO.contact.whatsappNumber}&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`;

    return NextResponse.json({
      success: true,
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
