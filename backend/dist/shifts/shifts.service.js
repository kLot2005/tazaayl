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
exports.ShiftsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const shift_entity_1 = require("./shift.entity");
const user_entity_1 = require("../users/user.entity");
let ShiftsService = class ShiftsService {
    shiftsRepository;
    usersRepository;
    constructor(shiftsRepository, usersRepository) {
        this.shiftsRepository = shiftsRepository;
        this.usersRepository = usersRepository;
    }
    async startShift(userId) {
        const user = await this.usersRepository.findOne({
            where: { id: userId },
            relations: ['truck']
        });
        if (!user || !user.truck) {
            throw new common_1.BadRequestException('Driver must be assigned to a truck to start a shift');
        }
        const activeShift = await this.shiftsRepository.findOne({
            where: { user: { id: userId }, isActive: true }
        });
        if (activeShift) {
            throw new common_1.BadRequestException('Shift already active');
        }
        const shift = this.shiftsRepository.create({
            user,
            truck: user.truck,
            isActive: true,
            startTime: new Date()
        });
        return this.shiftsRepository.save(shift);
    }
    async endShift(userId) {
        const activeShift = await this.shiftsRepository.findOne({
            where: { user: { id: userId }, isActive: true }
        });
        if (!activeShift) {
            throw new common_1.BadRequestException('No active shift found');
        }
        activeShift.isActive = false;
        activeShift.endTime = new Date();
        return this.shiftsRepository.save(activeShift);
    }
    async getActiveShift(userId) {
        return this.shiftsRepository.findOne({
            where: { user: { id: userId }, isActive: true },
            relations: ['truck']
        });
    }
};
exports.ShiftsService = ShiftsService;
exports.ShiftsService = ShiftsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(shift_entity_1.Shift)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ShiftsService);
//# sourceMappingURL=shifts.service.js.map