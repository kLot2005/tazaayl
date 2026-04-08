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
        console.log(`[TelegramBot] Start command from chatId: ${ctx.chat?.id}`);
        await ctx.reply('👋 Добро пожаловать в сервис Tazaayl!\n\nЧтобы получать уведомления о прибытии мусоровоза, пожалуйста, отправьте ваше местоположение (геолокацию).', {
            reply_markup: {
                keyboard: [
                    [{ text: '📍 Отправить местоположение', request_location: true }]
                ],
                resize_keyboard: true,
                one_time_keyboard: true
            },
        });
    }
    async onLocation(ctx) {
        const { latitude, longitude } = ctx.message.location;
        const chatId = ctx.chat.id.toString();
        console.log(`[TelegramBot] Received location from chatId: ${chatId} (${latitude}, ${longitude})`);
        const zone = await this.streetZonesService.findContainingZone(longitude, latitude);
        if (!zone) {
            console.log(`[TelegramBot] Zone NOT FOUND for coordinates of chatId: ${chatId}`);
            return ctx.reply('😔 К сожалению, ваш адрес пока не входит в зону обслуживания системы Tazaayl. Мы работаем над расширением!');
        }
        console.log(`[TelegramBot] Found zone "${zone.name}" for chatId: ${chatId}`);
        let subscriber = await this.subscriberRepository.findOneBy({ chatId });
        if (subscriber) {
            subscriber.zone = zone;
        }
        else {
            subscriber = this.subscriberRepository.create({
                chatId,
                zone,
                isActive: true
            });
        }
        await this.subscriberRepository.save(subscriber);
        console.log(`[TelegramBot] Subscriber ${chatId} successfully saved/updated for zone ${zone.id}`);
        await ctx.reply(`✅ Готово! Вы успешно подписаны на уведомления для зоны: "${zone.name}".\n\nМы сообщим вам в Telegram, как только мусоровоз выедет на вашу улицу! 🚛`, {
            reply_markup: { remove_keyboard: true }
        });
    }
    async onText(ctx) {
        await ctx.reply('Пожалуйста, используйте кнопку "📍 Отправить местоположение" для настройки уведомлений или введите /start');
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
    (0, nestjs_telegraf_1.On)('location'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TelegramUpdate.prototype, "onLocation", null);
__decorate([
    (0, nestjs_telegraf_1.On)('text'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TelegramUpdate.prototype, "onText", null);
exports.TelegramUpdate = TelegramUpdate = __decorate([
    (0, nestjs_telegraf_1.Update)(),
    __param(0, (0, typeorm_1.InjectRepository)(subscriber_entity_1.TelegramSubscriber)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        street_zones_service_1.StreetZonesService])
], TelegramUpdate);
//# sourceMappingURL=telegram.update.js.map