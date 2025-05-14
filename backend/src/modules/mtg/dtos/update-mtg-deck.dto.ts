import { PartialType } from "@nestjs/swagger";
import { IsInt, IsNumber, IsOptional, Min } from "class-validator";
import { CreateMtgDeckDto } from "./create-mtg-deck.dto";

export class UpdateMtgDeckDto extends PartialType(CreateMtgDeckDto) {
    @IsNumber()
    @IsInt()
    @Min(0)
    @IsOptional()
    order?: number;
}
