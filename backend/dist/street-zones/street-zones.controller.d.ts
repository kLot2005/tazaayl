import { StreetZonesService } from './street-zones.service';
import { StreetZone } from '../entities/street-zone.entity';
export declare class StreetZonesController {
    private readonly streetZonesService;
    constructor(streetZonesService: StreetZonesService);
    create(body: any): Promise<StreetZone>;
    findAll(): Promise<StreetZone[]>;
    update(id: string, body: any): Promise<StreetZone | null>;
    remove(id: string): Promise<void>;
}
