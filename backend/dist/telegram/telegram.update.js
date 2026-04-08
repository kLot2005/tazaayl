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
exports.TelegramUpdate = void 0;
const nestjs_telegraf_1 = require("nestjs-telegraf");
const telegraf_1 = require("telegraf");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const subscriber_entity_1 = require("./subscriber.entity");
const street_zones_service_1 = require("../street-zones/street-zones.service");
let TelegramUpdate = class TelegramUpdate {
    subscriberRepository;
    streetZonesService;
    constructor(subscriberRepository, streetZonesService) {
        this.subscriberRepository = subscriberRepository;
        this.streetZonesService = streetZonesService;
    }
    async onStart(ctx) {
        const zones = await this.streetZonesService.findAll();
        const keyboard = zones.map(z => [{ text: `Подписаться на: ${z.id}`, callback_data: `subscribe_${z.id}` }]);
        await ctx.reply('Добро пожаловать в Tazaayl! Выберите ID зоны вашей улицы для подписки на уведомления о мусоровозе:', {
            reply_markup: {
                inline_keyboard: keyboard,
            },
        });
    }
    async onAction(ctx) {
        const data = ctx.update.callback_query.data;
        if (data.startsWith('subscribe_')) {
            const zoneId = parseInt(data.split('_')[1]);
            const chatId = ctx.update.callback_query.message.chat.id;
            let subscriber = await this.subscriberRepository.findOneBy({ chatId });
            if (subscriber) {
                subscriber.zone = { id: zoneId };
            }
            else {
                subscriber = this.subscriberRepository.create({ chatId, zone: { id: zoneId } });
            }
            await this.subscriberRepository.save(subscriber);
            await ctx.answerCbQuery('Вы успешно подписались!');
            await ctx.reply(`Вы подписаны на уведомления для зоны #${zoneId}. Мы сообщим, когда мусоровоз будет рядом!`);
        }
    }
    async sendNotificationToZone(zoneId, message) {
        const subscribers = await this.subscriberRepository.find({
            where: { zone: { id: zoneId }, isActive: true },
        });
    }
};
exports.TelegramUpdate = TelegramUpdate;
__decorate([
    (0, nestjs_telegraf_1.Start)(),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TelegramUpdate.prototype, "onStart", null);
__decorate([
    (0, nestjs_telegraf_1.On)('callback_query'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TelegramUpdate.prototype, "onAction", null);
exports.TelegramUpdate = TelegramUpdate = __decorate([
    (0, nestjs_telegraf_1.Update)(),
    __param(0, (0, typeorm_1.InjectRepository)(subscriber_entity_1.TelegramSubscriber)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        street_zones_service_1.StreetZonesService])
], TelegramUpdate);
//# sourceMappingURL=telegram.update.js.map