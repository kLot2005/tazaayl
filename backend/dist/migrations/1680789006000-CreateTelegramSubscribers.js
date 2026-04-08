"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTelegramSubscribers1680789006000 = void 0;
class CreateTelegramSubscribers1680789006000 {
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "telegram_subscribers" (
                "id" SERIAL PRIMARY KEY,
                "chatId" bigint UNIQUE NOT NULL,
                "isActive" boolean DEFAULT true,
                "zoneId" integer
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "telegram_subscribers" ADD CONSTRAINT "FK_telegram_subscribers_zones" FOREIGN KEY ("zoneId") REFERENCES "street_zones"("id")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_telegram_subscribers_zoneId" ON "telegram_subscribers" ("zoneId")
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "telegram_subscribers"`);
    }
}
exports.CreateTelegramSubscribers1680789006000 = CreateTelegramSubscribers1680789006000;
//# sourceMappingURL=1680789006000-CreateTelegramSubscribers.js.map