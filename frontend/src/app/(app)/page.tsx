import List from "@/app/components/List";
import type { Metadata } from "next";


export const metadata: Metadata = {
    title: "My Contacts",
};

export default function Home() {
    return (
        <main>
            <List showFavorites={true} />
            <List showFavorites={false} />
        </main>
    )
}