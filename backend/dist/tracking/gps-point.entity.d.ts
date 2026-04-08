import { Truck } from '../trucks/truck.entity';
import * as GeoJSON from 'geojson';
export declare class GpsPoint {
    id: number;
    truck: Truck;
    location: GeoJSON.Point;
    timestamp: Date;
}
