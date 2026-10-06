import { signFlowParams } from "./sign";
import { FlowApiError } from "./flow-api-error";
import type {
  FlowCreatePaymentResponse,
  FlowPaymentStatusResponse,
  FlowPaymentGetResponse
} from "./types";

function getFlowConfig() {
  const apiKey = process.env.FLOW_API_KEY?.trim() || "DEMO_FLOW_API_KEY";
  const secretKey = process.env.FLOW_SECRET_KEY?.trim() || "DEMO_FLOW_SECRET_KEY";
  const baseUrl =
    process.env.FLOW_API_BASE_URL ?? "https://sandbox.flow.cl/api";
  return { apiKey, secretKey, baseUrl: baseUrl.replace(/\/$/, "") };
}

function parseFlowErrorResponse(status: number, text: string): FlowApiError {
  try {
    const data = JSON.parse(text) as { code?: number; message?: string };
    if (typeof data.message === "string") {
      return new FlowApiError(data.message, {
        httpStatus: status,
        flowCode: typeof data.code === "number" ? data.code : null,
      });
    }
  } catch {
    /* continuar */
  }
  return new FlowApiError(text || `Flow respondió HTTP ${status}`, {
    httpStatus: status,
    flowCode: null,
  });
}

/**
 * Crea una orden de pago en Flow para una Cita o Tratamiento Dental en CLP.
 */
export async function flowCreateDentalPayment(input: {
  commerceOrder: string;
  subject: string;
  amount: number;
  email: string;
  urlConfirmation: string;
  urlReturn: string;
  optional?: Record<string, string>;
}): Promise<FlowCreatePaymentResponse> {
  const { apiKey, secretKey, baseUrl } = getFlowConfig();

  const body: Record<string, string> = {
    apiKey,
    commerceOrder: input.commerceOrder,
    subject: input.subject,
    currency: "CLP",
    amount: String(input.amount),
    email: input.email,
    urlConfirmation: input.urlConfirmation,
    urlReturn: input.urlReturn,
    paymentMethod: "9", // Webpay Plus / Todas
  };

  if (input.optional && Object.keys(input.optional).length > 0) {
    body.optional = JSON.stringify(input.optional);
  }

  body.s = signFlowParams(body, secretKey);

  const res = await fetch(`${baseUrl}/payment/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(body).toString(),
  });

  const text = await res.text();
  if (!res.ok) {
    throw parseFlowErrorResponse(res.status, text);
  }

  const data = JSON.parse(text) as FlowCreatePaymentResponse;
  return data;
}

/**
 * Consulta el estado de un pago Flow mediante token.
 */
export async function flowGetPaymentStatus(token: string): Promise<FlowPaymentGetResponse> {
  const { apiKey, secretKey, baseUrl } = getFlowConfig();

  const params: Record<string, string> = {
    apiKey,
    token,
  };
  params.s = signFlowParams(params, secretKey);

  const q = new URLSearchParams(params).toString();
  const res = await fetch(`${baseUrl}/payment/getStatus?${q}`);
  const text = await res.text();

  if (!res.ok) {
    throw parseFlowErrorResponse(res.status, text);
  }

  return JSON.parse(text) as FlowPaymentGetResponse;
}
