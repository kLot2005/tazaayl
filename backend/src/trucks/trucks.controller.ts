import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Inject, forwardRef } from '@nestjs/common';
import { TrucksService } from './trucks.service';
import { Truck } from './truck.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { RoutesService } from '../routes/routes.service';

@Controller('trucks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TrucksController {
    constructor(
        private readonly trucksService: TrucksService,
        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService,
        @Inject(forwardRef(() => RoutesService))
        private readonly routesService: RoutesService,
    ) { }

    @Post()
    @Roles(UserRole.ADMIN)
    create(@Body() truck: Partial<Truck>) {
        return this.trucksService.create(truck);
    }

    @Get()
    @Roles(UserRole.ADMIN)
    async findAll() {
        const trucks = await this.trucksService.findAll();
        const drivers = await this.usersService.findAllDrivers();
        const today = new Date().toISOString().split('T')[0];

        const trucksWithInfo = await Promise.all(trucks.map(async (truck) => {
            const driver = drivers.find(d => d.truck?.id === truck.id);
            const route = await this.routesService.findCurrentRouteForTruck(truck.id);

            return {
                ...truck,
                driver: driver ? { id: driver.id, username: driver.username } : null,
                zones: route ? route.zones : []
            };
        }));

        return trucksWithInfo;
    }

    @Get(':id')
    @Roles(UserRole.ADMIN)
    findOne(@Param('id') id: string) {
        return this.trucksService.findOne(+id);
    }

    @Patch(':id')
    @Roles(UserRole.ADMIN)
    update(@Param('id') id: string, @Body() truck: Partial<Truck>) {
        return this.trucksService.update(+id, truck);
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    remove(@Param('id') id: string) {
        return this.trucksService.remove(+id);
    }
}
