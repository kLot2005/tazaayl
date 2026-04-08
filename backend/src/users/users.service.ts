import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async findOne(username: string): Promise<User | null> {
        return this.usersRepository.findOne({
            where: { username },
            relations: ['truck']
        });
    }

    async findOneById(id: number): Promise<User | null> {
        return this.usersRepository.findOne({
            where: { id },
            relations: ['truck']
        });
    }

    async create(user: Partial<User>): Promise<User> {
        const newUser = this.usersRepository.create(user);
        return this.usersRepository.save(newUser);
    }

    async update(id: number, user: Partial<User>): Promise<User | null> {
        await this.usersRepository.update(id, user);
        return this.usersRepository.findOne({ where: { id }, relations: ['truck'] });
    }

    async findAllDrivers(): Promise<User[]> {
        return this.usersRepository.find({
            where: { role: UserRole.DRIVER },
            relations: ['truck']
        });
    }

    async save(user: User): Promise<User> {
        return this.usersRepository.save(user);
    }

    async remove(id: number): Promise<void> {
        await this.usersRepository.delete(id);
    }
}
