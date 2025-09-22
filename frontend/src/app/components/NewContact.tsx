"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "@/app/components/NewContact.module.css";

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

const NewContact: React.FC<NewContactProps> = ({ open, onClose, onSave }) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [favorite, setFavorite] = useState(false);

    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (!open) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [open, onClose]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ firstName, lastName, email, favorite });
        onClose();
        setFirstName("");
        setLastName("");
        setEmail("");
        setFavorite(false);
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (formRef.current && !formRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

    if (!open) return null;

    return (
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
    );
};

export default NewContact;