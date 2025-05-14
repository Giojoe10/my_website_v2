import type { Metadata } from "next";
import { Fira_Sans } from "next/font/google";
import Header from "./components/Header";
import "./globals.css";

const firaSans = Fira_Sans({
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Giojoe.local",
    description: "My local tools!",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${firaSans.className} antialiased bg-background`}>
                <Header />
                {children}
            </body>
        </html>
    );
}
