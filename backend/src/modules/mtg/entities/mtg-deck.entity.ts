import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class MtgDeck {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", nullable: false })
    name: string;

    @Column({ type: "varchar", nullable: true })
    archidektUrl: string;

    @Column({ type: "varchar", nullable: true })
    ligamagicUrl: string;

    @Column({ type: "varchar", nullable: false })
    coverCard: string;

    @Column({ type: "int", nullable: false })
    order: number;

    @Column({ type: "boolean", nullable: false, default: true })
    completed: boolean;
}
