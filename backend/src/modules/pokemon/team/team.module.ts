import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PokemonService } from "../pokemon.service";
import { MoveSet } from "./entities/moveset.entity";
import { Pokemon } from "./entities/pokemon.entity";
import { Team } from "./entities/team.entity";
import { TeamController } from "./team.controller";
import { TeamService } from "./team.service";

@Module({
    imports: [TypeOrmModule.forFeature([Team, Pokemon, MoveSet])],
    providers: [TeamService, PokemonService],
    controllers: [TeamController],
})
export class TeamModule {}
