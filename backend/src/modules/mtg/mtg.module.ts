import { Module } from "@nestjs/common";
import { MtgController } from "./mtg.controller";
import { MtgService } from "./mtg.service";

@Module({
    imports: [],
    controllers: [MtgController],
    providers: [MtgService],
})
export class MtgModule {}
