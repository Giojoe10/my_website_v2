import { useFormStatus } from "react-dom";
import ResetButton from "./ResetButton";
import SaveButton from "./SaveButton";

export default function GenerateWantForm() {
    const { pending } = useFormStatus();
    return (
        <>
            <div className="flex flex-row justify-center gap-8">
                <div className="flex flex-col gap-0.5">
                    <label htmlFor="cols">Número de Colunas</label>
                    <input
                        type="number"
                        name="cols"
                        id="cols"
                        disabled={pending}
                        className="bg-gray-800 rounded-sm focus:outline-accent focus:outline-2 px-4 py-2 disabled:cursor-not-allowed disabled:bg-gray-900 disabled:text-gray-600 disabled:animate-pulse
                        disabled:text-center disabled:[appearance:textfield] disabled:[&::-webkit-outer-spin-button]:appearance-none disabled:[&::-webkit-inner-spin-button]:appearance-none"
                        defaultValue={5}
                        max={6}
                        min={1}
                    />
                </div>
                <div className="flex flex-col gap-0.5 items-center justify-center ">
                    <label htmlFor="showQuantity">Mostrar quantidade?</label>
                    <input
                        type="checkbox"
                        name="showQuantity"
                        id="showQuantity"
                        disabled={pending}
                        defaultChecked
                        className="accent-primary disabled:cursor-not-allowed disabled:text-gray-600 disabled:animate-pulse"
                    />
                </div>
            </div>

            <textarea
                name="cardList"
                id="cardList"
                disabled={pending}
                className="bg-gray-800 p-2 rounded-sm focus:outline-accent focus:outline-2 disabled:cursor-not-allowed disabled:bg-gray-900 disabled:text-gray-600 disabled:animate-pulse"
                cols={45}
                rows={20}
                placeholder="ex. 1 Naturalizar || Optar || 3x Bocarra Sinistra Colossal+"
            />

            <div className="flex flex-row justify-center gap-4">
                <SaveButton text="Gerar" pendingText="Gerando..." />
                <ResetButton />
            </div>
        </>
    );
}
