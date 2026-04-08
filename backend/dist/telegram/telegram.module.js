"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramModule = void 0;
const common_1 = require("@nestjs/common");
const nestjs_telegraf_1 = require("nestjs-telegraf");
const typeorm_1 = require("@nestjs/typeorm");
const subscriber_entity_1 = require("./subscriber.entity");
const telegram_update_1 = require("./telegram.update");
const telegram_service_1 = require("./telegram.service");
const street_zones_module_1 = require("../street-zones/street-zones.module");
const config_1 = require("@nestjs/config");
let TelegramModule = class TelegramModule {
};
exports.TelegramModule = TelegramModule;
exports.TelegramModule = TelegramModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([subscriber_entity_1.TelegramSubscriber]),
            street_zones_module_1.StreetZonesModule,
            nestjs_telegraf_1.TelegrafModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => {
                    const token = configService.get('TELEGRAM_BOT_TOKEN');
                    console.log(`[TelegramModule] Initializing bot. Token present: ${!!token} (Prefix: ${token?.substring(0, 5)}...)`);
                    return {
                        token: token || 'NO_TOKEN',
                    };
                },
                inject: [config_1.ConfigService],
            }),
        ],
        providers: [telegram_update_1.TelegramUpdate, telegram_service_1.TelegramService],
        exports: [telegram_service_1.TelegramService],
    })
], TelegramModule);
//# sourceMappingURL=telegram.module.js.map