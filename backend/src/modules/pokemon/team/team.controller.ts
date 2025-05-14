import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateTeamDto } from "./dtos/create-team.dto";
import { UpdateTeamDto } from "./dtos/update-team.dto";
import { TeamService } from "./team.service";

@ApiTags("Pokémon | Team")
@Controller("team")
export class TeamController {
    constructor(private readonly teamService: TeamService) {}

    //#region @Decorators
    @ApiOperation({ summary: "Get all teams" })
    //#endregion
    @Get()
    async getAllTeams() {
        return await this.teamService.getAllTeams();
    }

    //#region @Decorators
    @ApiOperation({ summary: "Get team" })
    //#endregion
    @Get(":idTeam")
    async getTeamById(@Param("idTeam") idTeam: number) {
        return await this.teamService.getTeamById(idTeam);
    }

    //#region @Decorators
    @ApiOperation({ summary: "Create team" })
    //#endregion
    @Post()
    async createTeam(@Body() createTeamDto: CreateTeamDto) {
        return await this.teamService.createTeam(createTeamDto);
    }

    //#region @Decorators
    @ApiOperation({ summary: "Update team" })
    //#endregion
    @Patch(":idTeam")
    async updateTeam(@Param("idTeam") idTeam: number, @Body() updateTeamDto: UpdateTeamDto) {
        return await this.teamService.updateTeam(idTeam, updateTeamDto);
    }

    //#region @Decorators
    @ApiOperation({ summary: "Delete team" })
    //#endregion
    @Delete("idTeam")
    async deleteTeam(@Param("idTeam") idTeam: number) {
        await this.teamService.deleteTeam(idTeam);
    }
}
