import React, { useState } from "react";
import Image from "next/image";
import styles from "@/app/components/ContactCard.module.css";
import Modal from "@/app/components/Modal";

interface ContactCardProps {
    lastName: string;
    email: string;
    picture?: string;
    onRemove: () => void;
    firstName?: string;
}

const ContactCard: React.FC<ContactCardProps> = ({
                                                     firstName,
                                                     email,
                                                     picture,
                                                     onRemove,
                                                     lastName,
                                                 }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newUrl, setNewUrl] = useState("");
    const [currentPicture, setCurrentPicture] = useState(picture);

    const handleSave = () => {
        if (newUrl.trim()) {
            setCurrentPicture(newUrl); // later we’ll call the API instead
        }
        setIsModalOpen(false);
        setNewUrl("");
    };

    return (
        <div className={styles.card}>
            <div className={styles.avatarContainer}>
                {currentPicture ? (
                    <Image
                        src={currentPicture}
                        alt={`${firstName} ${lastName}'s avatar`}
                        width={94}
                        height={94}
                        className={styles.avatar}
                        unoptimized
                    />
                ) : (
                    <div className={styles.placeholderAvatar}></div>
                )}

                {/* Hover overlay */}
                <div
                    className={styles.avatarOverlay}
                    onClick={() => setIsModalOpen(true)}
                >
                    Edit
                </div>
            </div>

            <div className={styles.info}>
                <h3 className={styles.name}>
                    {firstName} {lastName}
                </h3>
                <p className={styles.email}>{email}</p>
            </div>

            <hr className={styles.divider} />

            <button onClick={onRemove} className={styles.removeButton}>
                <span className={styles.removeIcon}>&times;</span> REMOVE
            </button>

            {/* Modal */}
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
                            onClick={handleSave}
                        >
                            Save
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default ContactCard;
