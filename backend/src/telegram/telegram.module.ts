import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegramSubscriber } from './subscriber.entity';
import { TelegramUpdate } from './telegram.update';
import { TelegramService } from './telegram.service';
import { StreetZonesModule } from '../street-zones/street-zones.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([TelegramSubscriber]),
        StreetZonesModule,
        TelegrafModule.forRoot({
            token: 'YOUR_BOT_TOKEN',
            launchOptions: false,
        }),
    ],
    providers: [TelegramUpdate, TelegramService],
    exports: [TelegramService],
})
export class TelegramModule { }
