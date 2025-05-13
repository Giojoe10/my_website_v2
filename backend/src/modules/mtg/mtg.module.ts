import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ImageService } from "../image/image.service";
import { MtgDeck } from "./entities/mtg-deck.entity";
import { MtgController } from "./mtg.controller";
import { MtgService } from "./mtg.service";

@Module({
    imports: [TypeOrmModule.forFeature([MtgDeck])],
    controllers: [MtgController],
    providers: [MtgService, ImageService],
})
export class MtgModule {}
