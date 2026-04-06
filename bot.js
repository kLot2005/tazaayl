const { Telegraf, Scenes, session, Markup } = require('telegraf');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const token = '8406781926:AAGyL_yjQRkxLiBoVpZ330g3itXtW86Cfrw';
const bot = new Telegraf(token);
const cancelMenu = Markup.keyboard([['❌ Отмена']]).resize();
let db;
(async () => {
    db = await open({
        filename: './database.sqlite',
        driver: sqlite3.Database
    });
    // Обновленная таблица с координатами
    await db.exec(`
        CREATE TABLE IF NOT EXISTS residents (
            chat_id INTEGER PRIMARY KEY,
            address TEXT,
            latitude REAL,
            longitude REAL
        )
    `);
})();

const registrationWizard = new Scenes.WizardScene(
    'registration_wizard',
    // --- Шаг 1: Запрос адреса ---
    (ctx) => {
        ctx.reply('Введите ваш адрес (улица и дом) или нажмите кнопку отмены:', cancelMenu);
        return ctx.wizard.next();
    },
    // --- Шаг 2: Запрос координат ---
    async (ctx) => {
        const userInput = ctx.message.text;

        // ПРОВЕРКА НА ОТМЕНУ
        if (userInput === '❌ Отмена') {
            await ctx.reply('Регистрация отменена.', Markup.removeKeyboard());
            return ctx.scene.leave();
        }

        // Валидация команды /start или короткого адреса
        if (userInput.startsWith('/') || userInput.length < 3) {
            return ctx.reply('Пожалуйста, введите корректный адрес текстом или нажмите "❌ Отмена":');
        }

        ctx.scene.state.address = userInput;
        
        // Показываем две кнопки: Локация и Отмена
        await ctx.reply(
            `Ваш адрес: ${userInput}. Теперь отправьте местоположение:`,
            Markup.keyboard([
                [Markup.button.locationRequest('📍 Отправить местоположение')],
                ['❌ Отмена']
            ]).resize()
        );
        return ctx.wizard.next();
    },
    // --- Шаг 3: Финальное сохранение ---
    async (ctx) => {
        // Проверка на отмену (если нажали кнопку вместо отправки локации)
        if (ctx.message.text === '❌ Отмена') {
            await ctx.reply('Регистрация прервана.', Markup.removeKeyboard());
            return ctx.scene.leave();
        }

        if (!ctx.message.location) {
            return ctx.reply('Пожалуйста, отправьте местоположение или нажмите "❌ Отмена".');
        }

        const { latitude, longitude } = ctx.message.location;
        const address = ctx.scene.state.address;

        try {
            await db.run(
                'INSERT OR REPLACE INTO residents (chat_id, address, latitude, longitude) VALUES (?, ?, ?, ?)',
                [ctx.chat.id, address, latitude, longitude]
            );
            await ctx.reply(`Данные сохранены!`, Markup.removeKeyboard());
        } catch (e) {
            ctx.reply('Ошибка БД.');
        }
        return ctx.scene.leave();
    }
);

const stage = new Scenes.Stage([registrationWizard]);
bot.use(session());
bot.use(stage.middleware());

// Команда для начала или ПЕРЕЗАПИСИ данных
bot.start((ctx) => ctx.scene.enter('registration_wizard'));
bot.command('update', (ctx) => ctx.scene.enter('registration_wizard'));

bot.command('status', async (ctx) => {
    const user = await db.get('SELECT * FROM residents WHERE chat_id = ?', [ctx.chat.id]);
    if (user) {
        ctx.reply(`Ваш текущий адрес: ${user.address}\nКоординаты: ${user.latitude}, ${user.longitude}\nЕсли хотите изменить — введите /update`);
    } else {
        ctx.reply('Вы еще не зарегистрированы. Введите /start');
    }
});

bot.command('help', (ctx) => {
    ctx.reply(
        '🚛 **Как работает этот бот:**\n\n' +
        '1. Вы регистрируете свой адрес и точное положение дома.\n' +
        '2. Когда мусоровоз будет проезжать рядом с вами (в радиусе 300-500м), я пришлю вам уведомление.\n' +
        '3. Вы успеете вынести мусор вовремя!\n\n' +
        'Если вы переехали или ошиблись — просто введите /update.'
    );
});

bot.telegram.setMyCommands([
    { command: 'start', description: 'Регистрация в системе' },
    { command: 'update', description: 'Изменить адрес или координаты' },
    { command: 'status', description: 'Проверить мои данные' },
    { command: 'help', description: 'Как это работает?' }
]);

bot.launch().then(() => console.log('Бот запущен! Команды: /start или /update для перезаписи.'));