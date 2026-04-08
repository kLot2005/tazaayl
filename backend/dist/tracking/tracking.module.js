"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackingModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const tracking_gateway_1 = require("./tracking.gateway");
const gps_point_entity_1 = require("./gps-point.entity");
const street_zones_module_1 = require("../street-zones/street-zones.module");
const telegram_module_1 = require("../telegram/telegram.module");
let TrackingModule = class TrackingModule {
};
exports.TrackingModule = TrackingModule;
exports.TrackingModule = TrackingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([gps_point_entity_1.GpsPoint]),
            street_zones_module_1.StreetZonesModule,
            telegram_module_1.TelegramModule,
        ],
        providers: [tracking_gateway_1.TrackingGateway],
    })
], TrackingModule);
//# sourceMappingURL=tracking.module.js.map