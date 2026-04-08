"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrucksModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const trucks_service_1 = require("./trucks.service");
const trucks_controller_1 = require("./trucks.controller");
const truck_entity_1 = require("./truck.entity");
const users_module_1 = require("../users/users.module");
const routes_module_1 = require("../routes/routes.module");
const common_2 = require("@nestjs/common");
let TrucksModule = class TrucksModule {
};
exports.TrucksModule = TrucksModule;
exports.TrucksModule = TrucksModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([truck_entity_1.Truck]),
            (0, common_2.forwardRef)(() => users_module_1.UsersModule),
            (0, common_2.forwardRef)(() => routes_module_1.RoutesModule),
        ],
        providers: [trucks_service_1.TrucksService],
        controllers: [trucks_controller_1.TrucksController],
        exports: [trucks_service_1.TrucksService],
    })
], TrucksModule);
//# sourceMappingURL=trucks.module.js.map