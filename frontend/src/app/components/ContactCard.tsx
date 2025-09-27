// app/components/ContactCard.tsx
'use client';

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { usePathname } from 'next/navigation';
import styles from "@/app/components/ContactCard.module.css";
import Modal from "@/app/components/Modal";
import { FaHeart, FaTrash } from "react-icons/fa";

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
                if (pathname.endsWith('/contacts')) {
                    return (
                        <>
                            <hr className={styles.divider} />
                                {favorite ? (
                                    <button onClick={() => onToggleFavorite(id)} className={styles.removeButton}>
                                        <span className={styles.removeIcon}>&times;</span>REMOVE
                                    </button>
                                ) : (
                                    <div className={styles.iconActions}>
                                        <button
                                            onClick={() => onToggleFavorite(id)}
                                            className={`${styles.iconButton} ${styles.favoriteButton}`}
                                        >
                                            <FaHeart size={18} />
                                        </button>
                                    </div>
                                )}
                        </>
                    );
                }
                return (
                    <>
                        <hr className={styles.divider} />
                        <div className={styles.iconActions}>
                            <button
                                onClick={() => onToggleFavorite(id)}
                                className={`${styles.iconButton} ${styles.favoriteButton}`}
                            >
                                <FaHeart size={18} />
                            </button>
                            <button
                                onClick={() => onRemove(id)}
                                className={`${styles.iconButton} ${styles.deleteButton}`}
                            >
                                <FaTrash size={18} />
                            </button>
                        </div>
                    </>
                );
            case 'favorites':
                return (
                    <>
                        <hr className={styles.divider} />
                        <button onClick={() => onToggleFavorite(id)} className={styles.removeButton}>
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
                            <button onClick={() => onToggleFavorite(id)} className={styles.removeButton}>
                                <span className={styles.removeIcon}>&times;</span> REMOVE
                            </button>
                        ) : (
                            <div className={styles.iconActions}>
                                <button
                                    onClick={() => onToggleFavorite(id)}
                                    className={`${styles.iconButton} ${styles.favoriteButton}`}
                                >
                                    <FaHeart size={18} />
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