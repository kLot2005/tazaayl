import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShiftsService } from './shifts.service';
import { ShiftsController } from './shifts.controller';
import { Shift } from './shift.entity';
import { User } from '../users/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Shift, User])],
    providers: [ShiftsService],
    controllers: [ShiftsController],
    exports: [ShiftsService],
})
export class ShiftsModule { }
