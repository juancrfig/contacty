"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";

interface NavbarProps {
    onNewContact: () => void;
}

export default function Navbar({ onNewContact }: NavbarProps) {
    const pathname = usePathname();
    return (
        <header className={styles.navbar}>
            <div className={styles.logoPlaceholder}></div>
            <nav className={styles.navLinks}>
                <Link href="/" className={pathname === "/overview" ? styles.active : ""}>
                    Overview
                </Link>
                <Link
                    href="/contacts"
                    className={pathname === "/contacts" ? styles.active : ""}
                >
                    Contacts
                </Link>
                <Link
                    href="/favorites"
                    className={pathname === "/favorites" ? styles.active : ""}
                >
                    Favorites
                </Link>
                <button className={styles.newButton} onClick={onNewContact}>
                    New
                </button>
            </nav>
        </header>
    );
}