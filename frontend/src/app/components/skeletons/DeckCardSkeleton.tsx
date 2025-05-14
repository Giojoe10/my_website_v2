import { JSX } from "react";

export default function DeckCardSkeleton(): JSX.Element {
    return (
        <div className="flex justify-center gap-4 p-4">
            <div className="inline-flex justify-center relative ">
                <div className="absolute overflow-hidden w-full h-full inline-flex justify-center ">
                    <div
                        className="relative inline-flex h-[316px] w-[223px] justify-center z-10"
                        style={{ perspective: "1000px" }}>
                        <div className="w-[112px] h-[312px] z-10 peer/left" />
                        <div className="w-[112px] h-[312px] z-10 right-0 peer/right" />
                        <div
                            className="absolute border-1 border-[#252931] rounded-xl shadow-md shadow-black 
                                    transition-transform duration-300 transform
                                    peer-hover/left:rotate-y-6
                                    peer-hover/right:-rotate-y-6
                                    h-[312px] w-[223px]
                                    bg-gray-700 animate-pulse
                                    "
                        />
                    </div>
                </div>

                <div className="bg-[#0c1019] border-2 border-[#252931] relative isolate flex flex-col items-center rounded-md p-4 w-64 mt-18">
                    <div className="h-56" />
                    <p />
                    <p className="text-gray-400 text-xs mb-2 cursor-default">...</p>
                    <div className="w-full h-fit flex flex-col justify-center gap-1">
                        <button
                            type="button"
                            className="animate-pulse bg-[#151921] hover:bg-[#101416] w-full py-1 text-gray-200 rounded-md border-[#252931] border-2 text-sm flex justify-center items-center gap-1">
                            Loading...
                        </button>
                        <button
                            type="button"
                            className="animate-pulse bg-[#151921] hover:bg-[#101416] w-full py-1 text-gray-200 rounded-md border-[#252931] border-2 text-sm flex justify-center items-center gap-1">
                            Loading...
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
