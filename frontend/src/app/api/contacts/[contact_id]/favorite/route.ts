import {NextRequest, NextResponse} from 'next/server';

export async function PATCH(
    request: NextRequest,
    { params }: { params: { contact_id: string } }
) {
    try {
        const {contact_id} = params;
        const cookieHeader = request.headers.get('Cookie');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!apiUrl) {
            return NextResponse.json({message: "API URL not configured"}, {status: 500});
        }

        const apiResponse = await fetch(`${apiUrl}/contacts/${contact_id}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                ...(cookieHeader && {'Cookie': cookieHeader})
            }
        });

        const responseData = await apiResponse.json();
        if (!apiResponse.ok) {
            return NextResponse.json(responseData, {status: apiResponse.status});
        }

        // The Flask API returns the updated contact, which we can forward
        return NextResponse.json(responseData, {status: 200});

    } catch (error) {
        console.log("Favorite toggle proxy error: ", error);
        return NextResponse.json({ message: 'An internal server error occurred'},  { status: 500});
    }
}