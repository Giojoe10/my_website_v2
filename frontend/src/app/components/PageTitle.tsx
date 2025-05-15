import Image from "next/image";
import { JSX } from "react";

interface PageTitleProps {
    image: string;
    title: string;
}

export default function PageTitle({ image, title }: PageTitleProps): JSX.Element {
    return (
        <div className="group shadow-[inset_0_0_10px_rgba(0,0,0,0.75)] bg-center bg-cover h-56 p-5 flex justify-center justify-items-center items-center relative overflow-hidden">
            <Image
                fill
                src={image}
                alt={title}
                priority
                className="absolute w-full -z-10 group-hover:scale-105 group-hover:blur-[1px] transition-all duration-1000"
            />
            <p className="absolute text-center tracking-wide text-6xl text-black font-semibold blur-lg">{title}</p>
            <p className="text-center tracking-wide text-6xl text-white font-semibold z-10">{title}</p>
        </div>
    );
}
