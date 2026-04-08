import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum TruckStatus {
    ACTIVE = 'active',
    MAINTENANCE = 'maintenance',
    INACTIVE = 'inactive',
}

@Entity('trucks')
export class Truck {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    plateNumber: string;

    @Column({ nullable: true })
    model: string;

    @Column({
        type: 'enum',
        enum: TruckStatus,
        default: TruckStatus.ACTIVE,
    })
    status: TruckStatus;

    @Column({ nullable: true })
    capacity: number; // Вместимость в кубометрах или тоннах

    @Column({ type: 'float', nullable: true })
    currentLat: number;

    @Column({ type: 'float', nullable: true })
    currentLon: number;
}
