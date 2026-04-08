import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTrucks1680789002000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "truck_status_enum" AS ENUM('active', 'maintenance', 'inactive')
        `);
        await queryRunner.query(`
            CREATE TABLE "trucks" (
                "id" SERIAL PRIMARY KEY,
                "plateNumber" varchar UNIQUE NOT NULL,
                "model" varchar,
                "status" "truck_status_enum" DEFAULT 'active',
                "capacity" integer
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "trucks"`);
        await queryRunner.query(`DROP TYPE "truck_status_enum"`);
    }
}
