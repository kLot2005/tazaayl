import { Controller, Get, Post, Body, Delete, Param, UseGuards, Request, Inject, forwardRef } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';
import { UsersService } from '../users/users.service';

@Controller('routes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RoutesController {
    constructor(
        private readonly routesService: RoutesService,
        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService,
    ) { }

    @Post()
    @Roles(UserRole.ADMIN)
    create(@Body() body: any) {
        return this.routesService.create(body);
    }

    @Get()
    @Roles(UserRole.ADMIN)
    findAll() {
        return this.routesService.findAll();
    }

    @Get('my-route')
    @Roles(UserRole.ADMIN, UserRole.DRIVER)
    async getMyRoute(@Request() req) {
        const user = await this.usersService.findOneById(req.user.userId);
        if (!user || !user.truck) {
            return null;
        }
        return this.routesService.findCurrentRouteForTruck(user.truck.id);
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    remove(@Param('id') id: string) {
        return this.routesService.remove(+id);
    }
}
