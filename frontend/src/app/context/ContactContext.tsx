'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { Contact } from '@/app/types/Contact';

// Define the shape of our context's value
interface ContactContextType {
    contacts: Contact[];
    isLoading: boolean;
    error: string | null;
    handleRemoveContact: (id: number) => void;
    handleToggleFavorite: (id: number) => void;
    handleUpdatePicture: (id: number, newUrl: string) => void;
    saveContactsToDB: () => Promise<void>;
}

// Create the context with a default undefined value
const ContactContext = createContext<ContactContextType | undefined>(undefined);

// Create the Provider component
export const ContactProvider = ({ children }: { children: ReactNode }) => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Effect to load data on initial app load
    useEffect(() => {
        const loadContacts = async () => {
            try {
                setIsLoading(true);
                // We could check Local Storage here first if we want persistence
                const response = await fetch('/api/getContacts');
                if (!response.ok) throw new Error('Failed to fetch contacts from API.');

                const data: Contact[] = await response.json();
                setContacts(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "An unknown error occurred.");
            } finally {
                setIsLoading(false);
            }
        };
        loadContacts();
    }, []); // Empty dependency array means this runs only once on mount

    // Define handler functions that modify the central state
    const handleRemoveContact = useCallback((id: number) => {
        setContacts(prev => prev.filter(c => c.id !== id));
    }, []);

    const handleToggleFavorite = useCallback((id: number) => {
        setContacts(prev => prev.map(c => c.id === id ? { ...c, favorite: !c.favorite } : c));
    }, []);

    const handleUpdatePicture = useCallback((id: number, newUrl: string) => {
        setContacts(prev => prev.map(c => c.id === id ? { ...c, picture: newUrl } : c));
    }, []);

    // New function to save the current state back to the database
    const saveContactsToDB = async () => {
        try {
            // Here you would implement the API call to your backend
            console.log("Saving contacts to DB:", contacts);
            const response = await fetch('/api/saveContacts', { // Assuming this endpoint exists
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contacts),
            });

            if (!response.ok) {
                throw new Error('Failed to save contacts.');
            }
            alert('Contacts saved successfully!');
        } catch (err) {
            console.error(err);
            alert('Error saving contacts.');
        }
    };

    const value = {
        contacts,
        isLoading,
        error,
        handleRemoveContact,
        handleToggleFavorite,
        handleUpdatePicture,
        saveContactsToDB,
    };

    return <ContactContext.Provider value={value}>{children}</ContactContext.Provider>;
};

// Custom hook for easy access to the context
export const useContactContext = () => {
    const context = useContext(ContactContext);
    if (context === undefined) {
        throw new Error('useContactContext must be used within a ContactProvider');
    }
    return context;
};