"use client";

import React, { ReactNode, useState } from "react";
import Navbar from "@/app/components/NavBar";
import NewContact from "@/app/components/NewContact";

export default function AppLayout({ children }: { children: ReactNode }) {
    const [modalOpen, setModalOpen] = useState(false);

    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => setModalOpen(false);

    const handleSaveContact = (contact: {
        firstName: string;
        lastName: string;
        email: string;
        favorite: boolean;
    }) => {
        // Implement save contact logic here
        setModalOpen(false);
    };

    return (
        <>
            <Navbar onNewContact={handleOpenModal} />
            <NewContact
                open={modalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveContact}
            />
            <main>
                {children}
            </main>
        </>
    );
}