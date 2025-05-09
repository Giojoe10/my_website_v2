import { Keyv, createKeyv } from "@keyv/redis";
import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CacheableMemory } from "cacheable";
import { DataSource } from "typeorm";
import { AppController } from "./app.controller";
import { ImageModule } from "./modules/image/image.module";
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
        TypeOrmModule.forRoot({
            type: "sqlite",
            database: "giojoe.db",
            autoLoadEntities: true,
            synchronize: true,
        }),
        MtgModule,
        PokemonModule,
        ImageModule,
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule {
    constructor(private dataSource: DataSource) {}
}
