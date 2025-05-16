import { Deck } from "@/actions/deck";
import DeckCard from "@/app/components/DeckCard";

export default async function DecksGrid({ decks }: { decks: Deck[] }) {
    return (
        <div className="flex justify-center gap-4 py-4 px-16 flex-row flex-wrap overflow-visible">
            {decks
                .sort((a, b) => a.order - b.order)
                .map((deck: Deck) => (
                    <DeckCard
                        key={deck.id}
                        id={deck.id}
                        deckName={deck.name}
                        archidektPage={deck.archidektUrl}
                        ligamagicPage={deck.ligamagicUrl}
                        cardImage={deck.coverCard}
                        deckPrice={deck.price}
                        completed={deck.completed}
                        archidekt={deck.archidekt}
                    />
                ))}
        </div>
    );
}
