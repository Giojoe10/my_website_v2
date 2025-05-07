import { ApiProperty } from "@nestjs/swagger";

export class StoreCardDto {
    @ApiProperty({
        description: "Card listed price in BRL",
    })
    price: number;

    @ApiProperty({
        description: "Card's discount in percentage",
    })
    discount: number;

    @ApiProperty({
        description: "How many cards are in stock",
    })
    quantity: number;

    @ApiProperty({
        description: "Card price with discount applied",
    })
    finalPrice: number;
}
