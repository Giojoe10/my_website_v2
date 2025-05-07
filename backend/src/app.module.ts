import { Keyv, createKeyv } from "@keyv/redis";
import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { CacheableMemory } from "cacheable";
import { AppController } from "./app.controller";
import { MtgModule } from "./modules/mtg/mtg.module";
import { PokemonModule } from "./modules/pokemon/pokemon.module";

@Module({
    imports: [
        CacheModule.registerAsync({
            useFactory: async () => {
                return {
                    stores: [
                        new Keyv({
                            store: new CacheableMemory({ ttl: 1000 * 60 * 60 * 6, lruSize: 5000 }),
                        }),
                        createKeyv("redis://localhost:6379"),
                    ],
                };
            },
            isGlobal: true,
        }),
        MtgModule,
        PokemonModule,
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule {}
