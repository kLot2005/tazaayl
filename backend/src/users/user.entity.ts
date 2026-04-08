import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Truck } from '../trucks/truck.entity';

export enum UserRole {
    ADMIN = 'admin',
    DRIVER = 'driver',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.DRIVER,
    })
    role: UserRole;

    @ManyToOne(() => Truck, { nullable: true, onDelete: 'SET NULL' })
    truck: Truck;
}
