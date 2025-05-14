import { createDeck, updateDeck } from "@/actions/deck";
import { X } from "lucide-react";
import Link from "next/link";
import SaveButton from "./SaveButton";

export default async function DeckForm({ editing }: { editing?: number }) {
    return (
        <div className="fixed inset-0 bg-background/60 overflow-y-auto h-full w-full items-center justify-center z-20 flex flex-col">
            <div className="w-1/4 px-4 py-3 bg-gray-900 rounded-t-md border-b-2 border-gray-700 flex items-center justify-between">
                <p className="font-bold text-lg text-gray-100">{editing ? "Editar" : "Criar novo"} deck</p>
                <Link href={"/mtg/decks"}>
                    <X className="text-gray-600" />
                </Link>
            </div>
            <div className="px-8 py-4 w-1/4 shadow-lg rounded-b-md bg-gray-900 text-gray-100">
                <form action={editing ? updateDeck : createDeck} className="flex flex-col gap-2">
                    {editing && <input type="hidden" name="id" value={editing} />}
                    <div className="flex flex-col">
                        <div className="flex gap-1 items-center">
                            <label htmlFor="name">
                                Nome <span className="text-secondary-400">*</span>
                            </label>
                        </div>
                        <input
                            name="name"
                            id="name"
                            type="text"
                            required={!editing}
                            className="bg-gray-800 rounded-md px-2 h-10 focus:outline-2 focus:outline-accent  placeholder:italic placeholder:font-light"
                            placeholder="ex. Breya, Etherium Shaper"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="archidektUrl">Link do Archidekt</label>
                        <input
                            name="archidektUrl"
                            id="archidektUrl"
                            type="text"
                            className="bg-gray-800 rounded-md px-2 h-10 focus:outline-2 focus:outline-accent  placeholder:italic placeholder:font-light"
                            placeholder="Link para o deck no Archidekt"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="ligamagicUrl">Link da Liga</label>
                        <input
                            name="ligamagicUrl"
                            id="ligamagicUrl"
                            type="text"
                            className="bg-gray-800 rounded-md px-2 h-10 focus:outline-2 focus:outline-accent  placeholder:italic placeholder:font-light"
                            placeholder="Link para o deck na LigaMagic"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="coverImageUrl">Imagem de capa</label>
                        <input
                            name="coverImageUrl"
                            id="coverImageUrl"
                            type="text"
                            className="bg-gray-800 rounded-md px-2 h-10 focus:outline-2 focus:outline-accent  placeholder:italic placeholder:font-light"
                            placeholder="Link para a imagem de capa do deck"
                        />
                    </div>
                    <div className="justify-center gap-4 flex mt-3">
                        <SaveButton />
                        <Link
                            href={"/mtg/decks"}
                            className="bg-secondary-500 w-28 px-6 py-1.5 text-white text-base font-medium shadow-md rounded-md hover:bg-secondary-600 cursor-pointer">
                            Cancelar
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
