"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUsers1680789001000 = void 0;
class CreateUsers1680789001000 {
    async up(queryRunner) {
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
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "user_role_enum"`);
    }
}
exports.CreateUsers1680789001000 = CreateUsers1680789001000;
//# sourceMappingURL=1680789001000-CreateUsers.js.map