import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Truck } from '../trucks/truck.entity';

@Entity('shifts')
export class Shift {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    user: User; // Было driver, исправил на user

    @ManyToOne(() => Truck)
    truck: Truck;

    @Column({ type: 'timestamp' })
    startTime: Date;

    @Column({ type: 'timestamp', nullable: true })
    endTime: Date;

    @Column({ default: true })
    isActive: boolean; // Добавил недостающее поле

    @CreateDateColumn()
    createdAt: Date;
}
