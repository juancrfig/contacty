import React from "react";
import styles from "@/app/components/ContactCard.module.css";

interface ContactCardProps {
    last_name: string,
    email: string,
    picture?: string,
    onRemove: () => void,
    first_name?: string
}

const ContactCard: React.FC<ContactCardProps> = ({
                                                     first_name,
                                                     email,
                                                     picture,
                                                     onRemove,
                                                     last_name
                                                 }) => {
    return (
        <div className={styles.card}>
            <div className={styles.avatarContainer}>
                {picture ? (
                    <img
                        src={picture}
                        alt={`${first_name} ${last_name}'s avatar`}
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
                <h3 className={styles.name}>{first_name} {last_name}</h3>
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
