"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTrucks1680789002000 = void 0;
class CreateTrucks1680789002000 {
    async up(queryRunner) {
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
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "trucks"`);
        await queryRunner.query(`DROP TYPE "truck_status_enum"`);
    }
}
exports.CreateTrucks1680789002000 = CreateTrucks1680789002000;
//# sourceMappingURL=1680789002000-CreateTrucks.js.map