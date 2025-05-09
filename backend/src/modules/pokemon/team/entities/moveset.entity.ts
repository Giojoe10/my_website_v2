import { ApiHideProperty } from "@nestjs/swagger";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Pokemon } from "./pokemon.entity";

class Move {
    name: string;
    type: string;
    category: string;
    oldSplitCategory: string;
}

@Entity()
export class MoveSet {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("json", { nullable: true })
    move1: Move;

    @Column("json", { nullable: true })
    move2: Move;

    @Column("json", { nullable: true })
    move3: Move;

    @Column("json", { nullable: true })
    move4: Move;

    @ApiHideProperty()
    @OneToOne(
        () => Pokemon,
        (pokemon) => pokemon.moveSet,
    )
    pokemon: Pokemon;
}
