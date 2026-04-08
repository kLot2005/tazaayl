import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Repository } from 'typeorm';
import { GpsPoint } from './gps-point.entity';
import { Truck } from '../trucks/truck.entity';
import { StreetZonesService } from '../street-zones/street-zones.service';
import { TelegramService } from '../telegram/telegram.service';
export declare class TrackingGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private gpsPointsRepository;
    private trucksRepository;
    private streetZonesService;
    private telegramService;
    server: Server;
    constructor(gpsPointsRepository: Repository<GpsPoint>, trucksRepository: Repository<Truck>, streetZonesService: StreetZonesService, telegramService: TelegramService);
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    private notifiedToday;
    handleLocationUpdate(data: {
        truckId: number;
        latitude: number;
        longitude: number;
    }, client: Socket): Promise<{
        status: string;
    }>;
}
