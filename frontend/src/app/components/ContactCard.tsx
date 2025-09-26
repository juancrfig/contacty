// app/components/ContactCard.tsx
'use client';

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { usePathname } from 'next/navigation';
import styles from "@/app/components/ContactCard.module.css";
import Modal from "@/app/components/Modal";

type ActionVariant = 'overview' | 'contacts' | 'favorites';

interface ContactCardProps {
    id: number; // Changed from string to number
    firstName?: string;
    lastName: string;
    email: string;
    picture?: string;
    favorite: boolean; // Changed from isFavorite to favorite
    onRemove: (id: number) => void; // Expects number
    onToggleFavorite: (id: number) => void; // Expects number
    onUpdatePicture: (id: number, newUrl: string) => void; // Expects number
}

const ContactCard: React.FC<ContactCardProps> = ({
                                                     id,
                                                     firstName,
                                                     lastName,
                                                     email,
                                                     picture,
                                                     favorite, // Changed from isFavorite
                                                     onRemove,
                                                     onToggleFavorite,
                                                     onUpdatePicture,
                                                 }) => {
    const pathname = usePathname();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newUrl, setNewUrl] = useState("");

    const fullName = useMemo(() => `${firstName || ''} ${lastName}`.trim(), [firstName, lastName]);

    const variant: ActionVariant = useMemo(() => {
        if (pathname.startsWith('/contacts')) return 'contacts';
        if (pathname.startsWith('/favorites')) return 'favorites';
        return 'overview';
    }, [pathname]);

    const handleSavePicture = () => {
        if (newUrl.trim()) {
            onUpdatePicture(id, newUrl);
        }
        setIsModalOpen(false);
        setNewUrl("");
    };

    const Actions = () => {
        switch (variant) {
            case 'contacts':
                return (
                    <div className={styles.iconActions}>
                        <button onClick={() => onToggleFavorite(id)} className={`${styles.iconButton} ${favorite ? styles.favoriteActive : ''}`}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                        </button>
                        <button onClick={() => onRemove(id)} className={`${styles.iconButton} ${styles.deleteButton}`}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                        </button>
                    </div>
                );
            case 'favorites':
                return (
                    <>
                        <hr className={styles.divider} />
                        <button onClick={() => onRemove(id)} className={styles.removeButton}>
                            <span className={styles.removeIcon}>&times;</span> REMOVE
                        </button>
                    </>
                );
            case 'overview':
            default:
                return (
                    <>
                        <hr className={styles.divider} />
                        {favorite ? ( // Changed from isFavorite
                            <button onClick={() => onRemove(id)} className={styles.removeButton}>
                                <span className={styles.removeIcon}>&times;</span> REMOVE
                            </button>
                        ) : (
                            <div className={styles.iconActions}>
                                <button onClick={() => onToggleFavorite(id)} className={`${styles.iconButton} ${styles.favoriteInactive}`}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                                </button>
                            </div>
                        )}
                    </>
                );
        }
    };

    return (
        <>
            <div className={styles.card}>
                <div className={`${styles.avatarContainer} ${favorite ? styles.favoriteBorder : ''}`}> {/* Changed from isFavorite */}
                    {picture ? (
                        <Image
                            src={picture}
                            alt={`${fullName}'s avatar`}
                            width={94}
                            height={94}
                            className={styles.avatar}
                            unoptimized
                        />
                    ) : (
                        <div className={styles.placeholderAvatar}></div>
                    )}
                    <div className={styles.avatarOverlay} onClick={() => setIsModalOpen(true)}>
                        Edit
                    </div>
                </div>

                <div className={styles.info}>
                    <h3 className={styles.name}>{fullName}</h3>
                    <p className={styles.email}>{email}</p>
                </div>

                <Actions />
            </div>

            {isModalOpen && (
                <Modal onClose={() => setIsModalOpen(false)}>
                    <h4>Update Image URL</h4>
                    <input
                        type="text"
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                        placeholder="Paste image URL..."
                        className={styles.modalInput}
                    />
                    <div className={styles.modalButtons}>
                        <button
                            className={`${styles.modalButton} ${styles.cancelButton}`}
                            onClick={() => setIsModalOpen(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className={`${styles.modalButton} ${styles.saveButton}`}
                            onClick={handleSavePicture}
                        >
                            Save
                        </button>
                    </div>
                </Modal>
            )}
        </>
    );
};

export default ContactCard;