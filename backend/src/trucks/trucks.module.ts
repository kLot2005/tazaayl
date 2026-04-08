import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrucksService } from './trucks.service';
import { TrucksController } from './trucks.controller';
import { Truck } from './truck.entity';

import { UsersModule } from '../users/users.module';
import { RoutesModule } from '../routes/routes.module';
import { forwardRef } from '@nestjs/common';

@Module({
    imports: [
        TypeOrmModule.forFeature([Truck]),
        forwardRef(() => UsersModule),
        forwardRef(() => RoutesModule),
    ],
    providers: [TrucksService],
    controllers: [TrucksController],
    exports: [TrucksService],
})
export class TrucksModule { }
