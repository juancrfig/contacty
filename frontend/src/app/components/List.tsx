import React from 'react';
import styles from '@/app/components/List.module.css';
import ContactCard from '@/app/components/ContactCard';
import { useContacts } from '@/app/hooks/useContacts';
import { Contact } from '@/app/types/Contact';

// Defining the prop interface for type safety
interface ListProps {
    title: 'Favorites' | 'Contacts'; // Restrict title to specific values
}

/**
 * A component that displays a title and a grid of contacts or favorites.
 * The grid is responsive: 2 columns on mobile, 4 on desktop.
 * @param {ListProps} props - The component props.
 * @param {string} props.title - The title to display ("Favorites" or "Contacts").
 */
const List = ({ title }: ListProps) => {
    // Use custom hook to fetch contacts; fetchFavorites is true if title is "Favorites"
    const { contacts, error, handleRemoveContact } = useContacts(title === 'Favorites');

    return (
        <section className={styles.listContainer}>
            <header className={styles.header}>
                <h2 className={styles.title}>{title}</h2>
                <div className={styles.line}></div>
            </header>
            <main className={styles.gridContainer}>
                {error && <p>{error}</p>}
                {contacts.map(contact => (
                    <ContactCard
                        key={contact.id}
                        first_name={contact.first_name}
                        last_name={contact.last_name}
                        email={contact.email}
                        picture={contact.picture}
                        onRemove={() => handleRemoveContact(contact.id)}
                    />
                ))}
            </main>
        </section>
    );
};

export default List;