import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        // Get the contact data from the incoming request
        const body = await request.json();
        // Destructure camelCase keys from the frontend request
        const { firstName, lastName, email, favorite } = body;

        // 1. Get the cookie from the incoming request (from the browser)
        const cookieHeader = request.headers.get('Cookie');

        // Get the real API URL from environment variables
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!apiUrl) {
            return NextResponse.json(
                { message: "API URL is not configured" },
                { status: 500 }
            );
        }

        // Forward the request to the real Flask API on Render
        const picture = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg';
        const apiResponse = await fetch(`${apiUrl}/contacts`, {

        method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 2. Add the cookie to the outgoing request to your Flask API
                // This is the crucial line that authenticates the user
                ...(cookieHeader && { 'Cookie': cookieHeader }),
            },
            // 💡 FIX: Map the camelCase variables (firstName, lastName)
            // to the snake_case keys (first_name, last_name) expected by the Flask backend
            body: JSON.stringify({ first_name: firstName , last_name: lastName, email, favorite, profile_image_url: picture }),
        });

        // Get the JSON data from the API response regardless of status
        const responseData = await apiResponse.json();

        // Check if the external API call was successful
        if (!apiResponse.ok) {
            // Forward the error from the Flask API back to our frontend
            return NextResponse.json(responseData, { status: apiResponse.status });
        }

        // On success, forward the successful data from the Flask API
        return NextResponse.json(responseData, { status: 201 }); // 201 Created

    } catch (error) {
        console.error("Contact creation proxy error:", error);
        return NextResponse.json(
            { message: 'An internal server error occurred.' },
            { status: 500 }
        );
    }
}