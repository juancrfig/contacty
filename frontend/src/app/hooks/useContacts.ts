import { useState, useEffect } from 'react';
import { Contact } from '@/app/types/Contact';

// Custom hook to fetch contacts based on whether favorites are needed
export const useContacts = (fetchFavorites: boolean) => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const url = fetchFavorites ? '/api/getContacts?favorite=true' : '/api/getContacts';
                const response = await fetch(url);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Network response was not ok: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
                }
                const data: Contact[] = await response.json();
                setContacts(data);
            } catch (error) {
                console.error("Failed to fetch contacts:", error);
                setError("Failed to load contacts");
            }
        };

        fetchContacts();
    }, [fetchFavorites]); // Re-run if fetchFavorites changes

    // Handler to remove a contact from the list
    const handleRemoveContact = (id: number) => {
        setContacts(currentContacts => currentContacts.filter(contact => contact.id !== id));
    };

    return { contacts, error, handleRemoveContact };
};