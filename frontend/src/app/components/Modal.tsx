import React, { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "@/app/components/ContactCard.module.css";

interface ModalProps {
    children: ReactNode;
    onClose: () => void;
}

const Modal = ({ children, onClose }: ModalProps) => {
    useEffect(() => {
        // lock scroll
        document.body.style.overflow = "hidden";
        return () => {
            // unlock scroll
            document.body.style.overflow = "";
        };
    }, []);

    if (typeof document === "undefined") return null;

    return createPortal(
        <div className={styles.modal} onClick={onClose}>
            <div
                className={styles.modalContent}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>,
        document.body
    );
};

export default Modal;
