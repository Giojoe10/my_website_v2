import { CACHE_MANAGER, Cache } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { PokemonMoveResponseDto } from "./dtos/pokemon-move-response.dto";
import { PokemonResponseDto } from "./dtos/pokemon-response.dto";

class PokeapiPokemon {
    name: string;
    types: { type: { name: string } }[];
    varieties: {
        pokemon: {
            url: string;
        }[];
    };
}

class PokeapiMove {
    name: string;
    type: { name: string };
    // biome-ignore lint/style/useNamingConvention: <explanation>
    damage_class: { name: string };
    generation: { name: string };
}

@Injectable()
export class PokemonService {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

    async getPokemonData(pokemonName: string): Promise<PokemonResponseDto> {
        const cacheKey = `pokemon:${pokemonName.toLowerCase().trim().replace(/\s+/g, "_")}`;
        const cachedPokemon = await this.cacheManager.get<PokemonResponseDto>(cacheKey);
        if (cachedPokemon) {
            console.log("Grabing pokémon from cache...");
            return cachedPokemon;
        }
        const baseUrl = "https://pokeapi.co/api/v2/pokemon-species/";

        let response = await fetch(baseUrl + pokemonName);
        let pokemonData: PokeapiPokemon = await response.json();
        response = await fetch(pokemonData.varieties[0].pokemon.url);
        pokemonData = await response.json();

        const result: PokemonResponseDto = {
            name: pokemonData.name,
            types: { type1: pokemonData.types[0].type.name, type2: pokemonData.types[1]?.type.name },
        };

        await this.cacheManager.set(cacheKey, result);
        return result;
    }

    async getMoveData(moveName: string): Promise<PokemonMoveResponseDto> {
        const cacheKey = `pokemon:move:${moveName.toLowerCase().trim().replace(/\s+/g, "_")}`;
        const cachedMove = await this.cacheManager.get<PokemonMoveResponseDto>(cacheKey);
        if (cachedMove) {
            console.log("Grabing move from cache...");
            return cachedMove;
        }

        const baseUrl = "https://pokeapi.co/api/v2/move/";
        const response = await fetch(baseUrl + moveName.replace(/\s+/g, "-"));
        const moveData: PokeapiMove = await response.json();

        const oldGens = ["generation-i", "generation-ii", "generation-iii"];
        const oldSplitCategoryMap: Record<string, "physical" | "special"> = {
            normal: "physical",
            fighting: "physical",
            flying: "physical",
            ground: "physical",
            rock: "physical",
            bug: "physical",
            ghost: "physical",
            steel: "physical",
            fire: "special",
            water: "special",
            grass: "special",
            electric: "special",
            psychic: "special",
            ice: "special",
            dragon: "special",
            dark: "special",
        };

        const oldSplitCategory =
            moveData.damage_class.name === "status"
                ? "status"
                : oldGens.includes(moveData.generation.name)
                  ? oldSplitCategoryMap[moveData.type.name] || ""
                  : "";

        const result: PokemonMoveResponseDto = {
            name: moveData.name,
            type: moveData.type.name,
            category: moveData.damage_class.name,
            oldSplitCategory,
        };

        await this.cacheManager.set(cacheKey, result);
        return result;
    }
}
