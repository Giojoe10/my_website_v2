import { ApiProperty } from "@nestjs/swagger";

export class DeckPriceResponse {
    @ApiProperty({ description: "Deck ID from LigaMagic" })
    ligamagicId: string;

    @ApiProperty({ description: "Deck price in BRL" })
    price: number;
}
