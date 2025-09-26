import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function DELETE(
    request: NextRequest,
    { params }: { params: { contact_id: string } }
) {
    try {
        const { contact_id } = params;
        const cookieHeader = request.headers.get('Cookie');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!apiUrl) {
            return NextResponse.json({ message: "API URL not configured" }, { status: 500 });
        }

        // Your Flask route is /contacts/<id>, so we use that here
        const apiResponse = await fetch(`${apiUrl}/contacts/${contact_id}`, {
            method: 'DELETE',
            headers: {
                ...(cookieHeader && { 'Cookie': cookieHeader }),
            },
        });

        if (!apiResponse.ok) {
            const errorData = await apiResponse.json();
            return NextResponse.json(errorData, { status: apiResponse.status });
        }

        // Flask returns a message on success, which we can forward
        const responseData = await apiResponse.json();
        return NextResponse.json(responseData, { status: 200 });

    } catch (error) {
        console.error("Delete contact proxy error:", error);
        return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
    }
}