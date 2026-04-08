import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsers1680789001000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "user_role_enum" AS ENUM('admin', 'driver')
        `);
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" SERIAL PRIMARY KEY,
                "username" varchar UNIQUE NOT NULL,
                "password" varchar NOT NULL,
                "role" "user_role_enum" DEFAULT 'driver'
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "user_role_enum"`);
    }
}
