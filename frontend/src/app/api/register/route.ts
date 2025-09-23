import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        // 1. Get user details from the incoming request from our frontend
        const body = await request.json();
        const { username, email, password } = body;

        // 2. Get the real API URL from environment variables
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!apiUrl) {
            return NextResponse.json(
                { message: "API URL is not configured" },
                { status: 500 }
            );
        }

        // 3. Forward the registration request to the real Flask API
        const apiResponse = await fetch(`${apiUrl}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        });

        // 4. Get the JSON response from the Flask API
        const data = await apiResponse.json();

        // 5. Check if the registration was successful and forward the response
        //    We send back the data and the original status code from the Flask API.
        if (!apiResponse.ok) {
            return NextResponse.json(data, { status: apiResponse.status });
        }

        return NextResponse.json(data, { status: 201 }); // 201 Created is a common status for successful registration

    } catch (error) {
        console.error("Registration proxy error:", error);
        return NextResponse.json(
            { message: 'An internal server error occurred.' },
            { status: 500 }
        );
    }
}