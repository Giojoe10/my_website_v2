import { PartialType } from "@nestjs/swagger";
import { CreateMoveSetDto } from "./create-moveset.dto";

export class UpdateMoveSetDto extends PartialType(CreateMoveSetDto) {}
