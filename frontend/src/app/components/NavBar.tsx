"use client";

import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import styles from "./Navbar.module.css";

interface NavbarProps {
    onNewContact: () => void;
}

export default function Navbar({ onNewContact }: NavbarProps) {
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = async () => {
        try {
            const res = await fetch("/api/logout", { method: "POST" });
            if (res.ok) {
                router.refresh();   // forces re-evaluation of middleware
                router.push("/login");
            } else {
                console.error("Logout failed");
            }
        } catch (err) {
            console.error("Logout error", err);
        }
    };

    return (
        <header className={styles.navbar}>
            <div className={styles.logoPlaceholder}></div>
            <nav className={styles.navLinks}>
                <Link href="/overview" className={pathname === "/overview" ? styles.active : ""}>
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
                <button className={styles.logoutButton} onClick={handleLogout}>
                    Log Out
                </button>
            </nav>
        </header>
    );
}