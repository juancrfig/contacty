'use client'; // This component now uses hooks

import React, { useMemo } from 'react';
import styles from '@/app/components/List.module.css';
import ContactCard from '@/app/components/ContactCard';
import { useContactContext } from '@/app/context/ContactContext'; // Import the new context hook
import { usePathname } from 'next/navigation';

interface ListProps {
    title: 'Favorites' | 'Contact List';
}

const List = ({ title }: ListProps) => {
    // Get all contacts and handlers from the global context
    const {
        contacts,
        isLoading,
        error,
        handleRemoveContact,
        handleToggleFavorite,
        handleUpdatePicture
    } = useContactContext();
    const pathname = usePathname();

    // Memoize the filtering logic to avoid re-calculating on every render
    const filteredContacts = useMemo(() => {
        // Default to an empty array to prevent error on initial render
        const contactList = contacts || [];

        if (title === 'Favorites') {
            return contacts.filter(contact => contact && contact.favorite);
        }

        if ( (title === 'Contact List') && (pathname.endsWith('/contacts')) ) {
            return contactList;
        }
        // For the 'Contacts' list, now we only show non-favorites
        return contacts.filter(contact => contact && !contact.favorite);
    }, [contacts, title]);

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p className={styles.errorText}>{error}</p>;

    return (
        <section className={styles.listContainer}>
            <header className={styles.header}>
                <h2 className={styles.title}>{title}</h2>
                <div className={styles.line}></div>
            </header>
            <main className={styles.gridContainer}>
                {filteredContacts.map(contact => (
                    <ContactCard
                        key={contact.id}
                        id={contact.id}
                        firstName={contact.firstName}
                        lastName={contact.lastName}
                        email={contact.email}
                        picture={contact.picture}
                        favorite={contact.favorite}
                        onRemove={handleRemoveContact}
                        onToggleFavorite={handleToggleFavorite}
                        onUpdatePicture={handleUpdatePicture}
                    />
                ))}
            </main>
        </section>
    );
};

export default List;