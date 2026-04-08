import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackingGateway } from './tracking.gateway';
import { GpsPoint } from './gps-point.entity';
import { StreetZonesModule } from '../street-zones/street-zones.module';
import { TelegramModule } from '../telegram/telegram.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([GpsPoint]),
        StreetZonesModule,
        TelegramModule,
    ],
    providers: [TrackingGateway],
})
export class TrackingModule { }
