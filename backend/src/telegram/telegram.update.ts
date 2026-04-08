import { Update, Start, Ctx, On } from 'nestjs-telegraf';
import { Scenes } from 'telegraf';
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
        console.log(`[TelegramBot] Start command from chatId: ${ctx.chat?.id}`);
        await ctx.reply('👋 Добро пожаловать в сервис Tazaayl!\n\nЧтобы получать уведомления о прибытии мусоровоза, пожалуйста, отправьте ваше местоположение (геолокацию).', {
            reply_markup: {
                keyboard: [
                    [{ text: '📍 Отправить местоположение', request_location: true }]
                ],
                resize_keyboard: true,
                one_time_keyboard: true
            },
        });
    }

    @On('location')
    async onLocation(@Ctx() ctx: any) {
        const { latitude, longitude } = ctx.message.location;
        const chatId = ctx.chat.id.toString();
        console.log(`[TelegramBot] Received location from chatId: ${chatId} (${latitude}, ${longitude})`);

        // Ищем зону, в которую входят координаты
        const zone = await this.streetZonesService.findContainingZone(longitude, latitude);

        if (!zone) {
            console.log(`[TelegramBot] Zone NOT FOUND for coordinates of chatId: ${chatId}`);
            return ctx.reply('😔 К сожалению, ваш адрес пока не входит в зону обслуживания системы Tazaayl. Мы работаем над расширением!');
        }

        console.log(`[TelegramBot] Found zone "${zone.name}" for chatId: ${chatId}`);

        // Подписываем пользователя
        let subscriber = await this.subscriberRepository.findOneBy({ chatId });
        if (subscriber) {
            subscriber.zone = zone;
        } else {
            subscriber = this.subscriberRepository.create({
                chatId,
                zone,
                isActive: true
            });
        }

        await this.subscriberRepository.save(subscriber);
        console.log(`[TelegramBot] Subscriber ${chatId} successfully saved/updated for zone ${zone.id}`);

        await ctx.reply(`✅ Готово! Вы успешно подписаны на уведомления для зоны: "${zone.name}".\n\nМы сообщим вам в Telegram, как только мусоровоз выедет на вашу улицу! 🚛`, {
            reply_markup: { remove_keyboard: true }
        });
    }

    @On('text')
    async onText(@Ctx() ctx: any) {
        await ctx.reply('Пожалуйста, используйте кнопку "📍 Отправить местоположение" для настройки уведомлений или введите /start');
    }
}
