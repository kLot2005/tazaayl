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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramSubscriber = void 0;
const typeorm_1 = require("typeorm");
const street_zone_entity_1 = require("../entities/street-zone.entity");
let TelegramSubscriber = class TelegramSubscriber {
    id;
    chatId;
    zone;
    isActive;
};
exports.TelegramSubscriber = TelegramSubscriber;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TelegramSubscriber.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', unique: true }),
    __metadata("design:type", Number)
], TelegramSubscriber.prototype, "chatId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => street_zone_entity_1.StreetZone, { onDelete: 'CASCADE' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", street_zone_entity_1.StreetZone)
], TelegramSubscriber.prototype, "zone", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], TelegramSubscriber.prototype, "isActive", void 0);
exports.TelegramSubscriber = TelegramSubscriber = __decorate([
    (0, typeorm_1.Entity)('telegram_subscribers')
], TelegramSubscriber);
//# sourceMappingURL=subscriber.entity.js.map