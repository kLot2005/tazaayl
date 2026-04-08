import { User } from '../users/user.entity';
import { Truck } from '../trucks/truck.entity';
export declare class Shift {
    id: number;
    user: User;
    truck: Truck;
    startTime: Date;
    endTime: Date;
    isActive: boolean;
    createdAt: Date;
}
