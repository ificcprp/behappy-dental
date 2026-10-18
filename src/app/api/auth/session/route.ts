import { NextResponse } from "next/server";
import { DEFAULT_ACCOUNTS } from "@/lib/authService";
import {
  CMS_SESSION_COOKIE,
  CMS_SESSION_MAX_AGE_SECONDS,
  createSessionToken,
  getMasterKey,
  getSessionFromRequest,
} from "@/lib/cmsAuth";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { sessionSchema, firstIssueMessage } from "@/lib/validation";

function buildSessionResponse(ok: boolean, email?: string, role?: string) {
  return NextResponse.json(
    { success: ok, email: ok ? email : undefined, role: ok ? role : undefined },
    { status: ok ? 200 : 401 }
  );
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const limit = rateLimit(`session:${ip}`, 10, 5 * 60 * 1000);
    if (!limit.ok) {
      return NextResponse.json(
        { success: false, error: "Demasiados intentos. Intenta nuevamente en unos minutos." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfter || 60) } }
      );
    }

    const body = await req.json().catch(() => ({}));
    const parsed = sessionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: firstIssueMessage(parsed.error) },
        { status: 400 }
      );
    }

    const email = parsed.data.email.trim().toLowerCase();
    const password = parsed.data.password || "";
    const account = DEFAULT_ACCOUNTS.find((a) => a.email.toLowerCase() === email);

    if (!account) {
      return NextResponse.json({ success: false, error: "Credenciales inválidas" }, { status: 401 });
    }

    if (parsed.data.demo) {
      if (process.env.CMS_DEMO_ENABLED === "false") {
        return NextResponse.json({ success: false, error: "El modo demo está deshabilitado" }, { status: 403 });
      }
      const token = createSessionToken(email, account.role, CMS_SESSION_MAX_AGE_SECONDS * 1000, true);
      const response = buildSessionResponse(true, email, account.role);
      response.cookies.set(CMS_SESSION_COOKIE, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: CMS_SESSION_MAX_AGE_SECONDS,
      });
      return response;
    }

    if (!password) {
      return NextResponse.json({ success: false, error: "Credenciales incompletas" }, { status: 400 });
    }

    const envAdminEmail = process.env.CMS_ADMIN_EMAIL?.trim().toLowerCase();
    const envAdminPassword = process.env.CMS_ADMIN_PASSWORD;

    let role: string | null = null;

    if (envAdminEmail && envAdminPassword && email === envAdminEmail && password === envAdminPassword) {
      role = "admin";
    } else if (password === getMasterKey()) {
      role = "admin";
    } else if (account.password && password === account.password) {
      role = account.role;
    }

    if (!role) {
      return NextResponse.json({ success: false, error: "Credenciales inválidas" }, { status: 401 });
    }

    const token = createSessionToken(email, role);
    const response = buildSessionResponse(true, email, role);
    response.cookies.set(CMS_SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: CMS_SESSION_MAX_AGE_SECONDS,
    });
    return response;
  } catch {
    return NextResponse.json({ success: false, error: "Error procesando la solicitud" }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(CMS_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}

export async function GET(req: Request) {
  const session = getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ success: false, authenticated: false }, { status: 401 });
  }
  return NextResponse.json({
    success: true,
    authenticated: true,
    email: session.email,
    role: session.role,
    demo: !!session.demo,
  });
}
