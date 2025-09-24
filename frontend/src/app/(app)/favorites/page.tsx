"use client";

import React, { useState, useEffect } from 'react';
import List from "@/app/components/List";
import ContactCard from "@/app/components/ContactCard";
import { Contact } from '@/app/types/Contact'; // Assuming you have this type definition

export default function OverviewPage() {
    // 1. State to store the full list of contacts
    const [contacts, setContacts] = useState<Contact[]>([]);

    // 2. useEffect to fetch data when the component mounts
    useEffect(() => {
        // Define an async function inside the effect
        const fetchContacts = async () => {
            try {
                const response = await fetch('/api/getContacts?favorite=true');
                if (!response.ok) {
                    const errorData = await response.json(); // Get the response body
                    throw new Error(`Network response was not ok: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
                }
                const data: Contact[] = await response.json();
                setContacts(data);
            } catch (error) {
                console.error("Failed to fetch contacts:", error);
            }
        };

        fetchContacts();
    }, []); // The empty dependency array ensures this runs only once on mount

    // 3. Handler function to remove a contact from the list
    const handleRemoveContact = (id: number) => {
        // Update the state by filtering out the contact with the matching id
        setContacts(currentContacts =>
            currentContacts.filter(contact => contact.id !== id)
        );
    };

    // 4. Filter the contacts to get only the favorites before rendering
    const favoriteContacts = contacts.filter(contact => contact.favorite);

    return (
        <div>
            <List title="Favorites">
                {/* 5. Map over the filtered list and render a ContactCard for each */}
                {favoriteContacts.map(contact => (
                    <ContactCard
                        key={contact.id} // Essential for list rendering in React
                        first_name={contact.first_name}
                        last_name={contact.last_name}
                        email={contact.email}
                        picture={contact.picture}
                        onRemove={() => handleRemoveContact(contact.id)}
                    />
                ))}
            </List>
        </div>
    );
}