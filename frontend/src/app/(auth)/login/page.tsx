"use client";

import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import styles from "@/app/(auth)/login/AuthForm.module.css";
import Toast from "@/app/components/Toast";

export default function LoginPage() {
    const router = useRouter();


    const [isLoginMode, setIsLoginMode] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const toggleMode = () => {
        setIsLoginMode((prevMode) => !prevMode);
        setToast(null);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setToast(null);


        const apiUrl = process.env.NEXT_PUBLIC_API_URL;


        try {
            if (isLoginMode) {
                const response = await fetch(`${apiUrl}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password }),
                    credentials: 'include',
                });

                if (!response.ok) {
                    const data = await response.json();
                    setToast({ message: data.message || 'Invalid credentials.', type: 'error' });
                    setIsLoading(false);
                    return;
                }
                router.push('/overview');


            } else {
                const response = await fetch(`${apiUrl}/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password }),
                });

                const data = await response.json();

                if (!response.ok) {
                    setToast({ message: data.message || 'Sign up failed.', type: 'error' });
                    setIsLoading(false);
                    return;
                }

                // On successful signup, immediately switch to login mode and clear the form.
                setIsLoginMode(true);
                setUsername('');
                setEmail('');
                setPassword('');
            }
        } catch (err: unknown) {
            setToast({ message: "An unexpected network error occurred.", type: 'error' });
            setIsLoading(false);
        } finally {
            // This now correctly handles setting loading to false for all cases,
            // including the simplified signup success path.
            setIsLoading(false);
        }
    };

    return (
        <>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onCloseAction={() => setToast(null)}
                />
            )}

            <div className={styles.container}>
                <div className={styles.formCard}>
                    <h1 className={styles.title}>
                        {isLoginMode ? "Welcome Back!" : "Create Account"}
                    </h1>

                    <form onSubmit={handleSubmit} className={isLoginMode ? styles.loginMode : styles.signupMode}>
                        <input
                            className={styles.input} type="text" name="username" placeholder="Username" required
                            value={username} onChange={(e) => setUsername(e.target.value)} disabled={isLoading}
                        />
                        <input
                            className={`${styles.input} ${styles.emailInput}`} type="email" name="email" placeholder="Email"
                            required={!isLoginMode} value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading}
                        />
                        <input
                            className={styles.input} type="password" name="password" placeholder="Password" required
                            value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading}
                        />
                        <button type="submit" className={styles.button} disabled={isLoading}>
                            {isLoading ? 'Processing...' : (isLoginMode ? "Login" : "Sign Up")}
                        </button>
                    </form>

                    <p className={styles.toggleText}>
                        {isLoginMode ? "Don't have an account?" : "Already have an account?"}
                        <button onClick={toggleMode} className={styles.toggleButton} disabled={isLoading}>
                            {isLoginMode ? "Sign Up" : "Login"}
                        </button>
                    </p>
                </div>
            </div>
        </>
    );
}