import { NextResponse } from "next/server";
import { flowCreateDentalPayment } from "@/infrastructure/payments/flow/client";
import { supabase } from "@/lib/supabase";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { flowCreateSchema, firstIssueMessage } from "@/lib/validation";
import { syncClubSubscriberConvenio } from "@/lib/clubConvenios";

function cloudReady(): boolean {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder-project.supabase.co"
  );
}

async function registerClubSubscriber(params: {
  patientName: string;
  patientRut?: string;
  patientPhone?: string;
  email: string;
  planId?: string;
  subject: string;
  amount: number;
  billingCycle?: string;
  commerceOrder: string;
  simulated: boolean;
}): Promise<string | null> {
  if (!cloudReady()) return null;
  try {
    const { data, error } = await supabase
      .from("suscripciones_club")
      .insert([
        {
          titular_name: params.patientName,
          titular_rut: params.patientRut || null,
          titular_phone: params.patientPhone || "sin-telefono",
          titular_email: params.email,
          plan_id: params.planId || "plan-club",
          plan_name: params.subject,
          billing_cycle: params.billingCycle || "monthly",
          monthly_amount_clp: params.amount,
          status: params.simulated ? "activa" : "pendiente_activacion",
          flow_subscription_id: params.commerceOrder,
          notes: `Checkout ${params.simulated ? "simulado" : "Flow"} · ${params.commerceOrder}`,
        },
      ])
      .select("id")
      .maybeSingle();
    if (error) {
      console.warn("Error registering club subscriber:", error.message);
      return null;
    }
    return data?.id ?? null;
  } catch (dbErr) {
    console.warn("Error registering club subscriber:", dbErr);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const limit = rateLimit(`flow-create:${getClientIp(request)}`, 10, 60 * 1000);
    if (!limit.ok) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes de pago. Intenta nuevamente en unos minutos." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfter || 60) } }
      );
    }

    const rawBody = await request.json();
    const parsed = flowCreateSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        { error: `Datos de pago inválidos — ${firstIssueMessage(parsed.error)}` },
        { status: 400 }
      );
    }

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
    } = parsed.data;

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
      if (appointmentId && cloudReady()) {
        try {
          await supabase.from("citas").update({
            flow_order_id: String(simulatedFlowOrder),
            payment_status: "pendiente",
          }).eq("id", appointmentId);
        } catch (dbErr) {
          console.warn("Supabase simulator appointment update:", dbErr);
        }
      }

      if (type === "membresia_club") {
        const subscriptionId = await registerClubSubscriber({
          patientName,
          patientRut,
          patientPhone,
          email,
          planId,
          subject,
          amount,
          billingCycle,
          commerceOrder,
          simulated: true,
        });
        if (subscriptionId) {
          const sync = await syncClubSubscriberConvenio({
            subscriptionId,
            rut: patientRut || null,
            action: "assign",
          });
          if (!sync.ok) {
            console.warn("[Club] Convenio no sincronizado con Dentalink:", sync.reason);
          }
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
        commerceOrder,
      },
    });

    // Guardar referencia en Supabase si aplica
    if (appointmentId && cloudReady()) {
      try {
        await supabase.from("citas").update({
          flow_order_id: String(flowResponse.flowOrder),
          payment_status: "pendiente",
        }).eq("id", appointmentId);
      } catch (dbErr) {
        console.warn("Error updating Supabase with flow order:", dbErr);
      }
    }

    if (type === "membresia_club") {
      await registerClubSubscriber({
        patientName,
        patientRut,
        patientPhone,
        email,
        planId,
        subject,
        amount,
        billingCycle,
        commerceOrder,
        simulated: false,
      });
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
