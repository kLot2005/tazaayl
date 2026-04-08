import { Truck } from '../trucks/truck.entity';
import { StreetZone } from '../entities/street-zone.entity';
export declare class Route {
    id: number;
    date: string;
    truck: Truck;
    zones: StreetZone[];
}
