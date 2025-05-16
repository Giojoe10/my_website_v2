import Image from "next/image";
import Link from "next/link";
import { JSX } from "react";
import DeckCardCollapsible from "./DeckCardCollapsible";

interface DeckCardProps {
    id: number;
    cardImage: string;
    deckName: string;
    archidektPage: string;
    ligamagicPage: string;
    deckPrice: number;
}

export default async function DeckCard({
    id,
    cardImage,
    deckName,
    archidektPage,
    ligamagicPage,
    deckPrice,
}: DeckCardProps): Promise<JSX.Element> {
    return (
        <div className="inline-flex justify-center relative h-fit">
            <div className="absolute w-full h-full inline-flex justify-center">
                <div
                    className="relative inline-flex h-[316px] w-[223px] justify-center z-10"
                    style={{ perspective: "1000px" }}>
                    <div className="w-[112px] h-[312px] z-10 peer/left" />
                    <div className="w-[112px] h-[312px] z-10 right-0 peer/right" />
                    <Image
                        src={`http://localhost:5000${cardImage}`}
                        alt=""
                        height="316"
                        width="223"
                        className="object-fill absolute border-1 border-[#252931] rounded-xl shadow-md shadow-black 
                                    transition-transform duration-300 transform
                                    peer-hover/left:rotate-y-6
                                    peer-hover/right:-rotate-y-6"
                    />
                </div>
            </div>

            <div className="bg-[#0c1019] border-2 border-[#252931] relative isolate flex flex-col items-center rounded-md p-4 pb-2 w-64 mt-18">
                <div className="h-56" />
                <p className="text-gray-400 text-xs cursor-default">{deckName}</p>
                <p className="text-primary-300 text-xs mb-2 cursor-default">
                    R$ {deckPrice?.toString().replace(".", ",") || "???"}
                </p>
                <div className="w-full h-fit flex flex-col justify-center gap-1">
                    <Link href={archidektPage || "/"} className="w-full" target="_blank" rel="noopener noreferrer">
                        <button
                            type="button"
                            className="cursor-pointer bg-[#151921] hover:bg-[#101416] w-full py-1 text-gray-200 rounded-md border-[#252931] border-2 text-sm flex justify-center items-center gap-1">
                            <Image src="/images/icons/archidekt.svg" alt="archidekt" height={16} width={16} />
                            Archidekt
                        </button>
                    </Link>
                    <Link href={ligamagicPage || "/"} className="w-full" target="_blank" rel="noopener noreferrer">
                        <button
                            type="button"
                            className="cursor-pointer bg-[#151921] hover:bg-[#101416] w-full py-1 text-gray-200 rounded-md border-[#252931] border-2 text-sm flex justify-center items-center gap-1">
                            <Image src="/images/icons/ligamagic.svg" alt="ligamagic" height={16} width={16} />
                            LigaMagic
                        </button>
                    </Link>
                </div>
                <DeckCardCollapsible id={id} />
            </div>
        </div>
    );
}
