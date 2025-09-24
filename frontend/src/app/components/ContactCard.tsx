import React from "react";
import styles from "@/app/components/ContactCard.module.css";

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
        <>
            <div className="card">
                <div className="avatarContainer">
                    {/* Render the provided image or a placeholder */}
                    {picture ? (
                        <img
                            src={picture}
                            alt={`${name}'s avatar`}
                            width={94}
                            height={94}
                            className="avatar"
                        />
                    ) : (
                        <div className="placeholderAvatar">
              <span className="placeholderText">
                {name ? name.charAt(0).toUpperCase() : ""}
              </span>
                        </div>
                    )}
                </div>

                <div className="info">
                    <h3 className="name">{name}</h3>
                    <p className="email">{email}</p>
                </div>

                <hr className="divider" />

                <button onClick={onRemove} className="removeButton">
                    <span className="removeIcon">&times;</span> REMOVE
                </button>
            </div>
        </>
    );
};

export default ContactCard;
