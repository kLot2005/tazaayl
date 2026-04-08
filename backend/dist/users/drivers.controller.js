"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriversController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const user_entity_1 = require("./user.entity");
const bcrypt = __importStar(require("bcrypt"));
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const routes_service_1 = require("../routes/routes.service");
let DriversController = class DriversController {
    usersService;
    routesService;
    constructor(usersService, routesService) {
        this.usersService = usersService;
        this.routesService = routesService;
    }
    async createDriver(body) {
        const hashedPassword = await bcrypt.hash(body.password, 10);
        const user = await this.usersService.create({
            username: body.username,
            password: hashedPassword,
            role: user_entity_1.UserRole.DRIVER,
            truck: body.truckId ? { id: body.truckId } : null,
        });
        if (body.truckId && body.zoneIds && body.zoneIds.length > 0) {
            const today = new Date().toISOString().split('T')[0];
            await this.routesService.create({
                date: today,
                truckId: body.truckId,
                zoneIds: body.zoneIds,
            });
        }
        return user;
    }
    async findAll() {
        const drivers = await this.usersService.findAllDrivers();
        const driversWithZones = await Promise.all(drivers.map(async (driver) => {
            if (driver.truck) {
                const route = await this.routesService.findCurrentRouteForTruck(driver.truck.id);
                return { ...driver, zones: route ? route.zones : [] };
            }
            return { ...driver, zones: [] };
        }));
        return driversWithZones;
    }
    async remove(id) {
        return this.usersService.remove(+id);
    }
    async updateDriver(id, body) {
        const updateData = {
            username: body.username,
            truck: body.truckId ? { id: body.truckId } : null,
        };
        if (body.password && body.password.trim() !== '') {
            updateData.password = await bcrypt.hash(body.password, 10);
        }
        const user = await this.usersService.update(+id, updateData);
        if (body.truckId && body.zoneIds && body.zoneIds.length > 0) {
            const today = new Date().toISOString().split('T')[0];
            await this.routesService.removeByTruckAndDate(body.truckId, today);
            await this.routesService.create({
                date: today,
                truckId: body.truckId,
                zoneIds: body.zoneIds,
            });
        }
        return user;
    }
};
exports.DriversController = DriversController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DriversController.prototype, "createDriver", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DriversController.prototype, "findAll", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DriversController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DriversController.prototype, "updateDriver", null);
exports.DriversController = DriversController = __decorate([
    (0, common_1.Controller)('drivers'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        routes_service_1.RoutesService])
], DriversController);
//# sourceMappingURL=drivers.controller.js.map