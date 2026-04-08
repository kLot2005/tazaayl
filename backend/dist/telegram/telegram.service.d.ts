import { Telegraf } from 'telegraf';
import { Repository } from 'typeorm';
import { TelegramSubscriber } from './subscriber.entity';
export declare class TelegramService {
    private bot;
    private subscriberRepository;
    constructor(bot: Telegraf<any>, subscriberRepository: Repository<TelegramSubscriber>);
    notifyZoneSubscribers(zoneId: number, message: string): Promise<void>;
}
