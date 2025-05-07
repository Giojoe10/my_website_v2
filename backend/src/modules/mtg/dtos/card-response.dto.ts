import { ApiProperty } from "@nestjs/swagger";

export class CardResponseDto {
    @ApiProperty({ description: "Card name from Scryfall", example: "Colossal Dreadmaw" })
    name: string;

    @ApiProperty({ description: "Card ID from LigaMagic", example: 44064 })
    cardId: number;

    @ApiProperty({
        description: "Prices from Ligamagic for each edition",
        type: "array",
        items: {
            type: "object",
            properties: {
                ligaId: { type: "string", example: "176" },
                minPrice: { type: "number", example: 0.04 },
                maxPrice: { type: "number", example: 1.93 },
            },
        },
    })
    prices: {
        ligaId: string; // ID da edição
        minPrice: number;
        maxPrice: number;
    }[];

    @ApiProperty({ description: "Cheapest price from Ligamagic", example: 0.04 })
    cheapestPrice: number;
}
