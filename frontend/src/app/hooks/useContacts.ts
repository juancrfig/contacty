import { useState, useEffect, useCallback } from 'react';
import { Contact } from '@/app/types/Contact';

/**
 * Custom hook to fetch and manage a list of contacts.
 * It handles fetching all contacts or only favorites, and provides
 * functions for optimistic UI updates (remove, toggle favorite, update picture).
 * @param {boolean} fetchFavorites - If true, fetches only favorite contacts.
 */
export const useContacts = (fetchFavorites: boolean) => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchContactsAsync = async () => {
            try {
                // Determine the API endpoint based on the fetchFavorites flag
                const url = fetchFavorites ? '/api/getContacts?favorite=true' : '/api/getContacts';
                const response = await fetch(url);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`API Error: ${response.status} - ${JSON.stringify(errorData)}`);
                }
                const data: Contact[] = await response.json();
                setContacts(data);
            } catch (err) {
                console.error("Failed to fetch contacts:", err);
                // Set a user-friendly error message
                setError("Failed to load contacts. Please try again later.");
            }
        };

        fetchContactsAsync();
    }, [fetchFavorites]); // Dependency array ensures this runs when fetchFavorites changes

    /**
     * Removes a contact from the local state (optimistic update).
     */
    const handleRemoveContact = useCallback((id: number) => {
        setContacts(currentContacts => currentContacts.filter(contact => contact.id !== id));
        // NOTE: In a real app, you would also send a request to your API
        // to delete the contact from the database.
        // ex: fetch(`/api/contacts/${id}`, { method: 'DELETE' });
    }, []);

    /**
     * Toggles the 'favorite' status of a contact (optimistic update).
     */
    const handleToggleFavorite = useCallback((id: number) => {
        setContacts(currentContacts =>
            currentContacts.map(contact =>
                contact.id === id ? { ...contact, favorite: !contact.favorite } : contact
            )
        );
        // NOTE: Also send a PATCH request to your API to persist the change.
    }, []);

    /**
     * Updates the picture URL of a contact (optimistic update).
     */
    const handleUpdatePicture = useCallback((id: number, newUrl: string) => {
        setContacts(currentContacts =>
            currentContacts.map(contact =>
                contact.id === id ? { ...contact, picture: newUrl } : contact
            )
        );
        // NOTE: Also send a PATCH request to your API.
    }, []);

    // Return the state and the memoized handlers
    return { contacts, error, handleRemoveContact, handleToggleFavorite, handleUpdatePicture };
};