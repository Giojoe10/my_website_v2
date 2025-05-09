import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateTeamDto } from "./dtos/create-team.dto";
import { UpdateTeamDto } from "./dtos/update-team.dto";
import { MoveSet } from "./entities/moveset.entity";
import { Pokemon } from "./entities/pokemon.entity";
import { Team } from "./entities/team.entity";

@Injectable()
export class TeamService {
    constructor(
        @InjectRepository(Team)
        private teamRepository: Repository<Team>,
        @InjectRepository(Pokemon)
        private pokemonRepository: Repository<Pokemon>,
        @InjectRepository(MoveSet)
        private moveSetRepository: Repository<MoveSet>,
    ) {}

    async getAllTeams(): Promise<Team[]> {
        return this.teamRepository.find();
    }

    async getTeamById(idTeam: number): Promise<Team> {
        const team = await this.teamRepository.findOneBy({ id: idTeam });
        if (!team) {
            throw new NotFoundException("Team not found!");
        }
        return team;
    }

    async createTeam(createTeamDto: CreateTeamDto): Promise<Team> {
        const pokemonTeam: Pokemon[] = [];

        for (const pokemon of createTeamDto.pokemonTeam) {
            const newMoveSet = pokemon.moveSet ? this.moveSetRepository.create(pokemon.moveSet) : null;
            const newPokemon = this.pokemonRepository.create({ ...pokemon, moveSet: newMoveSet || null });
            pokemonTeam.push(newPokemon);
        }

        const newTeam = this.teamRepository.create({ ...createTeamDto, pokemonTeam });
        const team = this.teamRepository.save(newTeam);
        return team;
    }

    async updateTeam(idTeam: number, updateTeamDto: UpdateTeamDto): Promise<Team> {
        const team = await this.getTeamById(idTeam);

        Object.assign(team, updateTeamDto);

        return await this.teamRepository.save(team);
    }

    async deleteTeam(idTeam: number) {
        const team = await this.getTeamById(idTeam);
        for (const pokemon of team.pokemonTeam) {
            const moveSet = pokemon.moveSet;
            await this.pokemonRepository.save(Object.assign(pokemon, { ...pokemon, moveSet: null }));
            await this.moveSetRepository.remove(moveSet);
        }
        await this.teamRepository.remove(team);
    }
}
