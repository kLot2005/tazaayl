import { MigrationInterface, QueryRunner } from "typeorm";

export class PostgisInit1680789000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Enable PostGIS extension
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS postgis`);

        // Create street_zones table
        await queryRunner.query(`
            CREATE TABLE "street_zones" (
                "id" SERIAL PRIMARY KEY,
                "boundary" geometry(Polygon, 4326)
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "street_zones"`);
        // We usually don't drop the extension in down migration if other things might use it
    }
}
