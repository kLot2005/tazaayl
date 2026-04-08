import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoutesService } from './routes.service';
import { RoutesController } from './routes.controller';
import { Route } from './route.entity';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Route]),
        forwardRef(() => UsersModule),
    ],
    providers: [RoutesService],
    controllers: [RoutesController],
    exports: [RoutesService],
})
export class RoutesModule { }
