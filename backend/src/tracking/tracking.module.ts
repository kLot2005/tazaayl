import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackingGateway } from './tracking.gateway';
import { GpsPoint } from './gps-point.entity';
import { Truck } from '../trucks/truck.entity';
import { StreetZonesModule } from '../street-zones/street-zones.module';
import { TelegramModule } from '../telegram/telegram.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([GpsPoint, Truck]),
        StreetZonesModule,
        TelegramModule,
    ],
    providers: [TrackingGateway],
})
export class TrackingModule { }
