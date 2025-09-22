import React from "react";
import Image from "next/image";
import styles from "./ContactCard.module.css";

interface ContactCardProps {
    name: string;
    email: string;
    picture?: string; // Optional
    onRemove: () => void; // Function to call when the remove button is clicked
}

const ContactCard: React.FC<ContactCardProps> = ({
                                                     name,
                                                     email,
                                                     picture,
                                                     onRemove,
                                                 }) => {
    return (
        <div className={styles.card}>
            <div className={styles.avatarContainer}>
                {/* Render the provided image or a placeholder */}
                {picture ? (
                    <Image
                        src={picture}
                        alt={`${name}'s avatar`}
                        width={94}
                        height={94}
                        className={styles.avatar}
                    />
                ) : (
                    <div className={styles.placeholderAvatar}>
            <span className={styles.placeholderText}>
              {name.charAt(0).toUpperCase()}
            </span>
                    </div>
                )}
            </div>

            <div className={styles.info}>
                <h3 className={styles.name}>{name}</h3>
                <p className={styles.email}>{email}</p>
            </div>

            <hr className={styles.divider} />

            <button onClick={onRemove} className={styles.removeButton}>
                <span className={styles.removeIcon}>&times;</span> REMOVE
            </button>
        </div>
    );
};

export default ContactCard;