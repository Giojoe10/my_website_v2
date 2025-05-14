"use client";

import { deleteDeck } from "@/actions/deck";
import { ChevronDown, ChevronUp, PencilLine, Trash } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ExpandableDiv({ id }: { id: number }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div>
            <div
                className="flex justify-center"
                onMouseUp={() => {
                    setExpanded(!expanded);
                }}>
                {expanded ? (
                    <ChevronUp color="white" className="mt-2 cursor-pointer" />
                ) : (
                    <ChevronDown color="white" className="mt-2 cursor-pointer" />
                )}
            </div>

            {expanded && (
                <div className="mt-2 space-x-2 transition-all flex flex-row">
                    <button
                        type="button"
                        onMouseUp={() => deleteDeck(id)}
                        className="cursor-pointer bg-[#151921] hover:bg-secondary-900 w-full py-1 px-2 text-gray-200 rounded-md border-[#252931] border-2 text-sm flex justify-center items-center gap-1">
                        <Trash width={16} height={16} />
                        Excluir
                    </button>
                    <Link href={`/mtg/decks/?addDeck=true&editing=${id}`}>
                        <button
                            type="button"
                            className="cursor-pointer bg-[#151921] hover:bg-secondary-900 w-full py-1 px-2 text-gray-200 rounded-md border-[#252931] border-2 text-sm flex justify-center items-center gap-1">
                            <PencilLine width={16} height={16} />
                            Editar
                        </button>
                    </Link>
                </div>
            )}
        </div>
    );
}
