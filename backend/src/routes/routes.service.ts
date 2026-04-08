import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Route } from './route.entity';

@Injectable()
export class RoutesService {
    constructor(
        @InjectRepository(Route)
        private routesRepository: Repository<Route>,
    ) { }

    findAll(): Promise<Route[]> {
        return this.routesRepository.find({
            relations: ['truck', 'zones'],
        });
    }

    create(routeData: any): Promise<Route> {
        const route = this.routesRepository.create({
            date: routeData.date,
            truck: { id: routeData.truckId },
            zones: routeData.zoneIds.map((id: number) => ({ id })),
        });
        return this.routesRepository.save(route);
    }

    async remove(id: number): Promise<void> {
        await this.routesRepository.delete(id);
    }

    async findCurrentRouteForTruck(truckId: number): Promise<Route | null> {
        const today = new Date().toISOString().split('T')[0];
        return this.routesRepository.findOne({
            where: {
                truck: { id: truckId },
                date: today
            },
            relations: ['zones']
        });
    }

    async removeByTruckAndDate(truckId: number, date: string): Promise<void> {
        await this.routesRepository.delete({
            truck: { id: truckId },
            date: date
        });
    }
}
