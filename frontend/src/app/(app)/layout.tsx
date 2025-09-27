"use client";

import "@/app/globals.css";
import Navbar from "@/app/components/NavBar";
import NewContact from "@/app/components/NewContact";
import React, { useState } from "react";
import { useContactContext} from "@/app/context/ContactContext";

export default function OverviewPage({ children }: { children: React.ReactNode }) {
    const [modalOpen, setModalOpen] = useState(false);
    const { handleAddContact } = useContactContext();
    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => setModalOpen(false);

    const handleSaveContact = (contact: {
        firstName: string;
        lastName: string;
        email: string;
        favorite: boolean;
    }) => {
        setModalOpen(false);
    };

    return (
        <>
        <Navbar onNewContact={handleOpenModal} />
        <NewContact
            open={modalOpen}
            onClose={handleCloseModal}
            onSave={handleAddContact}
        />
        <main>{children}</main>
        </>
    );
}
