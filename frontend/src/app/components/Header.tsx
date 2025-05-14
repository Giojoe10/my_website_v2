import Link from "next/link";
import { JSX } from "react";

export default function Header(): JSX.Element {
    return (
        <nav className="px-14 bg-background h-12 flex items-center">
            <Link href="/">
                <h1
                    className="text-4xl font-semibold bg-gradient-to-r from-primary via-secondary to-accent text-transparent bg-clip-text
                hover:from-accent hover:via-secondary hover:to-primary transition-colors duration-300
                ">
                    GMB
                </h1>
            </Link>
        </nav>
    );
}
