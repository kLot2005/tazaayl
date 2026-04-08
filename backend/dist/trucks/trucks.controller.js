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
exports.TrucksController = void 0;
const common_1 = require("@nestjs/common");
const trucks_service_1 = require("./trucks.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const user_entity_1 = require("../users/user.entity");
const users_service_1 = require("../users/users.service");
const routes_service_1 = require("../routes/routes.service");
let TrucksController = class TrucksController {
    trucksService;
    usersService;
    routesService;
    constructor(trucksService, usersService, routesService) {
        this.trucksService = trucksService;
        this.usersService = usersService;
        this.routesService = routesService;
    }
    create(truck) {
        return this.trucksService.create(truck);
    }
    async findAll() {
        const trucks = await this.trucksService.findAll();
        const drivers = await this.usersService.findAllDrivers();
        const today = new Date().toISOString().split('T')[0];
        const trucksWithInfo = await Promise.all(trucks.map(async (truck) => {
            const driver = drivers.find(d => d.truck?.id === truck.id);
            const route = await this.routesService.findCurrentRouteForTruck(truck.id);
            return {
                ...truck,
                truckId: truck.id,
                latitude: truck.currentLat,
                longitude: truck.currentLon,
                driver: driver ? { id: driver.id, username: driver.username } : null,
                zones: route ? route.zones : []
            };
        }));
        return trucksWithInfo;
    }
    findOne(id) {
        return this.trucksService.findOne(+id);
    }
    update(id, truck) {
        return this.trucksService.update(+id, truck);
    }
    remove(id) {
        return this.trucksService.remove(+id);
    }
};
exports.TrucksController = TrucksController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TrucksController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TrucksController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TrucksController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TrucksController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TrucksController.prototype, "remove", null);
exports.TrucksController = TrucksController = __decorate([
    (0, common_1.Controller)('trucks'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => users_service_1.UsersService))),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => routes_service_1.RoutesService))),
    __metadata("design:paramtypes", [trucks_service_1.TrucksService,
        users_service_1.UsersService,
        routes_service_1.RoutesService])
], TrucksController);
//# sourceMappingURL=trucks.controller.js.map