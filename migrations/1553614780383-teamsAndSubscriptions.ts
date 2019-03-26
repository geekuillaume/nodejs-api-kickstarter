import {MigrationInterface, QueryRunner} from "typeorm";

export class teamsAndSubscriptions1553614780383 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    const q = queryRunner.query.bind(queryRunner);

    await q(`CREATE TYPE "api_public"."subscription_plan_currency_enum"
      AS ENUM('eur', 'usd')`);
    await q(`CREATE TABLE "api_public"."subscription_plan" (
      "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
      "name" character varying NOT NULL,
      "currency" "api_public"."subscription_plan_currency_enum" NOT NULL,
      "stripePlanId" character varying,
      "public" boolean NOT NULL,
      "durationInDays" integer NOT NULL,
      "cost" integer NOT NULL,
      CONSTRAINT "PK_c83821f2b513f41455a581ed792" PRIMARY KEY ("id"))`);
    await q(`CREATE TABLE "api_public"."team_subscription" (
      "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
      "startDate" TIMESTAMP NOT NULL,
      "endDate" TIMESTAMP NOT NULL,
      "teamId" uuid,
      "subscriptionPlanId" uuid,
      CONSTRAINT "PK_7e3d367ba64ecc1ec273d7559a2" PRIMARY KEY ("id"))`);
    await q(`CREATE TABLE "api_public"."team" (
      "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
      "name" character varying NOT NULL,
      "ownerId" uuid,
      CONSTRAINT "PK_b91229323b1121276a399482d82" PRIMARY KEY ("id"))`);
    await q(`CREATE TABLE "api_public"."membership" (
      "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
      "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
      "invitedById" uuid NOT NULL DEFAULT api_public.current_user_id(),
      "userId" uuid,
      "teamId" uuid,
      CONSTRAINT "PK_b3ae9d967a029e1d6b58ba509c9" PRIMARY KEY ("id"))`);

    // Relations between all newly created tables
    await q(`ALTER TABLE "api_public"."team_subscription" ADD CONSTRAINT "FK_07d759a483754ff1e72e3c13dde" FOREIGN KEY ("teamId") REFERENCES "api_public"."team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await q(`ALTER TABLE "api_public"."team_subscription" ADD CONSTRAINT "FK_6091679877f5fa14ecd080a4d74" FOREIGN KEY ("subscriptionPlanId") REFERENCES "api_public"."subscription_plan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await q(`ALTER TABLE "api_public"."team" ADD CONSTRAINT "FK_5ba5893154f86212635b3e02b73" FOREIGN KEY ("ownerId") REFERENCES "api_public"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await q(`ALTER TABLE "api_public"."membership" ADD CONSTRAINT "FK_8460f7edfdbbd1389ef1e327522" FOREIGN KEY ("userId") REFERENCES "api_public"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await q(`ALTER TABLE "api_public"."membership" ADD CONSTRAINT "FK_2c6836c832b485175cc7cf0ed0f" FOREIGN KEY ("teamId") REFERENCES "api_public"."team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await q(`ALTER TABLE "api_public"."membership" ADD CONSTRAINT "FK_51150ac4151dec51da7bee8629a" FOREIGN KEY ("invitedById") REFERENCES "api_public"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

    await q(`CREATE FUNCTION api_public.current_user_teams_id() RETURNS uuid[] AS $$
      SELECT array_agg("membership"."teamId") from "api_public"."membership"
        WHERE "membership"."userId" = api_public.current_user_id()
    $$ LANGUAGE sql stable`)

    await q(`ALTER TABLE "api_public"."membership" enable row level security`);
    await q(`CREATE POLICY "select_membership"
      on "api_public"."membership"
      for select
      to "api_connected_user"
        using ("membership"."userId" = api_public.current_user_id())`);
    await q(`grant select
      on table api_public.membership to api_connected_user`)

    await q(`ALTER TABLE "api_public"."team" enable row level security`);
    await q(`CREATE POLICY "select_team"
      on "api_public"."team"
      for select
      to "api_connected_user"
        using ("team"."id" = any(api_public.current_user_teams_id()))`);
    await q(`grant select
      on table api_public.team to api_connected_user`)

    await q(`ALTER TABLE "api_public"."team_subscription" enable row level security`);
    await q(`CREATE POLICY "select_team_subscription"
      on "api_public"."team_subscription"
      for select
      to "api_connected_user"
        using ("team_subscription"."teamId" = any(api_public.current_user_teams_id()))`);
    await q(`grant select
      on table api_public.team_subscription to api_connected_user`)

    // TODO: add permissions for subscriptionPlans (public and past private plans)
    // TODO: add permissions for delete memberships
    // TODO: add invite route by email
    // TODO: add constraint for membership(userId, teamId)
    // TODO: add function for current plan query
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const q = queryRunner.query.bind(queryRunner);

    await q(`ALTER TABLE "api_public"."todo" DROP CONSTRAINT "FK_cf0917c67ffe457ca6ffc8d7a26"`);
    await q(`ALTER TABLE "api_public"."membership" DROP CONSTRAINT "FK_51150ac4151dec51da7bee8629a"`);
    await q(`ALTER TABLE "api_public"."membership" DROP CONSTRAINT "FK_2c6836c832b485175cc7cf0ed0f"`);
    await q(`ALTER TABLE "api_public"."membership" DROP CONSTRAINT "FK_8460f7edfdbbd1389ef1e327522"`);
    await q(`ALTER TABLE "api_public"."team" DROP CONSTRAINT "FK_5ba5893154f86212635b3e02b73"`);
    await q(`ALTER TABLE "api_public"."team_subscription" DROP CONSTRAINT "FK_6091679877f5fa14ecd080a4d74"`);
    await q(`ALTER TABLE "api_public"."team_subscription" DROP CONSTRAINT "FK_07d759a483754ff1e72e3c13dde"`);
    await q(`DROP TABLE "api_public"."membership"`);
    await q(`DROP TABLE "api_public"."team"`);
    await q(`DROP TABLE "api_public"."team_subscription"`);
    await q(`DROP TABLE "api_public"."subscription_plan"`);
    await q(`DROP TYPE "api_public"."subscription_plan_currency_enum"`);
  }

}
