import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shift } from './shift.entity';
import { User } from '../users/user.entity';

@Injectable()
export class ShiftsService {
    constructor(
        @InjectRepository(Shift)
        private shiftsRepository: Repository<Shift>,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async startShift(userId: number) {
        const user = await this.usersRepository.findOne({
            where: { id: userId },
            relations: ['truck']
        });

        if (!user || !user.truck) {
            throw new BadRequestException('Driver must be assigned to a truck to start a shift');
        }

        const activeShift = await this.shiftsRepository.findOne({
            where: { user: { id: userId }, isActive: true }
        });

        if (activeShift) {
            throw new BadRequestException('Shift already active');
        }

        const shift = this.shiftsRepository.create({
            user,
            truck: user.truck,
            isActive: true,
            startTime: new Date()
        });

        const savedShift = await this.shiftsRepository.save(shift);

        // Возвращаем смену с подгруженными данными о машине
        return this.shiftsRepository.findOne({
            where: { id: savedShift.id },
            relations: ['truck']
        });
    }

    async endShift(userId: number) {
        const activeShift = await this.shiftsRepository.findOne({
            where: { user: { id: userId }, isActive: true }
        });

        if (!activeShift) {
            throw new BadRequestException('No active shift found');
        }

        activeShift.isActive = false;
        activeShift.endTime = new Date();
        return this.shiftsRepository.save(activeShift);
    }

    async getActiveShift(userId: number) {
        return this.shiftsRepository.findOne({
            where: { user: { id: userId }, isActive: true },
            relations: ['truck']
        });
    }
}
