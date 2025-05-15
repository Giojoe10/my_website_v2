"use client";
import { useFormStatus } from "react-dom";

interface SaveButtonProps {
    text?: string;
    pendingText?: string;
}

export default function SaveButton({ text = "Salvar", pendingText = "Salvando..." }: SaveButtonProps) {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="bg-primary-400 w-28 px-6 py-1.5 text-white text-base text-center font-medium shadow-md rounded-md not-disabled:hover:bg-primary-500 cursor-pointer disabled:cursor-not-allowed disabled:bg-primary-800 disabled:animate-pulse">
            {pending ? pendingText : text}
        </button>
    );
}
