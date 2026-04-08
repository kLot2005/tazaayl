import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateGpsPoints1680789005000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "gps_points" (
                "id" SERIAL PRIMARY KEY,
                "location" geometry(Point, 4326) NOT NULL,
                "timestamp" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                "truckId" integer
            )
        `);

        await queryRunner.query(`
            ALTER TABLE "gps_points" ADD CONSTRAINT "FK_gps_points_trucks" FOREIGN KEY ("truckId") REFERENCES "trucks"("id")
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_gps_points_truckId" ON "gps_points" ("truckId")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "gps_points"`);
    }
}
