import { ApiHideProperty } from "@nestjs/swagger";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { MoveSet } from "./moveset.entity";
import { Team } from "./team.entity";

class EffortLevels {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
}

@Entity()
export class Pokemon {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", nullable: false })
    name: string;

    @Column({ type: "boolean", nullable: false, default: false })
    isCustom?: boolean;

    @Column({ type: "varchar", nullable: true })
    gender?: string;

    @Column({ type: "boolean", nullable: false, default: false })
    shiny: boolean;

    @Column({ type: "varchar", nullable: false, default: "pokeball" })
    ball: string;

    @Column({ type: "varchar", nullable: false })
    type1?: string;

    @Column({ type: "varchar", nullable: true })
    type2?: string;

    @Column({ type: "varchar", nullable: true })
    ability?: string;

    @Column({ type: "tinyint", nullable: false })
    level: number;

    @Column({ type: "varchar", nullable: false })
    image: string;

    @Column({ type: "varchar", nullable: true })
    heldItem?: string;

    @Column({ type: "varchar", nullable: true })
    heldItemReplacementImage?: string;

    @Column("json", { nullable: true })
    effortLevels: EffortLevels;

    @ApiHideProperty()
    @ManyToOne(
        () => Team,
        (team) => team.pokemonTeam,
        { nullable: false, onDelete: "CASCADE" },
    )
    team: Team;

    @OneToOne(
        () => MoveSet,
        (moveSet) => moveSet.pokemon,
        {
            eager: true,
            cascade: true,
            onDelete: "CASCADE",
        },
    )
    @JoinColumn()
    moveSet: MoveSet;
}
