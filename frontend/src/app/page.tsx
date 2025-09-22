import List from "@/app/components/List";

export default function Home() {
    return (
        <main>
            <List showFavorites={true} />
            <List showFavorites={false} />
        </main>
    )
}