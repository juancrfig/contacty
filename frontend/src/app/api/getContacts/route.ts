import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {Contact} from "@/app/types/Contact";

export async function GET(request: NextRequest) {
    try {
        // Get the cookie from the incoming request for authentication
        const cookieHeader = request.headers.get('Cookie');

        // Get the real API URL from environment variables
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!apiUrl) {
            return NextResponse.json(
                { message: "API URL is not configured" },
                { status: 500 }
            );
        }

        // Get the query parameters from the incoming request
        const { searchParams } = new URL(request.url);
        const favorite = searchParams.get('favorite');

        // Construct the API URL with optional favorite query parameter
        const url = favorite ? `${apiUrl}/contacts?favorite=${favorite}` : `${apiUrl}/contacts`;

        // Forward the request to the Flask API
        const apiResponse = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(cookieHeader && { 'Cookie': cookieHeader }),
            },
        });

        // Get the JSON data from the API response
        const responseData = await apiResponse.json();

        // Check if the external API call was successful
        if (!apiResponse.ok) {
            return NextResponse.json(responseData, { status: apiResponse.status });
        }

        // Map snake_case keys from Flask API to camelCase for the frontend
        const formattedData = responseData.map((contact: Contact) => ({
            id: contact.id,
            first_name: contact.firstName,
            last_name: contact.lastName,
            email: contact.email,
            picture: contact.picture,
            favorite: contact.favorite,
        }));

        // Return the successful response with formatted data
        return NextResponse.json(formattedData, { status: 200 });

    } catch (error) {
        console.error("Contact retrieval proxy error:", error);
        return NextResponse.json(
            { message: 'An internal server error occurred.' },
            { status: 500 }
        );
    }
}