import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PokemonController } from "./pokemon.controller";
import { PokemonService } from "./pokemon.service";
import { MoveSet } from "./team/entities/moveset.entity";
import { Pokemon } from "./team/entities/pokemon.entity";
import { Team } from "./team/entities/team.entity";
import { TeamController } from "./team/team.controller";
import { TeamModule } from "./team/team.module";
import { TeamService } from "./team/team.service";

@Module({
    imports: [TypeOrmModule.forFeature([Team, Pokemon, MoveSet]), TeamModule],
    providers: [PokemonService, TeamService],
    controllers: [PokemonController, TeamController],
})
export class PokemonModule {}
