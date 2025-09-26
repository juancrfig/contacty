import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function PATCH(
    request: NextRequest,
    { params }: { params: { contact_id: string } }
) {
    try {
        const { contact_id } = params;
        const body = await request.json(); // Expects { "url": "..." }
        const cookieHeader = request.headers.get('Cookie');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!apiUrl) {
            return NextResponse.json({ message: "API URL not configured" }, { status: 500 });
        }

        // Note the /url suffix to match your Flask route
        const apiResponse = await fetch(`${apiUrl}/contacts/${contact_id}/url`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                ...(cookieHeader && { 'Cookie': cookieHeader }),
            },
            body: JSON.stringify(body),
        });

        const responseData = await apiResponse.json();
        if (!apiResponse.ok) {
            return NextResponse.json(responseData, { status: apiResponse.status });
        }

        return NextResponse.json(responseData, { status: 200 });

    } catch (error) {
        console.error("Update URL proxy error:", error);
        return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
    }
}