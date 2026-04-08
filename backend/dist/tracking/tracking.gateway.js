"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackingGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const gps_point_entity_1 = require("./gps-point.entity");
const street_zones_service_1 = require("../street-zones/street-zones.service");
const telegram_service_1 = require("../telegram/telegram.service");
let TrackingGateway = class TrackingGateway {
    gpsPointsRepository;
    streetZonesService;
    telegramService;
    server;
    constructor(gpsPointsRepository, streetZonesService, telegramService) {
        this.gpsPointsRepository = gpsPointsRepository;
        this.streetZonesService = streetZonesService;
        this.telegramService = telegramService;
    }
    handleConnection(client) {
        console.log(`Client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        console.log(`Client disconnected: ${client.id}`);
    }
    async handleLocationUpdate(data, client) {
        const point = this.gpsPointsRepository.create({
            truck: { id: data.truckId },
            location: {
                type: 'Point',
                coordinates: [data.longitude, data.latitude],
            },
        });
        await this.gpsPointsRepository.save(point);
        const zone = await this.streetZonesService.findContainingZone(data.longitude, data.latitude);
        if (zone) {
            this.server.emit('truckEnteredZone', {
                truckId: data.truckId,
                zoneId: zone.id,
                zoneName: zone.name || 'Street Zone'
            });
            await this.telegramService.notifyZoneSubscribers(zone.id, `🚛 Мусоровоз въехал на вашу улицу! Пожалуйста, выносите мусор.`);
            console.log(`Truck ${data.truckId} is in Zone ${zone.id}. Notifications sent.`);
        }
        this.server.emit('locationUpdated', {
            truckId: data.truckId,
            latitude: data.latitude,
            longitude: data.longitude,
            timestamp: point.timestamp,
            zoneId: zone?.id || null
        });
        return { status: 'ok', inZone: !!zone };
    }
};
exports.TrackingGateway = TrackingGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], TrackingGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('updateLocation'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], TrackingGateway.prototype, "handleLocationUpdate", null);
exports.TrackingGateway = TrackingGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    }),
    __param(0, (0, typeorm_1.InjectRepository)(gps_point_entity_1.GpsPoint)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        street_zones_service_1.StreetZonesService,
        telegram_service_1.TelegramService])
], TrackingGateway);
//# sourceMappingURL=tracking.gateway.js.map