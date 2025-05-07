import { Controller, Get, Param } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { PokemonMoveResponseDto } from "./dtos/pokemon-move-response.dto";
import { PokemonResponseDto } from "./dtos/pokemon-response.dto";
import { PokemonService } from "./pokemon.service";

@ApiTags("Pokémon")
@Controller("pokemon")
export class PokemonController {
    constructor(private readonly pokemonService: PokemonService) {}

    @ApiOperation({
        summary: "Retrieve pokémon data",
        description:
            "This endpoint fetches data about a specific Pokémon from the PokéAPI, returning its name and primary/secondary types. It uses a caching mechanism to reduce external requests and improve performance on repeated queries.",
    })
    @ApiParam({
        name: "pokemonName",
        required: true,
        description: "Name of the Pokémon to retrieve",
    })
    @ApiResponse({
        status: 200,
        description: "Pokémon data successfully retrieved",
        type: PokemonResponseDto,
        example: {
            name: "dialga",
            types: { type1: "steel", type2: "dragon" },
        },
    })
    @ApiResponse({
        status: 404,
        description: "Pokémon not found",
    })
    @ApiResponse({
        status: 500,
        description: "Error retrieving or processing Pokémon data",
    })
    @Get(":pokemonName")
    getPokemonData(@Param("pokemonName") pokemonName: string) {
        return this.pokemonService.getPokemonData(pokemonName);
    }

    @ApiOperation({
        summary: "Retrieve move data",
        description:
            'This endpoint fetches detailed information about a Pokémon move from the PokéAPI, including its type, damage category, and its "old split" category used in early game generations. Results are cached to optimize performance for repeated requests.',
    })
    @ApiParam({
        name: "moveName",
        required: true,
        description: "Name of the Pokémon move to retrieve",
    })
    @ApiResponse({
        status: 200,
        description: "Move data successfully retrieved",
        type: PokemonMoveResponseDto,
        example: {
            name: "fire-punch",
            type: "fire",
            category: "physical",
            oldSplitCategory: "special",
        },
    })
    @ApiResponse({
        status: 404,
        description: "Move not found",
    })
    @ApiResponse({
        status: 500,
        description: "Error retrieving or processing move data",
    })
    @Get("move/:moveName")
    getMoveData(@Param("moveName") moveName: string) {
        return this.pokemonService.getMoveData(moveName);
    }
}
