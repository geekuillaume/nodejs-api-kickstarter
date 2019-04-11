CREATE EXTENSION btree_gist;

CREATE TYPE "api_public"."subscription_plan_currency_enum"
  AS ENUM('eur', 'usd');

CREATE TABLE "api_public"."subscription_plan" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "name" character varying NOT NULL,
  "currency" "api_public"."subscription_plan_currency_enum" NOT NULL,
  "stripePlanId" character varying,
  "public" boolean NOT NULL,
  "durationInDays" integer NOT NULL,
  "cost" integer NOT NULL,
  CONSTRAINT "PK_subscription_plan_id" PRIMARY KEY ("id"));

CREATE TABLE "api_public"."team_subscription" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "startDate" TIMESTAMPTZ NOT NULL,
  "endDate" TIMESTAMPTZ NOT NULL,
  "teamId" uuid NOT NULL,
  "subscriptionPlanId" uuid NOT NULL,
  -- We add a constraint to prevent overlaping two subscriptions for the same team at the same time
  CHECK ("startDate" < "endDate"),
  CONSTRAINT "PK_team_subscription_id" PRIMARY KEY ("id"),
  CONSTRAINT "team_subscription_no_overlap" EXCLUDE USING GIST (
    "teamId" WITH =,
    TSTZRANGE("startDate", "endDate") WITH &&
  )
);

ALTER TABLE "api_public"."team_subscription"
  ADD CONSTRAINT "FK_team_subscription_teamId" FOREIGN KEY ("teamId")
  REFERENCES "api_public"."team"("id")
  ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "api_public"."team_subscription"
  ADD CONSTRAINT "FK_team_subscription_subscriptionPlanId" FOREIGN KEY ("subscriptionPlanId")
  REFERENCES "api_public"."subscription_plan"("id")
  ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "api_public"."team_subscription" enable row level security;
CREATE POLICY "select_team_subscription"
  on "api_public"."team_subscription"
  for select
  to "api_connected_user"
    using ("team_subscription"."teamId" = any(api_public.current_user_teams_id()));
grant select
  on table api_public.team_subscription to postgraphile, api_connected_user;

CREATE FUNCTION api_public.team_current_subscription(team api_public.team) RETURNS api_public.team_subscription AS $$
  SELECT * from "api_public"."team_subscription"
    WHERE "team_subscription"."teamId" = team.id
      AND
      "team_subscription"."startDate" < now()
      AND
      "team_subscription"."endDate" > now()
    LIMIT 1
$$ LANGUAGE sql stable;
grant execute
  on function api_public.team_current_subscription(api_public.team)
  to postgraphile, api_connected_user;

-- User can select any public subscription or
-- any private subscription he was subscribed to before or now
CREATE FUNCTION api_public.all_subscription_plans_id() RETURNS uuid[] AS $$
  SELECT array_agg("team_subscription"."subscriptionPlanId") from "api_public"."team_subscription"
$$ LANGUAGE sql stable;
COMMENT ON FUNCTION api_public.all_subscription_plans_id() is E'@omit execute';

ALTER TABLE "api_public"."subscription_plan" enable row level security;
CREATE POLICY "select_subscription_plan"
  on "api_public"."subscription_plan"
  for select
  to "api_connected_user"
    using (
      "subscription_plan"."public" = true
      OR
      "subscription_plan"."id" = any(api_public.all_subscription_plans_id())
    );
grant select
  on table api_public.subscription_plan to postgraphile, api_connected_user;

ALTER TABLE "api_public"."subscription_plan" ADD CONSTRAINT "UQ_subscription_plan_name" UNIQUE ("name");
COMMENT ON CONSTRAINT "UQ_subscription_plan_name" on "api_public"."subscription_plan" is E'@omit';

ALTER TABLE "api_public"."subscription_plan" ADD CONSTRAINT "UQ_subscription_plan_stripePlanId" UNIQUE ("stripePlanId");
COMMENT ON CONSTRAINT "UQ_subscription_plan_stripePlanId" on "api_public"."subscription_plan" is E'@omit';

CREATE INDEX "IDX_team_subscription_teamId" ON "api_public"."team_subscription" ("teamId");
CREATE INDEX "IDX_team_subscription_subscriptionPlanId" ON "api_public"."team_subscription" ("subscriptionPlanId");

