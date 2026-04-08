import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StreetZone } from '../entities/street-zone.entity';

@Injectable()
export class StreetZonesService {
    constructor(
        @InjectRepository(StreetZone)
        private streetZonesRepository: Repository<StreetZone>,
    ) { }

    findAll(): Promise<StreetZone[]> {
        return this.streetZonesRepository.find();
    }

    create(zone: Partial<StreetZone>): Promise<StreetZone> {
        const newZone = this.streetZonesRepository.create(zone);
        return this.streetZonesRepository.save(newZone);
    }

    async update(id: number, zone: Partial<StreetZone>): Promise<StreetZone | null> {
        await this.streetZonesRepository.update(id, zone);
        return this.streetZonesRepository.findOneBy({ id });
    }

    async remove(id: number): Promise<void> {
        await this.streetZonesRepository.delete(id);
    }

    async findContainingZone(longitude: number, latitude: number): Promise<StreetZone | null> {
        const result = await this.streetZonesRepository
            .createQueryBuilder('zone')
            .where('ST_Contains(zone.boundary, ST_SetSRID(ST_Point(:lng, :lat), 4326))', {
                lng: longitude,
                lat: latitude,
            })
            .getOne();
        return result;
    }
}
