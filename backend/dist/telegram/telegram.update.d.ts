import { Scenes } from 'telegraf';
import { Repository } from 'typeorm';
import { TelegramSubscriber } from './subscriber.entity';
import { StreetZonesService } from '../street-zones/street-zones.service';
export declare class TelegramUpdate {
    private subscriberRepository;
    private streetZonesService;
    constructor(subscriberRepository: Repository<TelegramSubscriber>, streetZonesService: StreetZonesService);
    onStart(ctx: Scenes.SceneContext): Promise<void>;
    onAction(ctx: any): Promise<void>;
    sendNotificationToZone(zoneId: number, message: string): Promise<void>;
}
