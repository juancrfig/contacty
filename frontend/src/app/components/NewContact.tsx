"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "@/app/components/NewContact.module.css";
import Toast from "@/app/components/Toast";


interface NewContactProps {
    open: boolean;
    onClose: () => void;
    onSave: (contact: {
        firstName: string;
        lastName: string;
        email: string;
        favorite: boolean;
    }) => void;
}


const NewContact: React.FC<NewContactProps> = ({ open, onClose }) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [favorite, setFavorite] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (!open) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [open, onClose]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!firstName || !lastName || !email) {
            setToast({ message: "All fields are required", type: "error" });
            return;
        }

        try {
            const res = await fetch("/api/createContact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                // FIX: Send camelCase keys (firstName, lastName) to match frontend state and Next.js route destructuring
                body: JSON.stringify({ firstName, lastName, email, favorite }),
            });

            if (!res.ok) {
                // Read the error message from the response body for better debugging
                const errorData = await res.json();
                setToast({ message: errorData.message || "Failed to create contact", type: "error" });
                return;
            }

            setToast({ message: "Contact created successfully!", type: "success" });
            onClose();
            setFirstName("");
            setLastName("");
            setEmail("");
            setFavorite(false);
        } catch (error) {
            setToast({ message: `Error creating contact: ${error}`, type: "error" });
        }
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (formRef.current && !formRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

    if (!open) return null;

    return (
        <>
            <div className={styles.modal} onClick={handleBackdropClick}>
                <form
                    className={styles.form}
                    ref={formRef}
                    onClick={(e) => e.stopPropagation()}
                    onSubmit={handleSubmit}
                >
                    <button type="button" className={styles.closeButton} onClick={onClose}>
                        x
                    </button>
                    <input
                        type="text"
                        placeholder="First name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label>
                        <input
                            type="checkbox"
                            checked={favorite}
                            onChange={(e) => setFavorite(e.target.checked)}
                        />
                        Enable like favorite
                    </label>
                    <button type="submit">Save</button>
                </form>
            </div>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onCloseAction={() => setToast(null)}
                />
            )}
        </>
    );
};

export default NewContact;