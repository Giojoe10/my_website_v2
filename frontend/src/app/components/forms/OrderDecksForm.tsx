"use client";

import { Deck, saveDecksOrder } from "@/actions/deck";
import { GripVertical, X } from "lucide-react";
import { Reorder } from "motion/react";
import Link from "next/link";
import { useState } from "react";

export default function OrderDecksForm({ decks }: { decks: Deck[] }) {
    const [decksList, setDecksList] = useState(decks);

    return (
        <div className="fixed inset-0 bg-background/60 overflow-y-auto h-full w-full items-center justify-center z-20 flex flex-col">
            <div className="w-1/4 px-4 py-3 bg-gray-900 rounded-t-md border-b-2 border-gray-700 flex items-center justify-between">
                <p className="font-bold text-lg text-gray-100">Ordenar decks</p>
                <Link href={"/mtg/decks"}>
                    <X className="text-gray-600" />
                </Link>
            </div>
            <div className="px-8 py-4 w-1/4 shadow-lg rounded-b-md bg-gray-900 text-gray-100 flex flex-col ">
                <Reorder.Group axis="y" values={decksList} onReorder={setDecksList}>
                    <div className="flex flex-col gap-2">
                        {decksList.map((deck: Deck) => {
                            return (
                                <Reorder.Item key={deck.id} value={deck}>
                                    <div className="bg-gray-800 p-4 rounded-md flex justify-between items-center cursor-grab active:cursor-grabbing active:bg-gray-700">
                                        <p>{deck.name}</p>
                                        <GripVertical height={24} width={24} className="text-gray-300" />
                                    </div>
                                </Reorder.Item>
                            );
                        })}
                    </div>
                </Reorder.Group>
                <div className="justify-center gap-4 flex mt-3">
                    <button
                        type="button"
                        onClick={() => {
                            saveDecksOrder(decksList);
                        }}
                        className="bg-primary-400 w-28 px-6 py-1.5 text-white text-base font-medium shadow-md rounded-md not-disabled:hover:bg-primary-500 cursor-pointer disabled:cursor-not-allowed disabled:bg-primary-800 disabled:animate-pulse">
                        Salvar
                    </button>
                    <Link
                        href={"/mtg/decks"}
                        className="bg-secondary-500 w-28 px-6 py-1.5 text-white text-base font-medium shadow-md rounded-md hover:bg-secondary-600 cursor-pointer">
                        Cancelar
                    </Link>
                </div>
            </div>
        </div>
    );
}
