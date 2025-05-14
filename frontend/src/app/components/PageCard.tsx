import Image from "next/image";
import Link from "next/link";
import { JSX } from "react";

interface PageCardProps {
    name: string;
    description: string;
    image: string;
    page: string;
}

export default function PageCard({ name, description, image, page }: PageCardProps): JSX.Element {
    return (
        <div className="transition-all duration-300 hover:scale-105 hover:z-10 inline-flex h-fit w-fit group">
            <Link href={page}>
                <div className="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl px-8 pb-8 pt-40 max-w-sm min-w-96 mx-auto">
                    <Image
                        fill
                        src={image}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover object-center group-hover:scale-110 transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-gray-900/40" />
                    <h3 className="z-10 mt-3 text-3xl font-bold text-white">{name}</h3>
                    <div className="z-10 gap-y-1 overflow-hidden text-sm leading-6 min-h-12 text-gray-300">
                        {description}
                    </div>
                </div>
            </Link>
        </div>
    );
}
