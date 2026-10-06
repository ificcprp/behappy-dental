import { createHmac, timingSafeEqual } from "crypto";

const X_FLOW_SIG = "x-flow-signature";

/**
 * Firma HMAC-SHA256 según Flow:
 * https://developers.flow.cl/api#section/Introduccion/Como-firmar-con-su-SecretKey
 */
export function signFlowParams(
  params: Record<string, string>,
  secretKey: string
): string {
  const keys = Object.keys(params)
    .filter((k) => k !== "s")
    .sort();
  const toSign = keys.map((k) => `${k}${params[k]}`).join("");
  return createHmac("sha256", secretKey).update(toSign, "utf8").digest("hex");
}

/**
 * Valida el parámetro `s` del callback/webhook Flow contra la secretKey configurada.
 */
export function verifyFlowWebhookSignature(raw: Record<string, string>): boolean {
  const secret = process.env.FLOW_SECRET_KEY;
  if (!secret) return false;

  const received = raw.s?.trim();
  if (!received) return false;

  const expected = signFlowParams(raw, secret);
  const a = Buffer.from(expected, "hex");
  if (a.length === 0) return false;

  if (!/^[0-9a-fA-F]+$/.test(received) || received.length % 2 !== 0) {
    return false;
  }
  const b = Buffer.from(received, "hex");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
