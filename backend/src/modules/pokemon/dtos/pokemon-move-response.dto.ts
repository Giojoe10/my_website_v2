import { ApiProperty } from "@nestjs/swagger";

export class PokemonMoveResponseDto {
    @ApiProperty({ description: "Move name parsed with '-' instead of spaces" })
    name: string;
    @ApiProperty({
        description: "Move type",
        enum: [
            "normal",
            "fire",
            "water",
            "electric",
            "grass",
            "ice",
            "fighting",
            "poison",
            "ground",
            "flying",
            "psychic",
            "bug",
            "rock",
            "ghost",
            "dragon",
            "dark",
            "steel",
            "fairy",
        ],
    })
    type: string;
    @ApiProperty({
        description: "Move damage category for the current generation",
        enum: ["physical", "special", "status"],
    })
    category: string;

    @ApiProperty({
        description: "Move damage category for generations 1, 2 and 3",
        enum: ["physical", "special", "status"],
    })
    oldSplitCategory: string;
}
