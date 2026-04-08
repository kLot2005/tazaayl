import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm';
import { Truck } from '../trucks/truck.entity';
import { Route } from '../routes/route.entity';
import { StreetZone } from '../entities/street-zone.entity';
export declare class AuthController {
    private authService;
    private usersService;
    private truckRepository;
    private routeRepository;
    private zoneRepository;
    constructor(authService: AuthService, usersService: UsersService, truckRepository: Repository<Truck>, routeRepository: Repository<Route>, zoneRepository: Repository<StreetZone>);
    login(body: any): Promise<{
        access_token: string;
        user: {
            id: any;
            username: any;
            role: any;
        };
    }>;
    seed(): Promise<{
        message: string;
        admin: string;
        driver: string;
        truck: string;
        route: string;
    }>;
}
