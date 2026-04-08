import { Truck } from '../trucks/truck.entity';
export declare enum UserRole {
    ADMIN = "admin",
    DRIVER = "driver"
}
export declare class User {
    id: number;
    username: string;
    password: string;
    role: UserRole;
    truck: Truck;
}
