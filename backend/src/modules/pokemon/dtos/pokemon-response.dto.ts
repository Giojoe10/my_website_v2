import { ApiProperty } from "@nestjs/swagger";

export class PokemonResponseDto {
    @ApiProperty({ description: "Official Pokémon name" })
    name: string;

    @ApiProperty({
        description: "Pokémon Types",
        type: "object",
        properties: {
            type1: {
                type: "string",
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
            },
            type2: {
                type: "string",
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
                nullable: true,
            },
        },
    })
    types: {
        type1: string;
        type2: string;
    };
}
