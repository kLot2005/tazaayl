import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { StreetZonesService } from './street-zones.service';
import { StreetZone } from '../entities/street-zone.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';

@Controller('street-zones')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StreetZonesController {
    constructor(private readonly streetZonesService: StreetZonesService) { }

    @Post()
    @Roles(UserRole.ADMIN)
    create(@Body() body: any) {
        return this.streetZonesService.create(body);
    }

    @Get()
    @Roles(UserRole.ADMIN)
    findAll() {
        return this.streetZonesService.findAll();
    }

    @Patch(':id')
    @Roles(UserRole.ADMIN)
    update(@Param('id') id: string, @Body() body: any) {
        return this.streetZonesService.update(+id, body);
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    remove(@Param('id') id: string) {
        return this.streetZonesService.remove(+id);
    }
}
