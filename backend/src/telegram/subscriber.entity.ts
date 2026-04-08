import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index } from 'typeorm';
import { StreetZone } from '../entities/street-zone.entity';

@Entity('telegram_subscribers')
export class TelegramSubscriber {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'bigint', unique: true })
    chatId: number;

    @ManyToOne(() => StreetZone, { onDelete: 'CASCADE' })
    @Index()
    zone: StreetZone;

    @Column({ default: true })
    isActive: boolean;
}
