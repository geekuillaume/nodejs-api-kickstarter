import {MigrationInterface, QueryRunner} from "typeorm";

export class indexes1553683309829 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const q = queryRunner.query.bind(queryRunner);

    await q(`ALTER TABLE "api_public"."subscription_plan" ADD CONSTRAINT "UQ_8ba0f99a8234fdae14be5dd6529" UNIQUE ("name")`);
    await q(`ALTER TABLE "api_public"."subscription_plan" ADD CONSTRAINT "UQ_59e4a749174a3b5d5c3681119d2" UNIQUE ("stripePlanId")`);
    await q(`CREATE INDEX "IDX_07d759a483754ff1e72e3c13dd" ON "api_public"."team_subscription" ("teamId") `);
    await q(`CREATE INDEX "IDX_8460f7edfdbbd1389ef1e32752" ON "api_public"."membership" ("userId") `);
    await q(`CREATE INDEX "IDX_2c6836c832b485175cc7cf0ed0" ON "api_public"."membership" ("teamId") `);
    await q(`CREATE UNIQUE INDEX "IDX_a85ac30ebc8d526bb3b0b7429a" ON "api_public"."membership" ("userId", "teamId") `);
    await q(`CREATE UNIQUE INDEX "IDX_bc1d0aee69b4c0ffeeb75dc833" ON "api_private"."auth_method" ("userId", "type") `);
    await q(`CREATE INDEX "IDX_cf0917c67ffe457ca6ffc8d7a2" ON "api_public"."todo" ("creatorId") `);
    await q(`CREATE INDEX "IDX_6091679877f5fa14ecd080a4d8" ON "api_public"."team_subscription" ("subscriptionPlanId") `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const q = queryRunner.query.bind(queryRunner);

    await q(`DROP INDEX "api_public"."IDX_6091679877f5fa14ecd080a4d8"`);
    await q(`DROP INDEX "api_public"."IDX_cf0917c67ffe457ca6ffc8d7a2"`);
    await q(`DROP INDEX "api_private"."IDX_bc1d0aee69b4c0ffeeb75dc833"`);
    await q(`DROP INDEX "api_public"."IDX_a85ac30ebc8d526bb3b0b7429a"`);
    await q(`DROP INDEX "api_public"."IDX_2c6836c832b485175cc7cf0ed0"`);
    await q(`DROP INDEX "api_public"."IDX_8460f7edfdbbd1389ef1e32752"`);
    await q(`DROP INDEX "api_public"."IDX_07d759a483754ff1e72e3c13dd"`);
    await q(`ALTER TABLE "api_public"."subscription_plan" DROP CONSTRAINT "UQ_59e4a749174a3b5d5c3681119d2"`);
    await q(`ALTER TABLE "api_public"."subscription_plan" DROP CONSTRAINT "UQ_8ba0f99a8234fdae14be5dd6529"`);
  }
}
