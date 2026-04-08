import { Repository } from 'typeorm';
import { User } from './user.entity';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    findOne(username: string): Promise<User | null>;
    findOneById(id: number): Promise<User | null>;
    create(user: Partial<User>): Promise<User>;
    update(id: number, user: Partial<User>): Promise<User | null>;
    findAllDrivers(): Promise<User[]>;
    save(user: User): Promise<User>;
    remove(id: number): Promise<void>;
}
