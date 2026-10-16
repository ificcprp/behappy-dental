import { NextResponse } from "next/server";
import { flowCreateDentalPayment } from "@/infrastructure/payments/flow/client";
import { supabase } from "@/lib/supabase";

interface CreatePaymentBody {
  type: "abono_cita" | "copago_tratamiento" | "membresia_club";
  amount: number;
  subject: string;
  email: string;
  patientName: string;
  patientPhone?: string;
  patientRut?: string;
  treatmentName?: string;
  doctorName?: string;
  appointmentId?: string;
  planId?: string;
  billingCycle?: "monthly" | "annual";
}

export async function POST(request: Request) {
  try {
    const body: CreatePaymentBody = await request.json();
    const {
      type,
      amount,
      subject,
      email,
      patientName,
      patientPhone,
      patientRut,
      treatmentName,
      doctorName,
      appointmentId,
      planId,
      billingCycle,
    } = body;

    if (!amount || amount < 1000) {
      return NextResponse.json(
        { error: "El monto mínimo a procesar es $1.000 CLP." },
        { status: 400 }
      );
    }

    if (!email || !patientName || !subject) {
      return NextResponse.json(
        { error: "Email, nombre del paciente y concepto son obligatorios." },
        { status: 400 }
      );
    }

    const host = request.headers.get("host") || "behappydental.cl";
    const protocol = host.includes("localhost") ? "http" : "https";
    const origin = `${protocol}://${host}`;

    const commerceOrder = `BH-${Date.now().toString(36).toUpperCase()}-${Math.floor(
      Math.random() * 1000
    )}`;

    const urlConfirmation = `${origin}/api/pagos/flow/webhook`;
    const urlReturn = `${origin}/pagos/retorno`;

    const isDemoKey =
      !process.env.FLOW_API_KEY ||
      process.env.FLOW_API_KEY === "DEMO_FLOW_API_KEY" ||
      process.env.FLOW_API_KEY.trim() === "";

    // Si no hay API Key real configurada, activamos el simulador resiliente de Flow
    if (isDemoKey) {
      const simulatedToken = `FLOW_SIM_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const simulatedFlowOrder = Math.floor(100000 + Math.random() * 900000);

      // Si viene asociado a una cita, registramos o actualizamos
      if (appointmentId && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder-project.supabase.co") {
        try {
          await supabase.from("citas").update({
            flow_order_id: String(simulatedFlowOrder),
            payment_status: "pendiente",
          }).eq("id", appointmentId);
        } catch (dbErr) {
          console.warn("Supabase simulator appointment update:", dbErr);
        }
      }

      const returnUrlWithParams = `${urlReturn}?token=${simulatedToken}&order=${commerceOrder}&amount=${amount}&subject=${encodeURIComponent(
        subject
      )}&patient=${encodeURIComponent(patientName)}&email=${encodeURIComponent(
        email
      )}&simulated=true`;

      return NextResponse.json({
        success: true,
        redirectUrl: returnUrlWithParams,
        token: simulatedToken,
        flowOrder: simulatedFlowOrder,
        commerceOrder,
        isSimulated: true,
      });
    }

    // Ejecución contra la API oficial de Flow.cl
    const flowResponse = await flowCreateDentalPayment({
      commerceOrder,
      subject: `${subject} · BeHappy Dental Ñuñoa`,
      amount,
      email,
      urlConfirmation,
      urlReturn,
      optional: {
        type,
        patientName,
        patientPhone: patientPhone || "",
        patientRut: patientRut || "",
        treatmentName: treatmentName || "",
        doctorName: doctorName || "",
        appointmentId: appointmentId || "",
        planId: planId || "",
        billingCycle: billingCycle || "",
      },
    });

    // Guardar referencia en Supabase si aplica
    if (appointmentId && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder-project.supabase.co") {
      try {
        await supabase.from("citas").update({
          flow_order_id: String(flowResponse.flowOrder),
          payment_status: "pendiente",
        }).eq("id", appointmentId);
      } catch (dbErr) {
        console.warn("Error updating Supabase with flow order:", dbErr);
      }
    }

    const redirectUrl = `${flowResponse.url}?token=${flowResponse.token}`;

    return NextResponse.json({
      success: true,
      redirectUrl,
      token: flowResponse.token,
      flowOrder: flowResponse.flowOrder,
      commerceOrder,
      isSimulated: false,
    });
  } catch (error: any) {
    console.error("Error creating Flow dental payment:", error);
    return NextResponse.json(
      {
        error: error.message || "Error al comunicarse con la pasarela de pago Flow.",
      },
      { status: 500 }
    );
  }
}
