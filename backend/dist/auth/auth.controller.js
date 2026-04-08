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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const users_service_1 = require("../users/users.service");
const bcrypt = __importStar(require("bcrypt"));
const user_entity_1 = require("../users/user.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const truck_entity_1 = require("../trucks/truck.entity");
const route_entity_1 = require("../routes/route.entity");
const street_zone_entity_1 = require("../entities/street-zone.entity");
let AuthController = class AuthController {
    authService;
    usersService;
    truckRepository;
    routeRepository;
    zoneRepository;
    constructor(authService, usersService, truckRepository, routeRepository, zoneRepository) {
        this.authService = authService;
        this.usersService = usersService;
        this.truckRepository = truckRepository;
        this.routeRepository = routeRepository;
        this.zoneRepository = zoneRepository;
    }
    async login(body) {
        const user = await this.authService.validateUser(body.username, body.password);
        if (!user) {
            throw new common_1.UnauthorizedException();
        }
        return this.authService.login(user);
    }
    async seed() {
        let admin = await this.usersService.findOne('admin');
        if (!admin) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            admin = await this.usersService.create({
                username: 'admin',
                password: hashedPassword,
                role: user_entity_1.UserRole.ADMIN,
            });
        }
        let truck = await this.truckRepository.findOne({ where: { plateNumber: '01 KZ 777' } });
        if (!truck) {
            truck = this.truckRepository.create({
                plateNumber: '01 KZ 777',
                model: 'KamAZ 65115',
                capacity: 15,
                status: truck_entity_1.TruckStatus.ACTIVE
            });
            truck = await this.truckRepository.save(truck);
        }
        let driver = await this.usersService.findOne('driver1');
        if (!driver) {
            const driverPassword = await bcrypt.hash('password', 10);
            driver = await this.usersService.create({
                username: 'driver1',
                password: driverPassword,
                role: user_entity_1.UserRole.DRIVER,
            });
        }
        driver.truck = truck;
        await this.usersService.save(driver);
        const allZones = await this.zoneRepository.find();
        const today = new Date().toISOString().split('T')[0];
        await this.routeRepository.delete({ date: today, truck: { id: truck.id } });
        if (allZones.length > 0) {
            const route = this.routeRepository.create({
                date: today,
                truck: truck,
                zones: allZones
            });
            await this.routeRepository.save(route);
        }
        return {
            message: 'Seed successful',
            admin: 'admin / admin123',
            driver: 'driver1 / password',
            truck: '01 KZ 777 assigned to driver1',
            route: `Route for today created with ${allZones.length} zones`
        };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('seed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "seed", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __param(2, (0, typeorm_1.InjectRepository)(truck_entity_1.Truck)),
    __param(3, (0, typeorm_1.InjectRepository)(route_entity_1.Route)),
    __param(4, (0, typeorm_1.InjectRepository)(street_zone_entity_1.StreetZone)),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        users_service_1.UsersService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AuthController);
//# sourceMappingURL=auth.controller.js.map