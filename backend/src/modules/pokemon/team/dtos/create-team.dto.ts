import { Type } from "class-transformer";
import { ArrayMaxSize, IsBoolean, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { CreatePokemonDto } from "./create-pokemon.dto";

export class CreateTeamDto {
    @IsString()
    @IsNotEmpty()
    game: string;

    @IsString()
    @IsNotEmpty()
    color: string;

    @IsBoolean()
    @IsOptional()
    rainbowBorder?: boolean = false;

    @IsString()
    @IsNotEmpty()
    trainerImage: string;

    @IsString()
    @IsOptional()
    trainerName?: string = "Giojoe";

    @IsString()
    @IsOptional()
    trainerTown?: string;

    @IsBoolean()
    @IsOptional()
    extra?: boolean = false;

    @ValidateNested({ each: true })
    @Type(() => CreatePokemonDto)
    @ArrayMaxSize(6, { message: "O time pode ter no máximo 6 pokémons." })
    @IsOptional()
    pokemonTeam?: CreatePokemonDto[];
}
