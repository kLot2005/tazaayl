"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateGpsPoints1680789005000 = void 0;
class CreateGpsPoints1680789005000 {
    async up(queryRunner) {
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
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "gps_points"`);
    }
}
exports.CreateGpsPoints1680789005000 = CreateGpsPoints1680789005000;
//# sourceMappingURL=1680789005000-CreateGpsPoints.js.map