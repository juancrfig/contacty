"use client";

import React, { useEffect, useState } from "react";
import ContactCard from "./ContactCard";
import styles from "./List.module.css";

const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc1Nzk0NDk0OCwianRpIjoiMTgwMTgwMGYtYjMzMi00NTVlLWEyM2ItMWE3NDc4MWVkZDBhIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjEiLCJuYmYiOjE3NTc5NDQ5NDgsImNzcmYiOiI2MmY0MzY1Zi01ZDI1LTQ4MTAtODdjMC03ZDg3ZThkYzY4MTIifQ.aVx28Oc2jUsmSTtn-BthvohSI-R-wLwGcE_D4aGgZyQ";

interface Contact {
    id: number;
    name: string;
    email: string;
    avatarUrl?: string;
    isFavorite: boolean;
}

interface ListProps {
    showFavorites: boolean;
}

const List: React.FC<ListProps> = ({ showFavorites }) => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchContacts = async () => {
            setLoading(true);
            try {
                const response = await fetch("http://127.0.0.1:5000/contacts", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.json();

                const formattedContacts = data.map((contact: any) => ({
                    id: parseInt(contact.id, 10), // Convert string ID to number
                    name: `${contact.first_name} ${contact.last_name}`, // Combine first and last name
                    email: contact.email,
                    isFavorite: contact.favorite, // Map 'favorite' to 'isFavorite'
                    avatarUrl: contact.avatarUrl || undefined, // Handle optional avatar
                }));

                // Set the correctly shaped data into state
                setContacts(formattedContacts);
            } catch (error) {
                console.error("Failed to fetch contacts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchContacts();
    }, []);

    const filteredContacts = showFavorites
        ? contacts.filter((contact) => contact.isFavorite)
        : contacts;

    return (
        <div className={styles.container}>
        <div className={styles.headerRow}>
        <span className={styles.title}>
            {showFavorites ? "Favorites" : "Contact List"}
            </span>
            <div className={styles.greenLine}></div>
        </div>
    {loading ? (
        <div>Loading...</div>
    ) : (
        <div className={styles.cardGrid}>
            {filteredContacts.map((contact) => (
                    <ContactCard
                        key={contact.id}
                name={contact.name}
                email={contact.email}
                picture={contact.avatarUrl}
                onRemove={() =>
        console.log(`Remove contact with id: ${contact.id}`)
    }
        />
    ))}
        </div>
    )}
    </div>
);
};

export default List;