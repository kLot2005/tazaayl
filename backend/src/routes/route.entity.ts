import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Truck } from '../trucks/truck.entity';
import { StreetZone } from '../entities/street-zone.entity';

@Entity('routes')
export class Route {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'date' })
    date: string;

    @ManyToOne(() => Truck)
    truck: Truck;

    @ManyToMany(() => StreetZone)
    @JoinTable({ name: 'route_zones' })
    zones: StreetZone[];
}
