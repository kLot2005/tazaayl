"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreetZonesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const street_zones_service_1 = require("./street-zones.service");
const street_zones_controller_1 = require("./street-zones.controller");
const street_zone_entity_1 = require("../entities/street-zone.entity");
let StreetZonesModule = class StreetZonesModule {
};
exports.StreetZonesModule = StreetZonesModule;
exports.StreetZonesModule = StreetZonesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([street_zone_entity_1.StreetZone])],
        providers: [street_zones_service_1.StreetZonesService],
        controllers: [street_zones_controller_1.StreetZonesController],
        exports: [street_zones_service_1.StreetZonesService],
    })
], StreetZonesModule);
//# sourceMappingURL=street-zones.module.js.map