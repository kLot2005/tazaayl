import { Repository } from 'typeorm';
import { Route } from './route.entity';
export declare class RoutesService {
    private routesRepository;
    constructor(routesRepository: Repository<Route>);
    findAll(): Promise<Route[]>;
    create(routeData: any): Promise<Route>;
    remove(id: number): Promise<void>;
    findCurrentRouteForTruck(truckId: number): Promise<Route | null>;
    removeByTruckAndDate(truckId: number, date: string): Promise<void>;
}
