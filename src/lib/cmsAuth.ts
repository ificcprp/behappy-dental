import { createHmac, timingSafeEqual } from "crypto";

export const CMS_SESSION_COOKIE = "behappy_cms_session";
export const CMS_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24;

export interface CMSSessionPayload {
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

export function getMasterKey(): string {
  return process.env.CMS_ADMIN_MASTER_KEY || "BeHappy2026!";
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

export function createSessionToken(
  email: string,
  role: string,
  ttlMs = CMS_SESSION_MAX_AGE_SECONDS * 1000,
  demo = false
): string {
  const payload: CMSSessionPayload = {
    email: email.trim().toLowerCase(),
    role,
    exp: Date.now() + ttlMs,
    ...(demo ? { demo: true } : {}),
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

export function verifySessionToken(token?: string | null): CMSSessionPayload | null {
  if (!token) return null;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;

  const expected = sign(encoded);
  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) return null;

  try {
    const parsed = JSON.parse(Buffer.from(encoded, "base64url").toString()) as CMSSessionPayload;
    if (!parsed?.email || !parsed?.role || typeof parsed.exp !== "number") return null;
    if (parsed.exp < Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function getSessionFromRequest(req: Request): CMSSessionPayload | null {
  const cookieHeader = req.headers.get("cookie") || "";
  const token = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${CMS_SESSION_COOKIE}=`))
    ?.slice(CMS_SESSION_COOKIE.length + 1);

  return verifySessionToken(token ? decodeURIComponent(token) : null);
}

export function isAdminSession(req: Request): boolean {
  const session = getSessionFromRequest(req);
  return !!session && session.role === "admin" && !session.demo;
}

export function isStaffSession(req: Request): CMSSessionPayload | null {
  const session = getSessionFromRequest(req);
  if (!session || session.demo) return null;
  if (session.role === "admin" || session.role === "doctor" || session.role === "recepcion") {
    return session;
  }
  return null;
}
