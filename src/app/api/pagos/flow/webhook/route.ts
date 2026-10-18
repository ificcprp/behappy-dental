import { NextResponse } from "next/server";
import { flowGetPaymentStatus } from "@/infrastructure/payments/flow/client";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    let token: string | null = null;
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      token = (formData.get("token") as string) || null;
    } else if (contentType.includes("application/json")) {
      const json = await request.json();
      token = json.token || null;
    }

    if (!token) {
      const url = new URL(request.url);
      token = url.searchParams.get("token");
    }

    if (!token) {
      return NextResponse.json({ error: "Token no proporcionado" }, { status: 400 });
    }

    // Si es un token de simulación
    if (token.startsWith("FLOW_SIM_")) {
      return NextResponse.json({
        success: true,
        message: "Webhook de simulación recibido correctamente",
        status: 2,
      });
    }

    // Consulta de estado contra Flow oficial
    const paymentStatus = await flowGetPaymentStatus(token);

    // Status 2 significa pago aprobado
    if (paymentStatus.status === 2) {
      const opt = paymentStatus.optional as Record<string, string> | undefined;
      const appointmentId = opt?.appointmentId;
      const cloudReady =
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder-project.supabase.co";

      if (appointmentId && cloudReady) {
        try {
          await supabase
            .from("citas")
            .update({
              status: "confirmada",
              payment_status: "pagado",
              flow_order_id: String(paymentStatus.flowOrder),
            })
            .eq("id", appointmentId);
        } catch (dbErr) {
          console.warn("Error updating appointment payment in Supabase:", dbErr);
        }
      }

      // Activación de suscripciones del Club BeHappy pagadas por Flow
      if (opt?.type === "membresia_club" && opt.commerceOrder && cloudReady) {
        try {
          await supabase
            .from("suscripciones_club")
            .update({ status: "activa" })
            .eq("flow_subscription_id", opt.commerceOrder);
        } catch (dbErr) {
          console.warn("Error activating club subscriber in Supabase:", dbErr);
        }
      }
    }

    return NextResponse.json({
      success: true,
      flowOrder: paymentStatus.flowOrder,
      status: paymentStatus.status,
    });
  } catch (error: any) {
    console.error("Error processing Flow webhook:", error);
    return NextResponse.json(
      { error: error.message || "Error procesando webhook de Flow" },
      { status: 500 }
    );
  }
}
