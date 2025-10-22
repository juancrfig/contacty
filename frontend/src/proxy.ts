import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const authRoutes = ["/login", "/signup"];

const publicRoutes: string[] = [];

// Helper function to check for path matches
// This allows for more complex matching, like dynamic routes (e.g., /blog/:slug)
function isPathInRoutes(routes: string[], pathname: string): boolean {
  return routes.some((route) => pathname.startsWith(route));
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSessionToken = request.cookies.has("access_token_cookie");

  const isAuthRoute = isPathInRoutes(authRoutes, pathname);
  const isPublicRoute = isPathInRoutes(publicRoutes, pathname);

  if (hasSessionToken) {
    if (isAuthRoute) {
      return NextResponse.redirect(new URL("/overview", request.url));
    }
    return NextResponse.next();
  }

  if (!hasSessionToken) {
    if (isAuthRoute || isPublicRoute) {
      return NextResponse.next();
    }
    const loginUrl = new URL("/login", request.url);

    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
