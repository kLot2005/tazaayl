import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTruckToUsers1680789003000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" ADD COLUMN "truckId" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "users" ADD CONSTRAINT "FK_users_trucks" FOREIGN KEY ("truckId") REFERENCES "trucks"("id")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_users_trucks"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "truckId"`);
    }
}
