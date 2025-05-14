"use client";
import { useFormStatus } from "react-dom";

export default function SaveButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="bg-primary-400 w-28 px-6 py-1.5 text-white text-base font-medium shadow-md rounded-md not-disabled:hover:bg-primary-500 cursor-pointer disabled:cursor-not-allowed disabled:bg-primary-800 disabled:animate-pulse">
            {pending ? "Salvando..." : "Salvar"}
        </button>
    );
}
