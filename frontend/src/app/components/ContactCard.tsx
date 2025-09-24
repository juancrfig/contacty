import React from "react";
import styles from "@/app/components/ContactCard.module.css";

interface ContactCardProps {
    lastName: string,
    email: string,
    picture?: string,
    onRemove: () => void,
    firstName?: string
}

const ContactCard: React.FC<ContactCardProps> = ({
                                                     firstName,
                                                     email,
                                                     picture,
                                                     onRemove,
                                                     lastName
                                                 }) => {

    return (
        <div className={styles.card}>
            <div className={styles.avatarContainer}>
                {picture ? (
                    <img
                        src={picture}
                        alt={`${firstName} ${lastName}'s avatar`}
                        width={94}
                        height={94}
                        className={styles.avatar}
                    />
                ) : (
                    <div className={styles.placeholderAvatar}>
            <span className={styles.placeholderText}>
                pic
            </span>
                    </div>
                )}
            </div>

            <div className={styles.info}>
                <h3 className={styles.name}>{firstName} {lastName}</h3>
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
