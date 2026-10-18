import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { CMS_SESSION_COOKIE, verifySessionTokenWeb } from "@/lib/cmsAuthWeb";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/portal" || pathname.startsWith("/portal/")) {
    const token = req.cookies.get(CMS_SESSION_COOKIE)?.value;
    const session = await verifySessionTokenWeb(token);

    if (!session) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.search = `?next=${encodeURIComponent(pathname)}`;
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/portal", "/portal/:path*"],
};
