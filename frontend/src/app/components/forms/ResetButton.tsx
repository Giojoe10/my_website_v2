"use client";
import { useFormStatus } from "react-dom";

export default function ResetButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="reset"
            disabled={pending}
            className="bg-secondary-400 w-28 px-6 py-1.5 text-white text-base font-medium shadow-md rounded-md not-disabled:hover:bg-secondary-500 cursor-pointer disabled:cursor-not-allowed disabled:bg-secondary-800 disabled:animate-pulse">
            {pending ? "..." : "Limpar"}
        </button>
    );
}
