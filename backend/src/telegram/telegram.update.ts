import { Update, Start, Ctx, On, Message } from 'nestjs-telegraf';
import { Scenes, Telegraf } from 'telegraf';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TelegramSubscriber } from './subscriber.entity';
import { StreetZonesService } from '../street-zones/street-zones.service';

@Update()
export class TelegramUpdate {
    constructor(
        @InjectRepository(TelegramSubscriber)
        private subscriberRepository: Repository<TelegramSubscriber>,
        private streetZonesService: StreetZonesService,
    ) { }

    @Start()
    async onStart(@Ctx() ctx: Scenes.SceneContext) {
        const zones = await this.streetZonesService.findAll();
        const keyboard = zones.map(z => [{ text: `Подписаться на: ${z.id}`, callback_data: `subscribe_${z.id}` }]);

        await ctx.reply('Добро пожаловать в Tazaayl! Выберите ID зоны вашей улицы для подписки на уведомления о мусоровозе:', {
            reply_markup: {
                inline_keyboard: keyboard,
            },
        });
    }

    @On('callback_query')
    async onAction(@Ctx() ctx: any) {
        const data = ctx.update.callback_query.data;
        if (data.startsWith('subscribe_')) {
            const zoneId = parseInt(data.split('_')[1]);
            const chatId = ctx.update.callback_query.message.chat.id;

            let subscriber = await this.subscriberRepository.findOneBy({ chatId });
            if (subscriber) {
                subscriber.zone = { id: zoneId } as any;
            } else {
                subscriber = this.subscriberRepository.create({ chatId, zone: { id: zoneId } as any });
            }

            await this.subscriberRepository.save(subscriber);
            await ctx.answerCbQuery('Вы успешно подписались!');
            await ctx.reply(`Вы подписаны на уведомления для зоны #${zoneId}. Мы сообщим, когда мусоровоз будет рядом!`);
        }
    }

    async sendNotificationToZone(zoneId: number, message: string) {
        const subscribers = await this.subscriberRepository.find({
            where: { zone: { id: zoneId }, isActive: true },
        });

        // В реальном приложении здесь нужен инжект Telegraf для рассылки
        // Но так как Telegraf инжектится через модуль, мы добавим метод в сервис
    }
}
