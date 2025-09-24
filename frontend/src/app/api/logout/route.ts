// app/api/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();

        // Forward the Set-Cookie headers
        const response = NextResponse.json(data, { status: res.status });
        const setCookie = res.headers.get("set-cookie");
        if (setCookie) {
            response.headers.set("set-cookie", setCookie);
        }

        return response;
    } catch (err) {
        return NextResponse.json(
            { message: "Logout failed", error: (err as Error).message },
            { status: 500 }
        );
    }
}
