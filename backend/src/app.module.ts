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
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'tazaayl',
        autoLoadEntities: true,
        synchronize: true,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        ssl: (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('internal'))
          ? { rejectUnauthorized: false }
          : false,
      }),
      dataSourceFactory: async (options) => {
        if (!options) throw new Error('Invalid options passed to TypeORM');
        const { DataSource } = await import('typeorm');
        const dataSource = new DataSource(options);
        await dataSource.initialize();
        await dataSource.query('CREATE EXTENSION IF NOT EXISTS postgis;');
        return dataSource;
      },
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
