import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import * as GeoJSON from 'geojson';

@Entity('street_zones')
export class StreetZone {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: 'Unnamed Zone' })
    name: string;

    @Column({ default: '#10b981' })
    color: string;

    @Column({
        type: 'geometry',
        spatialFeatureType: 'Polygon',
        srid: 4326,
        nullable: true,
    })
    boundary: GeoJSON.Polygon;
}
