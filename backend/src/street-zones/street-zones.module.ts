import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StreetZonesService } from './street-zones.service';
import { StreetZonesController } from './street-zones.controller';
import { StreetZone } from '../entities/street-zone.entity';

@Module({
    imports: [TypeOrmModule.forFeature([StreetZone])],
    providers: [StreetZonesService],
    controllers: [StreetZonesController],
    exports: [StreetZonesService],
})
export class StreetZonesModule { }
