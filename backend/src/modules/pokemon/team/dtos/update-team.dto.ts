import { OmitType, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMaxSize, IsOptional, ValidateNested } from "class-validator";
import { CreateTeamDto } from "./create-team.dto";
import { UpdatePokemonDto } from "./update-pokemon.dto";

export class UpdateTeamDto extends OmitType(PartialType(CreateTeamDto), ["pokemonTeam"]) {
    @IsOptional()
    @ValidateNested({ each: true })
    @ArrayMaxSize(6, { message: "O time pode ter no máximo 6 pokémons." })
    @Type(() => UpdatePokemonDto)
    pokemonTeam?: UpdatePokemonDto[];
}
