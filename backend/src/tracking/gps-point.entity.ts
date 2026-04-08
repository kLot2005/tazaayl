import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index } from 'typeorm';
import { Truck } from '../trucks/truck.entity';
import * as GeoJSON from 'geojson';

@Entity('gps_points')
export class GpsPoint {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Truck)
    @Index()
    truck: Truck;

    @Column({
        type: 'geometry',
        spatialFeatureType: 'Point',
        srid: 4326,
    })
    location: GeoJSON.Point;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    timestamp: Date;
}
