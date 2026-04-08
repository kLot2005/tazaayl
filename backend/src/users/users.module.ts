import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { DriversController } from './drivers.controller';
import { RoutesModule } from '../routes/routes.module';
import { forwardRef } from '@nestjs/common';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        forwardRef(() => RoutesModule),
    ],
    providers: [UsersService],
    controllers: [DriversController],
    exports: [UsersService],
})
export class UsersModule { }
