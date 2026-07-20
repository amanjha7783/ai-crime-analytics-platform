import { NextRequest, NextResponse } from "next/server";

/**
 * Public routes that do NOT require authentication.
 * Everything else redirects to /login when no token is present.
 */
const PUBLIC_PATHS = new Set(["/", "/login", "/landing"]);

/**
 * Prefixes that should always be allowed through (static assets, API proxy, etc.)
 */
const ALWAYS_ALLOW_PREFIXES = ["/_next", "/favicon", "/api", "/public"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /* Let static assets and internal Next.js routes through */
  if (ALWAYS_ALLOW_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  /* Let explicitly public pages through */
  if (PUBLIC_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  /*
   * Check for the auth token.
   *
   * Since we store the token in localStorage (client-side), the middleware
   * can't read it directly.  We set a lightweight cookie "authed=1"
   * from the client whenever a login succeeds, and clear it on logout.
   * If that cookie is absent we redirect to /login.
   *
   * This is a UX guard, NOT a security boundary — the real auth check
   * happens on the backend when the Bearer token is validated.
   */
  const authedCookie = request.cookies.get("authed");

  if (!authedCookie || authedCookie.value !== "1") {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except static files and images.
     * https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
