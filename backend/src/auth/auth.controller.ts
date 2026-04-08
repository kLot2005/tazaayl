import { Controller, Post, Body, UnauthorizedException, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Truck, TruckStatus } from '../trucks/truck.entity';
import { Route } from '../routes/route.entity';
import { StreetZone } from '../entities/street-zone.entity';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private usersService: UsersService,
        @InjectRepository(Truck)
        private truckRepository: Repository<Truck>,
        @InjectRepository(Route)
        private routeRepository: Repository<Route>,
        @InjectRepository(StreetZone)
        private zoneRepository: Repository<StreetZone>,
    ) { }

    @Post('login')
    async login(@Body() body: any) {
        const user = await this.authService.validateUser(body.username, body.password);
        if (!user) {
            throw new UnauthorizedException();
        }
        return this.authService.login(user);
    }

    @Get('seed')
    async seed() {
        // 1. Создаем Админа
        let admin = await this.usersService.findOne('admin');
        if (!admin) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            admin = await this.usersService.create({
                username: 'admin',
                password: hashedPassword,
                role: UserRole.ADMIN,
            });
        }

        // 2. Создаем или находим Грузовик
        let truck = await this.truckRepository.findOne({ where: { plateNumber: '01 KZ 777' } });
        if (!truck) {
            truck = this.truckRepository.create({
                plateNumber: '01 KZ 777',
                model: 'KamAZ 65115',
                capacity: 15,
                status: TruckStatus.ACTIVE
            });
            truck = await this.truckRepository.save(truck);
        }

        // 3. Создаем Водителя
        let driver = await this.usersService.findOne('driver1');
        if (!driver) {
            const driverPassword = await bcrypt.hash('password', 10);
            driver = await this.usersService.create({
                username: 'driver1',
                password: driverPassword,
                role: UserRole.DRIVER,
            });
        }

        // 4. Привязываем грузовик к водителю
        driver.truck = truck;
        await this.usersService.save(driver);

        // 5. Создаем маршрут из всех существующих зон
        const allZones = await this.zoneRepository.find();
        const today = new Date().toISOString().split('T')[0];

        // Удалим старый маршрут на сегодня если есть
        await this.routeRepository.delete({ date: today, truck: { id: truck.id } });

        if (allZones.length > 0) {
            const route = this.routeRepository.create({
                date: today,
                truck: truck,
                zones: allZones
            });
            await this.routeRepository.save(route);
        }

        return {
            message: 'Seed successful',
            admin: 'admin / admin123',
            driver: 'driver1 / password',
            truck: '01 KZ 777 assigned to driver1',
            route: `Route for today created with ${allZones.length} zones`
        };
    }
}
