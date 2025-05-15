"use client";
import { generateWant } from "@/actions/want";
import PageTitle from "@/app/components/PageTitle";
import GenerateWantForm from "@/app/components/forms/GenerateWantFrom";
import Image from "next/image";
import { useState } from "react";

export default function Want() {
    const [wantImage, setWantImage] = useState("");
    const [generating, setGenerating] = useState(false);
    const [cols, setCols] = useState(5);
    const [rows, setRows] = useState(1);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setGenerating(true);

        const formData = new FormData(e.currentTarget);

        const cols = +(formData.get("cols") as string);
        const lines = (formData.get("cardList") as string).split("\n").length;
        const rows = Math.ceil(lines / cols);

        setCols(Math.min(lines, cols));
        setRows(rows);

        const image = await generateWant(formData);
        setWantImage(image);

        setGenerating(false);
    }

    return (
        <div>
            <PageTitle image="/images/banners/ashling-wide.png" title="Gerador de Want" />
            <div className="flex flex-row text-gray-100">
                <div className="flex justify-center items-start w-2/6 p-4">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                        <GenerateWantForm />
                    </form>
                </div>
                <div className="flex justify-center items-center w-4/6 text-gray-100">
                    {wantImage && !generating && (
                        <Image
                            src={wantImage}
                            alt="Want"
                            width={cols * 745 * 0.25}
                            height={1000}
                            className="rounded-lg"
                        />
                    )}
                    {generating && (
                        <div
                            className="bg-gray-600 animate-pulse m-8 rounded-lg cursor-progress"
                            style={{ width: `${cols * 745 * 0.25}px`, height: `${rows * 1040 * 0.25}px` }}
                        />
                    )}
                    {!wantImage && !generating && <p>Insira a lista e clique em gerar!</p>}
                </div>
            </div>
        </div>
    );
}
