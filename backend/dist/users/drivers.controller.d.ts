import { UsersService } from './users.service';
import { UserRole } from './user.entity';
import { RoutesService } from '../routes/routes.service';
export declare class DriversController {
    private readonly usersService;
    private readonly routesService;
    constructor(usersService: UsersService, routesService: RoutesService);
    createDriver(body: any): Promise<import("./user.entity").User>;
    findAll(): Promise<{
        zones: import("../entities/street-zone.entity").StreetZone[];
        id: number;
        username: string;
        password: string;
        role: UserRole;
        truck: import("../trucks/truck.entity").Truck;
    }[]>;
    remove(id: string): Promise<void>;
    updateDriver(id: string, body: any): Promise<import("./user.entity").User | null>;
}
