export const CMS_SESSION_COOKIE = "behappy_cms_session";

export interface WebSessionPayload {
  email: string;
  role: string;
  exp: number;
  demo?: boolean;
}

function getSecret(): string {
  return (
    process.env.CMS_SESSION_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "behappy-cms-dev-secret"
  );
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToString(part: string): string {
  const normalized = part.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  return atob(padded);
}

async function hmacSha256Base64Url(payload: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return bytesToBase64Url(new Uint8Array(signature));
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function verifySessionTokenWeb(token?: string | null): Promise<WebSessionPayload | null> {
  if (!token) return null;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;

  const expected = await hmacSha256Base64Url(encoded);
  if (!constantTimeEqual(signature, expected)) return null;

  try {
    const parsed = JSON.parse(base64UrlToString(encoded)) as WebSessionPayload;
    if (!parsed?.email || !parsed?.role || typeof parsed.exp !== "number") return null;
    if (parsed.exp < Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}
