import { Repository } from 'typeorm';
import { Shift } from './shift.entity';
import { User } from '../users/user.entity';
export declare class ShiftsService {
    private shiftsRepository;
    private usersRepository;
    constructor(shiftsRepository: Repository<Shift>, usersRepository: Repository<User>);
    startShift(userId: number): Promise<Shift | null>;
    endShift(userId: number): Promise<Shift>;
    getActiveShift(userId: number): Promise<Shift | null>;
}
