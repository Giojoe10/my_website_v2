"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Card } from "./want";

export interface ArchidektData {
    have: Card[];
    haveQuantity: number;
    getting: Card[];
    gettingQuantity: number;
    dontHave: Card[];
    dontHaveQuantity: number;
}

export interface Deck {
    id: number;
    name: string;
    archidektUrl: string;
    ligamagicUrl: string;
    coverCard: string;
    order: number;
    price?: number;
    completed: boolean;
    archidekt?: ArchidektData;
}

export async function getAllDecks(): Promise<Deck[]> {
    const response = await fetch("http://localhost:5000/mtg/deck");
    const decks: Deck[] = await response.json();
    for (const deck of decks) {
        if (deck.completed) {
            console.log("fetching price for deck ", deck.name);
            const deckPriceResponse = await fetch(`http://localhost:5000/mtg/deck/price/${deck.id}`);
            const deckPrice = await deckPriceResponse.json();
            deck.price = deckPrice.price;
        } else {
            console.log("fetching archidekt data for deck ", deck.name);
            const deckArchidektResponse = await fetch(`http://localhost:5000/mtg/deck/archidekt/${deck.id}`);
            const deckArchidektData = await deckArchidektResponse.json();
            console.log(deckArchidektData);
            deck.archidekt = deckArchidektData;
        }
    }
    return decks;
}

export async function getDeckById(idDeck: number): Promise<Deck> {
    const response = await fetch(`http://localhost:5000/mtg/deck/${idDeck}`);
    return await response.json();
}

export async function createDeck(data: FormData): Promise<void> {
    const response = await fetch("http://localhost:5000/mtg/deck", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: data.get("name"),
            archidektUrl: data.get("archidektUrl") || null,
            ligamagicUrl: data.get("ligamagicUrl") || null,
            coverImageUrl: data.get("coverImageUrl") || null,
            completed: data.get("completed") === "on",
        }),
    });

    const responseData = await response.json();
    console.log("Deck criado: ", responseData);
    revalidatePath("/mtg/decks");
}

export async function updateDeck(data: FormData): Promise<void> {
    const response = await fetch(`http://localhost:5000/mtg/deck/${data.get("id")}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: data.get("name") || undefined,
            archidektUrl: data.get("archidektUrl") || undefined,
            ligamagicUrl: data.get("ligamagicUrl") || undefined,
            coverImageUrl: data.get("coverImageUrl") || undefined,
        }),
    });
    console.log(await response.json());
    redirect("/mtg/decks");
}

export async function deleteDeck(idDeck: number): Promise<void> {
    await fetch(`http://localhost:5000/mtg/deck/${idDeck}`, {
        method: "DELETE",
    });
    revalidatePath("/mtg/decks");

    console.log("Deck excluído");
}

export async function saveDecksOrder(decks: Deck[]): Promise<void> {
    let i = 1;
    for (const deck of decks) {
        const response = await fetch(`http://localhost:5000/mtg/deck/${deck.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...deck, order: i }),
        });
        console.log(await response.json());
        console.log(JSON.stringify({ ...deck, order: i }));
        i++;
    }
    redirect("/mtg/decks");
}
