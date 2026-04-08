import { Repository } from 'typeorm';
import { Truck } from './truck.entity';
export declare class TrucksService {
    private trucksRepository;
    constructor(trucksRepository: Repository<Truck>);
    findAll(): Promise<Truck[]>;
    findOne(id: number): Promise<Truck | null>;
    create(truckData: Partial<Truck>): Promise<Truck>;
    update(id: number, truckData: Partial<Truck>): Promise<Truck | null>;
    remove(id: number): Promise<void>;
}
