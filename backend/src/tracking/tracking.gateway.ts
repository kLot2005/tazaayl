import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GpsPoint } from './gps-point.entity';
import { Truck } from '../trucks/truck.entity';
import { StreetZonesService } from '../street-zones/street-zones.service';
import { TelegramService } from '../telegram/telegram.service';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class TrackingGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(
        @InjectRepository(GpsPoint)
        private gpsPointsRepository: Repository<GpsPoint>,
        @InjectRepository(Truck)
        private trucksRepository: Repository<Truck>,
        private streetZonesService: StreetZonesService,
        private telegramService: TelegramService,
    ) { }

    handleConnection(client: Socket) {
    }

    handleDisconnect(client: Socket) {
    }

    // Кэш для предотвращения спама в Telegram (Date:TruckId:ZoneId)
    private notifiedToday = new Set<string>();

    @SubscribeMessage('updateLocation')
    async handleLocationUpdate(
        @MessageBody() data: { truckId: number; latitude: number; longitude: number },
        @ConnectedSocket() client: Socket,
    ) {
        // 1. Сохраняем в базу данных для истории
        const point = this.gpsPointsRepository.create({
            truck: { id: data.truckId },
            location: {
                type: 'Point',
                coordinates: [data.longitude, data.latitude],
            },
        });

        // Обновляем текущее положение в таблице машин
        await Promise.all([
            this.gpsPointsRepository.save(point),
            this.trucksRepository.update(data.truckId, {
                currentLat: data.latitude,
                currentLon: data.longitude
            })
        ]);

        // 2. СРАЗУ рассылаем всем текущее положение
        this.server.emit('locationUpdated', {
            truckId: data.truckId,
            latitude: data.latitude,
            longitude: data.longitude,
            timestamp: point.timestamp,
        });

        // 3. Фоновая проверка геозон и уведомления (не блокирует основной поток)
        try {
            const zone = await this.streetZonesService.findContainingZone(data.longitude, data.latitude);

            if (zone) {
                const today = new Date().toISOString().split('T')[0];
                const notificationKey = `${today}:${data.truckId}:${zone.id}`;

                if (!this.notifiedToday.has(notificationKey)) {
                    // Уведомляем админов в вебе
                    this.server.emit('truckEnteredZone', {
                        truckId: data.truckId,
                        zoneId: zone.id,
                        zoneName: (zone as any).name || 'Street Zone'
                    });

                    // Уведомляем жителей в Telegram
                    await this.telegramService.notifyZoneSubscribers(
                        zone.id,
                        `🚛 Спецтехника Тазалык заехала в зону "${zone.name}". Скоро будем у вас!`
                    );

                    this.notifiedToday.add(notificationKey);
                }
            }
        } catch (e) {
            console.error(`[TrackingGateway] Error in zone processing:`, e.message);
        }

        return { status: 'ok' };
    }
}
