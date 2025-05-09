import { PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, ValidateNested } from "class-validator";
import { CreatePokemonDto } from "./create-pokemon.dto";
import { UpdateMoveSetDto } from "./update-moveset.dto";

export class UpdatePokemonDto extends PartialType(CreatePokemonDto) {
    @IsOptional()
    @ValidateNested()
    @Type(() => UpdateMoveSetDto)
    pokemonTeam?: UpdateMoveSetDto;
}
