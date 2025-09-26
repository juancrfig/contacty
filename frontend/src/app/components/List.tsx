import React from 'react';
import styles from '@/app/components/List.module.css';
import ContactCard from '@/app/components/ContactCard';
import { useContacts } from '@/app/hooks/useContacts';

interface ListProps {
    title: 'Favorites' | 'Contacts';
}

const List = ({ title }: ListProps) => {
    const {
        contacts,
        error,
        handleRemoveContact,
        handleToggleFavorite,
        handleUpdatePicture
    } = useContacts(title === 'Favorites');

    if (error) {
        return <p className={styles.errorText}>Failed to load contacts: {error}</p>;
    }

    return (
        <section className={styles.listContainer}>
            <header className={styles.header}>
                <h2 className={styles.title}>{title}</h2>
                <div className={styles.line}></div>
            </header>
            <main className={styles.gridContainer}>
                {contacts.map(contact => (
                    <ContactCard
                        key={contact.id}
                        id={contact.id}
                        firstName={contact.firstName}
                        lastName={contact.lastName}
                        email={contact.email}
                        picture={contact.picture}

                        // Changed to 'favorite' to match the Contact type
                        favorite={contact.favorite}

                        // Pass handlers directly
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