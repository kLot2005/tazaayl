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
        private streetZonesService: StreetZonesService,
        private telegramService: TelegramService,
    ) { }

    handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

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
        await this.gpsPointsRepository.save(point);

        // 2. Проверяем вхождение в геозону
        const zone = await this.streetZonesService.findContainingZone(data.longitude, data.latitude);

        if (zone) {
            // Уведомляем админов
            this.server.emit('truckEnteredZone', {
                truckId: data.truckId,
                zoneId: zone.id,
                zoneName: (zone as any).name || 'Street Zone'
            });

            // Отправляем уведомления жителям через Telegram
            await this.telegramService.notifyZoneSubscribers(
                zone.id,
                `🚛 Мусоровоз въехал на вашу улицу! Пожалуйста, выносите мусор.`
            );

            console.log(`Truck ${data.truckId} is in Zone ${zone.id}. Notifications sent.`);
        }

        // 3. Рассылаем всем текущее положение
        this.server.emit('locationUpdated', {
            truckId: data.truckId,
            latitude: data.latitude,
            longitude: data.longitude,
            timestamp: point.timestamp,
            zoneId: zone?.id || null
        });

        return { status: 'ok', inZone: !!zone };
    }
}
