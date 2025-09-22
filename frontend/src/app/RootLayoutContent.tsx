"use client";

import React, { ReactNode, useState } from "react";
import Navbar from "@/app/components/NavBar";
import NewContact from "@/app/components/NewContact";
import "@/app/globals.css";

type RootLayoutContentProps = {
    children: ReactNode;
};

export default function RootLayoutContent({ children }: RootLayoutContentProps) {
    const [modalOpen, setModalOpen] = useState(false);

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

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
                onSave={handleSaveContact}
            />
            <main>{children}</main>
        </>
    );
}