import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRoutes1680789004000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "routes" (
                "id" SERIAL PRIMARY KEY,
                "date" date NOT NULL,
                "truckId" integer
            )
        `);

        await queryRunner.query(`
            ALTER TABLE "routes" ADD CONSTRAINT "FK_routes_trucks" FOREIGN KEY ("truckId") REFERENCES "trucks"("id")
        `);

        await queryRunner.query(`
            CREATE TABLE "route_zones" (
                "routesId" integer NOT NULL,
                "streetZonesId" integer NOT NULL,
                PRIMARY KEY ("routesId", "streetZonesId")
            )
        `);

        await queryRunner.query(`
            ALTER TABLE "route_zones" ADD CONSTRAINT "FK_route_zones_routes" FOREIGN KEY ("routesId") REFERENCES "routes"("id") ON DELETE CASCADE
        `);

        await queryRunner.query(`
            ALTER TABLE "route_zones" ADD CONSTRAINT "FK_route_zones_zones" FOREIGN KEY ("streetZonesId") REFERENCES "street_zones"("id") ON DELETE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "route_zones"`);
        await queryRunner.query(`DROP TABLE "routes"`);
    }
}
