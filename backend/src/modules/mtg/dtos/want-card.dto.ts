import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsInt, IsNumber, IsOptional, IsPositive, IsString, Min } from "class-validator";

export class WantCardDto {
    @ApiProperty({
        description: "Name of the card to be added to the image",
        example: "Colossal Dreadmaw",
    })
    @IsString({ message: "Card name must be a string." })
    name: string;

    @ApiProperty({
        description: "Indicates whether the card is foil",
    })
    @IsBoolean({ message: "Foil must be a boolean value." })
    foil: boolean;

    @ApiPropertyOptional({
        description: "Desired quantity of the card (may be null)",
        minimum: 1,
    })
    @IsInt({ message: "Quantity must be an integer." })
    @IsPositive({ message: "Quantity must be greater than zero." })
    @IsOptional()
    quantity?: number;

    @ApiPropertyOptional({
        description: "Price to be added to bottom of the card",
        minimum: 0.01,
    })
    @IsNumber()
    @Min(0.01, { message: "Price must be greater than zero" })
    @IsOptional()
    price?: number;
}
