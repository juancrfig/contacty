"use client";

import React, { useState } from "react";
import styles from "@/app/(auth)/login/AuthForm.module.css";

export default function LoginPage() {
    // State to toggle between Login and Sign Up mode
    const [isLoginMode, setIsLoginMode] = useState(true);

    const toggleMode = () => {
        setIsLoginMode((prevMode) => !prevMode);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Access form data
        const formData = new FormData(event.currentTarget);
        const username = formData.get("username");
        const password = formData.get("password");
        const email = formData.get("email");

        if (isLoginMode) {
            console.log("Logging in with:", { username, password });
            // Implement your login API call here
        } else {
            console.log("Signing up with:", { username, password, email });
            // Implement your sign up API call here
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.formCard}>
                <h1 className={styles.title}>
                    {isLoginMode ? "Welcome Back!" : "Create Account"}
                </h1>

                {/* We add a class to the form based on the mode for CSS targeting */}
                <form onSubmit={handleSubmit} className={isLoginMode ? styles.loginMode : styles.signupMode}>
                    <input
                        className={styles.input}
                        type="text"
                        name="username"
                        placeholder="Username"
                        required
                    />

                    {/* The email input is always in the DOM for the animation to work */}
                    <input
                        className={`${styles.input} ${styles.emailInput}`}
                        type="email"
                        name="email"
                        placeholder="Email"
                        // The 'required' attribute is toggled with the mode
                        required={!isLoginMode}
                    />

                    <input
                        className={styles.input}
                        type="password"
                        name="password"
                        placeholder="Password"
                        required
                    />

                    <button type="submit" className={styles.button}>
                        {isLoginMode ? "Login" : "Sign Up"}
                    </button>
                </form>

                <p className={styles.toggleText}>
                    {isLoginMode ? "Don't have an account?" : "Already have an account?"}
                    <button onClick={toggleMode} className={styles.toggleButton}>
                        {isLoginMode ? "Sign Up" : "Login"}
                    </button>
                </p>
            </div>
        </div>
    );
}