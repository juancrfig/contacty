"use client";

import React, { useEffect } from "react";
import styles from "@/app/components/Toast.module.css";

type ToastProps = {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
};

export default function Toast({ message, type, onClose }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const toastTypeStyle = type == 'error' ? styles.error : styles.success;

    return (
        <div className={`${styles.toast} ${toastTypeStyle}`}>
            <p className={styles.message}>{message}</p>
            <button onClick={onClose} className={styles.closeButton}>
                &times;
            </button>
        </div>
    );
}