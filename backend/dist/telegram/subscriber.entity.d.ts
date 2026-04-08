import { StreetZone } from '../entities/street-zone.entity';
export declare class TelegramSubscriber {
    id: number;
    chatId: number;
    zone: StreetZone;
    isActive: boolean;
}
