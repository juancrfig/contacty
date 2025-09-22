import "./globals.css";
import React, { ReactNode } from "react";
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
    metadataBase: new URL("https://contacty-sand.vercel.app/"),
    title: {
        template: '%s | Contacty',
        default: 'Contacty - Simple Contact Manager',
    },
    description: "Manage your contacts easily with Contacty",
    icons: {
        icon: "/userIcon.png",
        apple: "/userIcon.png",
    },
    robots: "index, follow",
    authors: [{ name: "Juanes" }],
    openGraph: {
        title: "Contacty - Simple Contact Manager",
        description: "Manage your contacts easily with Contacty",
        url: "https://contacty-sand.vercel.app/",
        siteName: "Contacty",
        images: [
            {
                url: "/userIcon.png",
                width: 1200,
                height: 630,
                alt: "Contacty App Icon",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Contacty",
        description: "Manage your contacts easily",
        images: ["/userIcon.png"],
        creator: "@juancrfig",
    },
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
};


export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
        <body>{children}</body>
        </html>
    );
}