import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {

    const sessionToken = request.cookies.get('access_token_cookie')?.value;
    const { pathname } = request.nextUrl;

    const isAuthPage = pathname.startsWith('/login');

    if (sessionToken && isAuthPage) {
        return NextResponse.redirect(new URL('/overview', request.url));
    }
    if (!sessionToken && !isAuthPage) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|userIcon.png).*)'],
}