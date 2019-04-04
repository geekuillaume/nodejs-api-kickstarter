import {MigrationInterface, QueryRunner} from "typeorm";

export class teamsAndSubscriptions1553614780383 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    const q = queryRunner.query.bind(queryRunner);

    await q(`CREATE EXTENSION btree_gist`)
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
      CONSTRAINT "PK_subscription_plan_id" PRIMARY KEY ("id"))`);
    await q(`CREATE TABLE "api_public"."team_subscription" (
      "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
      "startDate" TIMESTAMPTZ NOT NULL,
      "endDate" TIMESTAMPTZ NOT NULL,
      "teamId" uuid,
      "subscriptionPlanId" uuid,
      ${'' /* We add a constraint to prevent overlaping two subscriptions for the same team at the same time */}
      CHECK ("startDate" < "endDate"),
      CONSTRAINT "PK_team_subscription_id" PRIMARY KEY ("id"),
      CONSTRAINT "team_subscription_no_overlap" EXCLUDE USING GIST (
        "teamId" WITH =,
        TSTZRANGE("startDate", "endDate") WITH &&
      )
    )`);
    await q(`CREATE TABLE "api_public"."team" (
      "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
      "name" character varying NOT NULL,
      "ownerId" uuid,
      CONSTRAINT "PK_team_id" PRIMARY KEY ("id"))`);
    await q(`CREATE TABLE "api_public"."membership" (
      "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      "invitedById" uuid NOT NULL DEFAULT api_public.current_user_id(),
      "userId" uuid,
      "teamId" uuid,
      CONSTRAINT "PK_membership_id" PRIMARY KEY ("id"))`);

    // Relations between all newly created tables
    await q(`ALTER TABLE "api_public"."team_subscription"
      ADD CONSTRAINT "FK_team_subscription_teamId" FOREIGN KEY ("teamId")
      REFERENCES "api_public"."team"("id")
      ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await q(`ALTER TABLE "api_public"."team_subscription"
      ADD CONSTRAINT "FK_team_subscription_subscriptionPlanId" FOREIGN KEY ("subscriptionPlanId")
      REFERENCES "api_public"."subscription_plan"("id")
      ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await q(`ALTER TABLE "api_public"."team"
      ADD CONSTRAINT "FK_team_ownerId" FOREIGN KEY ("ownerId")
      REFERENCES "api_public"."users"("id")
      ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await q(`ALTER TABLE "api_public"."membership"
      ADD CONSTRAINT "FK_membership_userId" FOREIGN KEY ("userId")
      REFERENCES "api_public"."users"("id")
      ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await q(`ALTER TABLE "api_public"."membership"
      ADD CONSTRAINT "FK_membership_teamId" FOREIGN KEY ("teamId")
      REFERENCES "api_public"."team"("id")
      ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await q(`ALTER TABLE "api_public"."membership"
      ADD CONSTRAINT "FK_membership_invitedById" FOREIGN KEY ("invitedById")
      REFERENCES "api_public"."users"("id")
      ON DELETE NO ACTION ON UPDATE NO ACTION`);

    await q(`CREATE FUNCTION api_public.current_user_teams_id() RETURNS uuid[] AS $$
      SELECT array_agg("membership"."teamId") from "api_public"."membership"
        WHERE "membership"."userId" = api_public.current_user_id()
    $$ LANGUAGE sql stable security definer`)
    await q(`COMMENT ON FUNCTION api_public.current_user_teams_id() is E'@omit execute'`)


    await q(`ALTER TABLE "api_public"."membership" enable row level security`);
    await q(`CREATE POLICY "select_membership"
      on "api_public"."membership"
      for select
      to "api_connected_user"
        using ("membership"."teamId" = any(api_public.current_user_teams_id()))`);
    await q(`grant select
      on table api_public.membership to postgraphile, api_connected_user`)
    await q(`CREATE POLICY "delete_membership"
      on "api_public"."membership"
      for delete
      to "api_connected_user"
        using ((
          SELECT "team"."ownerId" FROM "api_public"."team" WHERE "team"."id" = "membership"."teamId"
        ) = api_public.current_user_id() AND "membership"."userId" <> api_public.current_user_id())`);
    await q(`grant delete
      on table api_public.membership to postgraphile, api_connected_user`)


    await q(`CREATE FUNCTION api_public.user_id_of_members_of_current_user_teams() RETURNS uuid[] AS $$
      SELECT array_agg("membership"."userId") from "api_public"."membership"
        WHERE "membership"."teamId" = any(api_public.current_user_teams_id())
    $$ LANGUAGE sql stable`)
    await q(`COMMENT ON FUNCTION api_public.user_id_of_members_of_current_user_teams() is E'@omit execute'`)

    await q(`CREATE POLICY "select_users_of_same_team"
      on "api_public"."users"
      for select
      to "api_connected_user"
        using ("users"."id" = any(api_public.user_id_of_members_of_current_user_teams()))`)

    await q(`ALTER TABLE "api_public"."team" enable row level security`);
    await q(`CREATE POLICY "select_team"
      on "api_public"."team"
      for select
      to "api_connected_user"
        using ("team"."id" = any(api_public.current_user_teams_id()))`);
    await q(`grant select
      on table api_public.team to postgraphile, api_connected_user`)
    // Allow name modification of team only to owner
    await q(`CREATE POLICY "update_team"
      on "api_public"."team"
      for update
      to "api_connected_user"
        using ("team"."ownerId" = api_public.current_user_id())
        with check ("team"."ownerId" = api_public.current_user_id())`);
    await q(`grant update(name)
      on table api_public.team to postgraphile, api_connected_user`)


    await q(`ALTER TABLE "api_public"."team_subscription" enable row level security`);
    await q(`CREATE POLICY "select_team_subscription"
      on "api_public"."team_subscription"
      for select
      to "api_connected_user"
        using ("team_subscription"."teamId" = any(api_public.current_user_teams_id()))`);
    await q(`grant select
      on table api_public.team_subscription to postgraphile, api_connected_user`)

    await q(`CREATE FUNCTION api_public.team_current_subscription(team api_public.team) RETURNS api_public.team_subscription AS $$
      SELECT * from "api_public"."team_subscription"
        WHERE "team_subscription"."teamId" = team.id
          AND
          "team_subscription"."startDate" < now()
          AND
          "team_subscription"."endDate" > now()
        LIMIT 1
    $$ LANGUAGE sql stable`)
    await q(`grant execute
      on function api_public.team_current_subscription(api_public.team)
      to postgraphile, api_connected_user`)

    // User can select any public subscription or
    // any private subscription he was subscribed to before or now
    await q(`CREATE FUNCTION api_public.all_subscription_plans_id() RETURNS uuid[] AS $$
      SELECT array_agg("team_subscription"."subscriptionPlanId") from "api_public"."team_subscription"
    $$ LANGUAGE sql stable`)
    await q(`COMMENT ON FUNCTION api_public.all_subscription_plans_id() is E'@omit execute'`)

    await q(`ALTER TABLE "api_public"."subscription_plan" enable row level security`);
    await q(`CREATE POLICY "select_subscription_plan"
      on "api_public"."subscription_plan"
      for select
      to "api_connected_user"
        using (
          "subscription_plan"."public" = true
          OR
          "subscription_plan"."id" = any(api_public.all_subscription_plans_id())
        )`);
    await q(`grant select
      on table api_public.subscription_plan to postgraphile, api_connected_user`)

    // TODO: add invite route by email
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const q = queryRunner.query.bind(queryRunner);

    await q(`ALTER TABLE "api_public"."membership" DROP CONSTRAINT "FK_membership_userId"`);
    await q(`ALTER TABLE "api_public"."membership" DROP CONSTRAINT "FK_membership_teamId"`);
    await q(`ALTER TABLE "api_public"."membership" DROP CONSTRAINT "FK_membership_invitedById"`);
    await q(`ALTER TABLE "api_public"."team" DROP CONSTRAINT "FK_team_ownerId"`);
    await q(`ALTER TABLE "api_public"."team_subscription" DROP CONSTRAINT "FK_team_subscription_teamId"`);
    await q(`ALTER TABLE "api_public"."team_subscription" DROP CONSTRAINT "FK_team_subscription_subscriptionPlanId"`);
    await q(`DROP TABLE "api_public"."membership"`);
    await q(`DROP TABLE "api_public"."team"`);
    await q(`DROP TABLE "api_public"."team_subscription"`);
    await q(`DROP TABLE "api_public"."subscription_plan"`);
    await q(`DROP TYPE "api_public"."subscription_plan_currency_enum"`);
  }

}
