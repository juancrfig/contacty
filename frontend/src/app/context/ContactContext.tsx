'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { Contact } from '@/app/types/Contact';
import {useRouter} from "next/navigation";
import {usePathname} from "next/navigation";

interface ContactContextType {
    contacts: Contact[];
    isLoading: boolean;
    error: string | null;
    handleAddContact: (contactData: {
        firstName: string;
        lastName: string;
        email: string;
        favorite: boolean,
        picture?: string
    }) => Promise<void>;
    handleRemoveContact: (id: number) => void;
    handleToggleFavorite: (id: number) => void;
    handleUpdatePicture: (id: number, newUrl: string) => void;
}

const ContactContext = createContext<ContactContextType | undefined>(undefined);

export const ContactProvider = ({ children }: { children: ReactNode }) => {
    const router = useRouter();
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hasLoaded, setHasLoaded] = useState(false);
    const pathname = usePathname();


    useEffect(() => {
        // Async's function definition for data fetching
        const loadContacts = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/api/getContacts');
                if (response.status === 401) {
                    try {
                        const res = await fetch('/api/logout', {method: "POST"});
                        if (res.ok) {
                          router.push("/login");
                        } else {
                            console.error("Logout failed");
                        }
                    } catch (err) {
                        console.error("Logout error", err);
                    }
                    // Return early after handling 401 to prevent futher errors
                    return;
                }
                if (!response.ok) {
                    console.log("Failure: ", response);
                    throw new Error('Failure to fetch contacts from API');
                }
                const data: Contact[] = await response.json();
                setContacts(data);
                setHasLoaded(true);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setIsLoading(false);
            }
        };

        if (pathname !== '/login' && !hasLoaded) {
            loadContacts();
        } else if (pathname === '/login') {
            setContacts([]);
            setHasLoaded(false);
            setIsLoading(false);
        }
    }, [pathname, hasLoaded]);

    const handleAddContact = useCallback(async (contactData: {
        firstName: string;
        lastName: string;
        email: string;
        favorite: boolean;
        picture?: string;
    })=> {
        const picture = contactData.picture ?? 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg';
        // 1. Create a temporary contact with a unique temporary ID
        // We'll use this to identify it in the UI before we get the real ID from the server
        const tempId = Date.now();
        const tempContact: Contact = {
            ...contactData,
            id: tempId,
            picture
        };
        // 2. Optimistically update the UI immediately with the temporary contact
        setContacts(prev => [...prev, tempContact]);

        try {
            contactData.picture = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg';
            console.log(contactData);
            // 3. Send the request to the server in the background
            const response = await fetch('/api/createContact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contactData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create contact');
            }

            const rawContact = await response.json();

            // 4. Once successful, create the final contact object with the real ID from the server
            const finalContact = {
                id: rawContact.id,
                firstName: rawContact.first_name,
                lastName: rawContact.last_name,
                email: rawContact.email,
                favorite: rawContact.favorite,
                picture
            };

            // 5. Swap the temporary contact with the fina one in the state
            setContacts(prev => prev.map(c => (c.id === tempId ? finalContact: c)));

        } catch (err) {
            // 6. If API call fails, alert the user and roll back the optimistic update
            alert(`Error: Could not create contact. ${err instanceof Error ? err.message : 'Please try again'}`);
            setContacts(prev => prev.filter(c => c.id !== tempId));
        }
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
    }, [contacts]); // <-- Dependency array is now empty

    const handleToggleFavorite = useCallback(async (id: number) => {
        const originalContacts = [...contacts];
        const contact = contacts.find(c => c.id === id);

        if (!contact) return;

        const updatedContact = { ...contact, favorite: !contact.favorite };
        setContacts(prev => prev.map(c => c.id === id ? updatedContact : c));
        try {
            const response = await fetch(`/api/contacts/${id}/favorite`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ favorite: updatedContact.favorite }),
            });

            if (!response.ok) throw new Error("Failed to upload favorite status.");
        } catch (err) {
            console.log(err);
            setContacts(originalContacts);
            alert("Error: Could not update favorite status.");
        }
    }, [contacts]);

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
    }, [contacts]); // <-- Dependency array is now empty

    const value = {
        contacts,
        isLoading,
        error,
        handleRemoveContact,
        handleToggleFavorite,
        handleUpdatePicture,
        handleAddContact
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