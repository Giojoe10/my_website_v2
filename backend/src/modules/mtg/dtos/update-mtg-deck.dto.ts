import { PartialType } from "@nestjs/swagger";
import { CreateMtgDeckDto } from "./create-mtg-deck.dto";

export class UpdateMtgDeckDto extends PartialType(CreateMtgDeckDto) {}
