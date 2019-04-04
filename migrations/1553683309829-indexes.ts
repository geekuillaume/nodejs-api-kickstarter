import {MigrationInterface, QueryRunner} from "typeorm";

export class indexes1553683309829 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const q = queryRunner.query.bind(queryRunner);

    await q(`ALTER TABLE "api_public"."subscription_plan" ADD CONSTRAINT "UQ_subscription_plan_name" UNIQUE ("name")`);
    await q(`COMMENT ON CONSTRAINT "UQ_subscription_plan_name" on "api_public"."subscription_plan" is E'@omit'`)

    await q(`ALTER TABLE "api_public"."subscription_plan" ADD CONSTRAINT "UQ_subscription_plan_stripePlanId" UNIQUE ("stripePlanId")`);
    await q(`COMMENT ON CONSTRAINT "UQ_subscription_plan_stripePlanId" on "api_public"."subscription_plan" is E'@omit'`)

    await q(`CREATE INDEX "IDX_team_subscription_teamId" ON "api_public"."team_subscription" ("teamId") `);
    await q(`CREATE INDEX "IDX_membership_userId" ON "api_public"."membership" ("userId") `);
    await q(`CREATE INDEX "IDX_membership_teamId" ON "api_public"."membership" ("teamId") `);
    await q(`CREATE UNIQUE INDEX "IDX_membership_userId_teamId" ON "api_public"."membership" ("userId", "teamId") `);
    await q(`CREATE UNIQUE INDEX "IDX_auth_method_userId_type" ON "api_private"."auth_method" ("userId", "type") `);
    await q(`CREATE INDEX "IDX_todo_creatorId" ON "api_public"."todo" ("creatorId") `);
    await q(`CREATE INDEX "IDX_team_subscription_subscriptionPlanId" ON "api_public"."team_subscription" ("subscriptionPlanId") `);
    await q(`CREATE INDEX "IDX_team_ownerId" ON "api_public"."team" ("ownerId") `);
    await q(`CREATE INDEX "IDX_membership_invitedById" ON "api_public"."membership" ("invitedById") `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const q = queryRunner.query.bind(queryRunner);

    await q(`DROP INDEX "api_public"."IDX_membership_invitedById"`);
    await q(`DROP INDEX "api_public"."IDX_team_ownerId"`);
    await q(`DROP INDEX "api_public"."IDX_team_subscription_subscriptionPlanId"`);
    await q(`DROP INDEX "api_public"."IDX_todo_creatorId"`);
    await q(`DROP INDEX "api_private"."IDX_auth_method_userId_type"`);
    await q(`DROP INDEX "api_public"."IDX_membership_userId_teamId"`);
    await q(`DROP INDEX "api_public"."IDX_membership_teamId"`);
    await q(`DROP INDEX "api_public"."IDX_membership_userId"`);
    await q(`DROP INDEX "api_public"."IDX_team_subscription_teamId"`);
    await q(`ALTER TABLE "api_public"."subscription_plan" DROP CONSTRAINT "UQ_subscription_plan_name"`);
    await q(`ALTER TABLE "api_public"."subscription_plan" DROP CONSTRAINT "UQ_subscription_plan_stripePlanId"`);
  }
}
