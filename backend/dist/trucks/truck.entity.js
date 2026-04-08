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
exports.Truck = exports.TruckStatus = void 0;
const typeorm_1 = require("typeorm");
var TruckStatus;
(function (TruckStatus) {
    TruckStatus["ACTIVE"] = "active";
    TruckStatus["MAINTENANCE"] = "maintenance";
    TruckStatus["INACTIVE"] = "inactive";
})(TruckStatus || (exports.TruckStatus = TruckStatus = {}));
let Truck = class Truck {
    id;
    plateNumber;
    model;
    status;
    capacity;
    currentLat;
    currentLon;
};
exports.Truck = Truck;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Truck.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Truck.prototype, "plateNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Truck.prototype, "model", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TruckStatus,
        default: TruckStatus.ACTIVE,
    }),
    __metadata("design:type", String)
], Truck.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Truck.prototype, "capacity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata("design:type", Number)
], Truck.prototype, "currentLat", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata("design:type", Number)
], Truck.prototype, "currentLon", void 0);
exports.Truck = Truck = __decorate([
    (0, typeorm_1.Entity)('trucks')
], Truck);
//# sourceMappingURL=truck.entity.js.map