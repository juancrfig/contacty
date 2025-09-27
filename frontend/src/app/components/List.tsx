'use client'; // This component now uses hooks

import React, {useEffect, useMemo, useState} from 'react';
import styles from '@/app/components/List.module.css';
import ContactCard from '@/app/components/ContactCard';
import { useContactContext } from '@/app/context/ContactContext'; // Import the new context hook
import { usePathname } from 'next/navigation';
import Spinner from '@/app/components/Spinner';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';

interface ListProps {
    title: 'Favorites' | 'Contact List';
}

const List = ({ title }: ListProps) => {
    const [currentPage, setCurrentPage] = useState(1);
    const CONTACTS_PER_PAGE = 8;

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

    const totalPages = Math.ceil(filteredContacts.length / CONTACTS_PER_PAGE);
    const currentContacts = useMemo(() => {
        const indexOfLastContact = currentPage * CONTACTS_PER_PAGE;
        const indexOfFirstContact = indexOfLastContact - CONTACTS_PER_PAGE;
        return filteredContacts.slice(indexOfFirstContact, indexOfLastContact);
    }, [currentPage, filteredContacts]);

    useEffect(() => {
        if (currentContacts.length === 0 && currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    }, [currentContacts, currentPage]);

    if (isLoading) return <Spinner />;
    if (error) return <p className={styles.errorText}>{error}</p>;

    return (
        <section className={styles.listContainer}>
            <header className={styles.header}>
                <h2 className={styles.title}>{title}</h2>
                <div className={styles.line}></div>
            </header>
            <main className={styles.gridContainer}>
                {currentContacts.map(contact => (
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
            {totalPages > 1 && (
                <footer className={styles.pagination}>
                    <span className={styles.pageInfo}>
                        {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={styles.pageButton}
                    >
                       <FiArrowLeft />
                    </button>
                    <span className={styles.pageInfo}>
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={styles.pageButton}
                    >
                        <FiArrowRight />
                    </button>
                </footer>
            )}
        </section>
    );
};

export default List;