import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Truck } from './truck.entity';

@Injectable()
export class TrucksService {
    constructor(
        @InjectRepository(Truck)
        private trucksRepository: Repository<Truck>,
    ) { }

    findAll(): Promise<Truck[]> {
        return this.trucksRepository.find();
    }

    findOne(id: number): Promise<Truck | null> {
        return this.trucksRepository.findOneBy({ id });
    }

    async create(truckData: Partial<Truck>): Promise<Truck> {
        const truck = this.trucksRepository.create(truckData);
        return this.trucksRepository.save(truck);
    }

    async update(id: number, truckData: Partial<Truck>): Promise<Truck | null> {
        await this.trucksRepository.update(id, truckData);
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        await this.trucksRepository.delete(id);
    }
}
