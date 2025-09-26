'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { Contact } from '@/app/types/Contact';

interface ContactContextType {
    contacts: Contact[];
    isLoading: boolean;
    error: string | null;
    handleRemoveContact: (id: number) => void;
    handleToggleFavorite: (id: number) => void;
    handleUpdatePicture: (id: number, newUrl: string) => void;
}

const ContactContext = createContext<ContactContextType | undefined>(undefined);

export const ContactProvider = ({ children }: { children: ReactNode }) => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadContacts = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/api/getContacts');
                if (!response.ok) throw new Error('Failed to fetch contacts from API');
                const data: Contact[] = await response.json();
                setContacts(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "An unexpected error occurred.");
            } finally {
                setIsLoading(false);
            }
        };
        loadContacts();
    }, []);

    const handleRemoveContact = useCallback(async (id: number) => {
        const originalContacts = [...contacts];
        setContacts(prev => prev.filter(c => c.id !== id));
        try {
            const response = await fetch(`/api/contacts/${id}/delete`, { method: 'DELETE' });
            if (!response.ok) throw new Error("Failed to delete contact.");
        } catch (err) {
            console.error(err);
            setContacts(originalContacts);
            alert("Error: Could not delete contact.");
        }
    }, []); // <-- Dependency array is now empty

    const handleToggleFavorite = useCallback(async (id: number) => {
        const originalContacts = [...contacts];
        setContacts(prev => prev.map(c => c.id === id ? { ...c, favorite: !c.favorite } : c));
        try {
            const response = await fetch(`/api/contacts/${id}/favorite`, { method: 'PATCH' });
            if (!response.ok) throw new Error("Failed to update favorite status.");
        } catch (err) {
            console.error(err);
            setContacts(originalContacts);
            alert("Error: Could not update favorite status.");
        }
    }, []); // <-- Dependency array is now empty

    const handleUpdatePicture = useCallback(async (id: number, newUrl: string) => {
        const originalContacts = [...contacts];
        setContacts(prev => prev.map(c => c.id === id ? { ...c, picture: newUrl } : c));
        try {
            const response = await fetch(`/api/contacts/${id}/url`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: newUrl }),
            });
            if (!response.ok) throw new Error("Failed to update picture.");
        } catch (err) {
            console.error(err);
            setContacts(originalContacts);
            alert("Error: Could not update picture.");
        }
    }, []); // <-- Dependency array is now empty

    const value = {
        contacts,
        isLoading,
        error,
        handleRemoveContact,
        handleToggleFavorite,
        handleUpdatePicture,
    };

    return <ContactContext.Provider value={value}>{children}</ContactContext.Provider>;
};

export const useContactContext = () => {
    const context = useContext(ContactContext);
    if (context === undefined) {
        throw new Error('useContactContext must be used within a ContactProvider');
    }
    return context;
};