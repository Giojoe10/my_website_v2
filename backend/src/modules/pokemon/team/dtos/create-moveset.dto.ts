import { Type } from "class-transformer";
import { IsOptional, IsString, ValidateNested } from "class-validator";

class MoveDto {
    @IsString()
    name: string;

    @IsString()
    type: string;

    @IsString()
    category: string;

    @IsOptional()
    @IsString()
    oldSplitCategory?: string;
}

export class CreateMoveSetDto {
    @IsOptional()
    @ValidateNested()
    @Type(() => MoveDto)
    move1?: MoveDto;

    @IsOptional()
    @ValidateNested()
    @Type(() => MoveDto)
    move2?: MoveDto;

    @IsOptional()
    @ValidateNested()
    @Type(() => MoveDto)
    move3?: MoveDto;

    @IsOptional()
    @ValidateNested()
    @Type(() => MoveDto)
    move4?: MoveDto;
}
