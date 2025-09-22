"use client";

import React from "react";

export default function LoginPage() {
    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        // Implement login logic here
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <input type="text" placeholder="Username" />
                <input type="password" placeholder="" />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}