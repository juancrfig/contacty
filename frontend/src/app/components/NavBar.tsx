import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styles from "./Navbar.module.css";
import { useContactContext } from "@/app/context/ContactContext"; // 1. Import the context hook
import { FaRegSave } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

interface NavbarProps {
    onNewContact: () => void;
}

export default function Navbar({ onNewContact }: NavbarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { saveContactsToDB } = useContactContext(); // 2. Get the save function from the context

    const handleLogout = async () => {
        try {
            const res = await fetch("/api/logout", { method: "POST" });
            if (res.ok) {
                router.refresh();
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
                <Link href="/contacts" className={pathname === "/contacts" ? styles.active : ""}>
                    Contacts
                </Link>
                <Link href="/favorites" className={pathname === "/favorites" ? styles.active : ""}>
                    Favorites
                </Link>
                <button className={styles.newButton} onClick={onNewContact}>
                    New
                </button>
                {/* 3. Add the new Save button before the Log Out button */}
                <button className={styles.saveButton} onClick={saveContactsToDB}>
                    <FaRegSave size={18}/>
                </button>
                <button className={styles.logoutButton} onClick={handleLogout}>
                    <FiLogOut size={18}/>
                </button>
            </nav>
        </header>
    );
}