import { Controller, Post, Get, UseGuards, Request } from '@nestjs/common';
import { ShiftsService } from './shifts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('shifts')
@UseGuards(JwtAuthGuard)
export class ShiftsController {
    constructor(private shiftsService: ShiftsService) { }

    @Post('start')
    async startShift(@Request() req) {
        return this.shiftsService.startShift(req.user.userId);
    }

    @Post('end')
    async endShift(@Request() req) {
        return this.shiftsService.endShift(req.user.userId);
    }

    @Get('active')
    async getActiveShift(@Request() req) {
        return this.shiftsService.getActiveShift(req.user.userId);
    }
}
