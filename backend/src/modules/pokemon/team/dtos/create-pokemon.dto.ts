import { Type } from "class-transformer";
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { CreateMoveSetDto } from "./create-moveset.dto";

class EffortLevelsDto {
    @IsInt()
    hp: number;

    @IsInt()
    attack: number;

    @IsInt()
    defense: number;

    @IsInt()
    specialAttack: number;

    @IsInt()
    specialDefense: number;

    @IsInt()
    speed: number;
}

export class CreatePokemonDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsBoolean()
    @IsOptional()
    isCustom?: boolean = false;

    @IsString()
    @IsOptional()
    gender?: string;

    @IsBoolean()
    @IsOptional()
    shiny?: boolean = false;

    @IsString()
    @IsNotEmpty()
    type1: string;

    @IsString()
    @IsOptional()
    type2?: string;

    @IsString()
    @IsOptional()
    ability?: string;

    @IsInt()
    level: number;

    @IsString()
    @IsNotEmpty()
    image: string;

    @IsString()
    @IsOptional()
    heldItem?: string;

    @IsString()
    @IsOptional()
    heldItemReplacementImage?: string;

    @IsOptional()
    @Type(() => EffortLevelsDto)
    effortLevels?: EffortLevelsDto;

    @ValidateNested()
    @Type(() => CreateMoveSetDto)
    moveSet: CreateMoveSetDto;
}
