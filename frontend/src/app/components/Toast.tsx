"use client";

import React, { useEffect } from "react";
import styles from "@/app/components/Toast.module.css";

type ToastProps = {
    message: string;
    type: 'success' | 'error';
    onCloseAction: () => void;
};

export default function Toast({ message, type, onCloseAction }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onCloseAction();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onCloseAction]);

    const toastTypeStyle = type == 'error' ? styles.error : styles.success;

    return (
        <div className={`${styles.toast} ${toastTypeStyle}`}>
            <p className={styles.message}>{message}</p>
            <button onClick={onCloseAction} className={styles.closeButton}>
                &times;
            </button>
        </div>
    );
}