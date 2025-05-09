import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Pokemon } from "./pokemon.entity";

@Entity()
export class Team {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", nullable: false })
    game: string;

    @Column({ type: "varchar", nullable: false })
    color: string;

    @Column({ type: "boolean", nullable: false, default: false })
    rainbowBorder: boolean;

    @Column({ type: "varchar", nullable: false })
    trainerImage: string;

    @Column({ type: "varchar", nullable: false, default: "Giojoe" })
    trainerName: string;

    @Column({ type: "varchar", nullable: true })
    trainerTown?: string;

    @Column({ type: "boolean", nullable: false, default: false })
    extra: boolean;

    @OneToMany(
        () => Pokemon,
        (pokemon) => pokemon.team,
        { cascade: true, eager: true },
    )
    pokemonTeam: Pokemon[];
}
