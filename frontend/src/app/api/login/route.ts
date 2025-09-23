import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        // Get the username and password from the incoming request from our frontend
        const body = await request.json();
        const { username, password } = body;

        // Get the real API URL from environment variables
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!apiUrl) {
            return NextResponse.json(
                { message: "API URL is not configured" },
                { status: 500 }
            );
        }

        // Forward the request to the real Flask API on Render
        const apiResponse = await fetch(`${apiUrl}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        // Check if the external API login was successful
        if (!apiResponse.ok) {
            const errorData = await apiResponse.json();
            // Forward the error from the Flask API back to our frontend
            return NextResponse.json(errorData, { status: apiResponse.status });
        }

        // --- THIS IS THE CRITICAL PART ---
        // The login was successful. The Flask API sent back a 'Set-Cookie' header.
        // We need to grab that header and use it in our response back to the browser.
        const setCookieHeader = apiResponse.headers.get('Set-Cookie');

        // Create a new response to send back to our frontend
        const response = NextResponse.json(
            { message: "Login successful" },
            { status: 200 }
        );

        // If the Set-Cookie header exists, add it to our response
        if (setCookieHeader) {
            response.headers.set('Set-Cookie', setCookieHeader);
        }

        return response;

    } catch (error) {
        console.error("Login proxy error:", error);
        return NextResponse.json(
            { message: 'An internal server error occurred.' },
            { status: 500 }
        );
    }
}
