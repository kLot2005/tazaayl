import { Injectable } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TelegramSubscriber } from './subscriber.entity';

@Injectable()
export class TelegramService {
    constructor(
        @InjectBot() private bot: Telegraf<any>,
        @InjectRepository(TelegramSubscriber)
        private subscriberRepository: Repository<TelegramSubscriber>,
    ) { }

    async notifyZoneSubscribers(zoneId: number, message: string) {
        const subscribers = await this.subscriberRepository.find({
            where: { zone: { id: zoneId }, isActive: true },
        });

        console.log(`[TelegramService] Found ${subscribers.length} active subscribers for zone ${zoneId}`);

        for (const sub of subscribers) {
            try {
                await this.bot.telegram.sendMessage(sub.chatId.toString(), message);
                console.log(`[TelegramService] Notification sent to chatId: ${sub.chatId}`);
            } catch (e) {
                console.error(`[TelegramService] FAILED to send message to ${sub.chatId}:`, e.message);
            }
        }
    }
}
