import { TrucksService } from './trucks.service';
import { Truck } from './truck.entity';
import { UsersService } from '../users/users.service';
import { RoutesService } from '../routes/routes.service';
export declare class TrucksController {
    private readonly trucksService;
    private readonly usersService;
    private readonly routesService;
    constructor(trucksService: TrucksService, usersService: UsersService, routesService: RoutesService);
    create(truck: Partial<Truck>): Promise<Truck>;
    findAll(): Promise<{
        truckId: number;
        latitude: number;
        longitude: number;
        driver: {
            id: number;
            username: string;
        } | null;
        zones: import("../entities/street-zone.entity").StreetZone[];
        id: number;
        plateNumber: string;
        model: string;
        status: import("./truck.entity").TruckStatus;
        capacity: number;
        currentLat: number;
        currentLon: number;
    }[]>;
    findOne(id: string): Promise<Truck | null>;
    update(id: string, truck: Partial<Truck>): Promise<Truck | null>;
    remove(id: string): Promise<void>;
}
