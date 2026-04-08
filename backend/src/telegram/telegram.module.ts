import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegramSubscriber } from './subscriber.entity';
import { TelegramUpdate } from './telegram.update';
import { TelegramService } from './telegram.service';
import { StreetZonesModule } from '../street-zones/street-zones.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        TypeOrmModule.forFeature([TelegramSubscriber]),
        StreetZonesModule,
        TelegrafModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => {
                const token = configService.get<string>('TELEGRAM_BOT_TOKEN');
                console.log(`[TelegramModule] Initializing bot. Token present: ${!!token} (Prefix: ${token?.substring(0, 5)}...)`);
                return {
                    token: token || 'NO_TOKEN',
                };
            },
            inject: [ConfigService],
        }),
    ],
    providers: [TelegramUpdate, TelegramService],
    exports: [TelegramService],
})
export class TelegramModule { }
