import { RoutesService } from './routes.service';
import { UsersService } from '../users/users.service';
export declare class RoutesController {
    private readonly routesService;
    private readonly usersService;
    constructor(routesService: RoutesService, usersService: UsersService);
    create(body: any): Promise<import("./route.entity").Route>;
    findAll(): Promise<import("./route.entity").Route[]>;
    getMyRoute(req: any): Promise<import("./route.entity").Route | null>;
    remove(id: string): Promise<void>;
}
