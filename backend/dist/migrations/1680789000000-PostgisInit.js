"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgisInit1680789000000 = void 0;
class PostgisInit1680789000000 {
    async up(queryRunner) {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS postgis`);
        await queryRunner.query(`
            CREATE TABLE "street_zones" (
                "id" SERIAL PRIMARY KEY,
                "boundary" geometry(Polygon, 4326)
            )
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "street_zones"`);
    }
}
exports.PostgisInit1680789000000 = PostgisInit1680789000000;
//# sourceMappingURL=1680789000000-PostgisInit.js.map