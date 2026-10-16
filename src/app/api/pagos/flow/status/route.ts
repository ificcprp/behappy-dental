import { NextResponse } from "next/server";
import { flowGetPaymentStatus } from "@/infrastructure/payments/flow/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Token requerido" }, { status: 400 });
    }

    if (token.startsWith("FLOW_SIM_")) {
      return NextResponse.json({
        success: true,
        status: 2,
        statusText: "Pagada (Simulación Resiliente)",
        flowOrder: 981240,
        amount: Number(searchParams.get("amount") || 10000),
        subject: searchParams.get("subject") || "Abono de Reserva Dental",
        payer: searchParams.get("email") || "paciente@behappydental.cl",
        isSimulated: true,
      });
    }

    const flowData = await flowGetPaymentStatus(token);

    return NextResponse.json({
      success: true,
      status: flowData.status,
      flowOrder: flowData.flowOrder,
      commerceOrder: flowData.commerceOrder,
      amount: flowData.amount,
      subject: flowData.subject,
      payer: flowData.payer,
      paymentData: flowData.paymentData,
      isSimulated: false,
    });
  } catch (error: any) {
    console.error("Error checking Flow status:", error);
    return NextResponse.json(
      { error: error.message || "Error al consultar estado de pago" },
      { status: 500 }
    );
  }
}
