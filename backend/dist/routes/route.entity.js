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
exports.Route = void 0;
const typeorm_1 = require("typeorm");
const truck_entity_1 = require("../trucks/truck.entity");
const street_zone_entity_1 = require("../entities/street-zone.entity");
let Route = class Route {
    id;
    date;
    truck;
    zones;
};
exports.Route = Route;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Route.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], Route.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => truck_entity_1.Truck, { nullable: true, onDelete: 'SET NULL' }),
    __metadata("design:type", truck_entity_1.Truck)
], Route.prototype, "truck", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => street_zone_entity_1.StreetZone),
    (0, typeorm_1.JoinTable)({ name: 'route_zones' }),
    __metadata("design:type", Array)
], Route.prototype, "zones", void 0);
exports.Route = Route = __decorate([
    (0, typeorm_1.Entity)('routes')
], Route);
//# sourceMappingURL=route.entity.js.map