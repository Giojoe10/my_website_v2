"use server";

export interface Card {
    name: string;
    quantity: number;
    foil: boolean;
}

async function parseList(cardList: string): Promise<Card[]> {
    const lines = cardList.split("\n").filter((line) => line.trim() !== "");

    const cards: Card[] = [];

    // Processar cada linha
    for (const line of lines) {
        // Usar expressão regular para extrair a quantidade e o nome da carta
        const match = line.match(/(?:([0-9]{1,2})x? )?(\=?[A-Za-z0-9\'\"\- ,\:]+)(\+?)/);

        if (match) {
            const quantity = Number.parseInt(match[1], 10);
            const cardName = match[2].trim();
            const isFoil = match[3] === "+";

            cards.push({
                name: cardName,
                quantity,
                foil: isFoil,
            });
        }
    }

    console.log(cards);
    return cards;
}

export async function generateWant(data: FormData): Promise<string> {
    const cardList = data.get("cardList") as string;
    const columns = +(data.get("cols") as string);
    const showQuantity = (data.get("showQuantity") as string) === "on";

    const cards = await parseList(cardList);

    const response = await fetch("http://localhost:5000/mtg/want", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cards, columns, showQuantity }),
    });
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    return `data:image/png;base64,${base64}`;
}
