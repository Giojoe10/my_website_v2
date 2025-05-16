import { WantCardDto } from "./want-card.dto";

export class ArchidektDataDto {
    have: WantCardDto[];
    haveQuantity: number;
    getting: WantCardDto[];
    gettingQuantity: number;
    dontHave: WantCardDto[];
    dontHaveQuantity: number;
}
