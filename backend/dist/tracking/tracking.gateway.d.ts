import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Repository } from 'typeorm';
import { GpsPoint } from './gps-point.entity';
import { StreetZonesService } from '../street-zones/street-zones.service';
import { TelegramService } from '../telegram/telegram.service';
export declare class TrackingGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private gpsPointsRepository;
    private streetZonesService;
    private telegramService;
    server: Server;
    constructor(gpsPointsRepository: Repository<GpsPoint>, streetZonesService: StreetZonesService, telegramService: TelegramService);
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleLocationUpdate(data: {
        truckId: number;
        latitude: number;
        longitude: number;
    }, client: Socket): Promise<{
        status: string;
        inZone: boolean;
    }>;
}
