import { Repository } from 'typeorm';
import { StreetZone } from '../entities/street-zone.entity';
export declare class StreetZonesService {
    private streetZonesRepository;
    constructor(streetZonesRepository: Repository<StreetZone>);
    findAll(): Promise<StreetZone[]>;
    create(zone: Partial<StreetZone>): Promise<StreetZone>;
    update(id: number, zone: Partial<StreetZone>): Promise<StreetZone | null>;
    remove(id: number): Promise<void>;
    findContainingZone(longitude: number, latitude: number): Promise<StreetZone | null>;
}
