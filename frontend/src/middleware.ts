import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {

    const { pathname } = request.nextUrl;
    const hasSessionToken = request.cookies.has('access_token_cookie');

    const isAuthPage = pathname.startsWith('/login');

    // SCENARIO 1: User is on an authentication page
    if (isAuthPage) {
        if (hasSessionToken) {
            return NextResponse.redirect(new URL('/overview', request.url));
        }
        // If they don't have a token, allow them to view the page
        return NextResponse.next();
    }
    // SCENARIO 2: User is on a protected page
    if (!hasSessionToken) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
    // If they have a token, allow them to view the page
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|userIcon.png).*)'],
}