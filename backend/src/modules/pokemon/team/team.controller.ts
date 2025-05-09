import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateTeamDto } from "./dtos/create-team.dto";
import { UpdateTeamDto } from "./dtos/update-team.dto";
import { TeamService } from "./team.service";

@ApiTags("Pokémon | Team")
@Controller("team")
export class TeamController {
    constructor(private readonly teamService: TeamService) {}

    @ApiOperation({ summary: "Get all teams" })
    @Get()
    async getAllTeams() {
        return await this.teamService.getAllTeams();
    }

    @ApiOperation({ summary: "Get team" })
    @Get(":idTeam")
    async getTeamById(@Param("idTeam") idTeam: number) {
        return await this.teamService.getTeamById(idTeam);
    }

    @ApiOperation({ summary: "Create team" })
    @Post()
    async createTeam(@Body() createTeamDto: CreateTeamDto) {
        return await this.teamService.createTeam(createTeamDto);
    }

    @ApiOperation({ summary: "Update team" })
    @Patch(":idTeam")
    async updateTeam(@Param("idTeam") idTeam: number, @Body() updateTeamDto: UpdateTeamDto) {
        return await this.teamService.updateTeam(idTeam, updateTeamDto);
    }

    @ApiOperation({ summary: "Delete team" })
    @Delete("idTeam")
    async deleteTeam(@Param("idTeam") idTeam: number) {
        await this.teamService.deleteTeam(idTeam);
    }
}
