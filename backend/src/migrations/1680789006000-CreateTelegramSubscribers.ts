import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTelegramSubscribers1680789006000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
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

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "telegram_subscribers"`);
    }
}
