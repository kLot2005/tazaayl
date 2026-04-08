"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddTruckToUsers1680789003000 = void 0;
class AddTruckToUsers1680789003000 {
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "users" ADD COLUMN "truckId" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "users" ADD CONSTRAINT "FK_users_trucks" FOREIGN KEY ("truckId") REFERENCES "trucks"("id")
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_users_trucks"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "truckId"`);
    }
}
exports.AddTruckToUsers1680789003000 = AddTruckToUsers1680789003000;
//# sourceMappingURL=1680789003000-AddTruckToUsers.js.map