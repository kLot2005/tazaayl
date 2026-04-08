import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TrucksModule } from './trucks/trucks.module';
import { StreetZonesModule } from './street-zones/street-zones.module';
import { RoutesModule } from './routes/routes.module';
import { TrackingModule } from './tracking/tracking.module';
import { TelegramModule } from './telegram/telegram.module';
import { ShiftsModule } from './shifts/shifts.module';

import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5435,
      username: 'user',
      password: 'password',
      database: 'tazaayl',
      autoLoadEntities: true,
      synchronize: true,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
      migrationsRun: true,
    }),
    AuthModule,
    UsersModule,
    TrucksModule,
    StreetZonesModule,
    RoutesModule,
    TrackingModule,
    TelegramModule,
    ShiftsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
