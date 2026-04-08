import { Controller, Get, Post, Body, Patch, Param, UseGuards, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRole } from './user.entity';
import * as bcrypt from 'bcrypt';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoutesService } from '../routes/routes.service';

@Controller('drivers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DriversController {
    constructor(
        private readonly usersService: UsersService,
        private readonly routesService: RoutesService,
    ) { }

    @Post()
    @Roles(UserRole.ADMIN)
    async createDriver(@Body() body: any) {
        const hashedPassword = await bcrypt.hash(body.password, 10);
        const user = await this.usersService.create({
            username: body.username,
            password: hashedPassword,
            role: UserRole.DRIVER,
            truck: body.truckId ? { id: body.truckId } as any : null,
        });

        if (body.truckId && body.zoneIds && body.zoneIds.length > 0) {
            const today = new Date().toISOString().split('T')[0];
            await this.routesService.create({
                date: today,
                truckId: body.truckId,
                zoneIds: body.zoneIds,
            });
        }
        return user;
    }

    @Get()
    @Roles(UserRole.ADMIN)
    async findAll() {
        const drivers = await this.usersService.findAllDrivers();
        // Подмешиваем информацию о зонах для каждого водителя
        const driversWithZones = await Promise.all(drivers.map(async (driver) => {
            if (driver.truck) {
                const route = await this.routesService.findCurrentRouteForTruck(driver.truck.id);
                return { ...driver, zones: route ? route.zones : [] };
            }
            return { ...driver, zones: [] };
        }));
        return driversWithZones;
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    async remove(@Param('id') id: string) {
        return this.usersService.remove(+id);
    }

    @Patch(':id')
    @Roles(UserRole.ADMIN)
    async updateDriver(@Param('id') id: string, @Body() body: any) {
        const updateData: any = {
            username: body.username,
            truck: body.truckId ? { id: body.truckId } as any : null,
        };

        if (body.password && body.password.trim() !== '') {
            updateData.password = await bcrypt.hash(body.password, 10);
        }

        const user = await this.usersService.update(+id, updateData);

        if (body.truckId && body.zoneIds && body.zoneIds.length > 0) {
            const today = new Date().toISOString().split('T')[0];
            await this.routesService.removeByTruckAndDate(body.truckId, today);
            await this.routesService.create({
                date: today,
                truckId: body.truckId,
                zoneIds: body.zoneIds,
            });
        }

        return user;
    }
}
