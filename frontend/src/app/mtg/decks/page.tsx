import DeckForm from "@/app/components/forms/DeckForm";
import OrderDecksForm from "@/app/components/forms/OrderDecksForm";
import DeckCardSkeleton from "@/app/components/skeletons/DeckCardSkeleton";
import { ListOrdered, Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import PageTitle from "../../components/PageTitle";
import DecksGrid from "./DecksGrid";

type SearchParamProps = {
    searchParams: Promise<Record<string, string>> | null | undefined;
};

export default async function Mtg({ searchParams }: SearchParamProps) {
    const awaitedSearchParams = await searchParams;
    const addDeck = awaitedSearchParams?.addDeck;
    const editing = awaitedSearchParams?.editing;
    const orderDecks = awaitedSearchParams?.orderDecks;

    const data = await fetch("http://localhost:5000/mtg/deck", { cache: "no-store" });
    const decks = await data.json();

    return (
        <div>
            <PageTitle image="/images/banners/ashling-wide.png" title="Meus Decks" />
            <div className="flex justify-center p-2 gap-4">
                <Link href="/mtg/decks/?addDeck=true">
                    <button
                        type="button"
                        className="bg-primary-400 w-28 rounded-md justify-center gap-0.5 py-1.5 cursor-pointer hover:bg-primary-500 flex items-center font-medium">
                        <Plus height={16} width={16} />
                        Novo Deck
                    </button>
                </Link>
                <Link href="/mtg/decks/?orderDecks=true">
                    <button
                        type="button"
                        className="bg-secondary-400 min-w-28 px-2 rounded-md justify-center gap-0.5 py-1.5 cursor-pointer hover:bg-secondary-500 flex items-center font-medium">
                        <ListOrdered height={16} width={16} />
                        Ordenar Decks
                    </button>
                </Link>
            </div>
            <Suspense fallback={<DeckCardSkeleton />}>
                <DecksGrid decks={decks} />
            </Suspense>
            {addDeck && <DeckForm editing={editing ? +editing : undefined} />}
            {orderDecks && <OrderDecksForm decks={decks} />}
        </div>
    );
}
