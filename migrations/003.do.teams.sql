CREATE TABLE "api_public"."team" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "name" character varying NOT NULL,
  "ownerId" uuid NOT NULL,
  CONSTRAINT "PK_team_id" PRIMARY KEY ("id"));
CREATE TABLE "api_public"."membership" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "invitedById" uuid NOT NULL DEFAULT api_public.current_user_id(),
  "userId" uuid NOT NULL,
  "teamId" uuid NOT NULL,
  CONSTRAINT "PK_membership_id" PRIMARY KEY ("id"));

ALTER TABLE "api_public"."team"
  ADD CONSTRAINT "FK_team_ownerId" FOREIGN KEY ("ownerId")
  REFERENCES "api_public"."users"("id")
  ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "api_public"."membership"
  ADD CONSTRAINT "FK_membership_userId" FOREIGN KEY ("userId")
  REFERENCES "api_public"."users"("id")
  ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "api_public"."membership"
  ADD CONSTRAINT "FK_membership_teamId" FOREIGN KEY ("teamId")
  REFERENCES "api_public"."team"("id")
  ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "api_public"."membership"
  ADD CONSTRAINT "FK_membership_invitedById" FOREIGN KEY ("invitedById")
  REFERENCES "api_public"."users"("id")
  ON DELETE NO ACTION ON UPDATE NO ACTION;


CREATE INDEX "IDX_membership_userId" ON "api_public"."membership" ("userId");
CREATE INDEX "IDX_membership_teamId" ON "api_public"."membership" ("teamId");
CREATE UNIQUE INDEX "IDX_membership_userId_teamId" ON "api_public"."membership" ("userId", "teamId");
CREATE UNIQUE INDEX "IDX_auth_method_userId_type" ON "api_private"."auth_method" ("userId", "type");
CREATE INDEX "IDX_team_ownerId" ON "api_public"."team" ("ownerId");
CREATE INDEX "IDX_membership_invitedById" ON "api_public"."membership" ("invitedById");


CREATE FUNCTION api_public.current_user_teams_id() RETURNS uuid[] AS $$
  SELECT array_agg("membership"."teamId") from "api_public"."membership"
    WHERE "membership"."userId" = api_public.current_user_id()
$$ LANGUAGE sql stable security definer;
COMMENT ON FUNCTION api_public.current_user_teams_id() is E'@omit execute';


ALTER TABLE "api_public"."membership" enable row level security;
CREATE POLICY "select_membership"
  on "api_public"."membership"
  for select
  to "api_connected_user"
    using ("membership"."teamId" = any(api_public.current_user_teams_id()));
grant select
  on table api_public.membership to postgraphile, api_connected_user;
CREATE POLICY "delete_membership"
  on "api_public"."membership"
  for delete
  to "api_connected_user"
    using ((
      SELECT "team"."ownerId" FROM "api_public"."team" WHERE "team"."id" = "membership"."teamId"
    ) = api_public.current_user_id() AND "membership"."userId" <> api_public.current_user_id());
grant delete
  on table api_public.membership to postgraphile, api_connected_user;


CREATE FUNCTION api_public.user_id_of_members_of_current_user_teams() RETURNS uuid[] AS $$
  SELECT array_agg("membership"."userId") from "api_public"."membership"
    WHERE "membership"."teamId" = any(api_public.current_user_teams_id())
$$ LANGUAGE sql stable;
COMMENT ON FUNCTION api_public.user_id_of_members_of_current_user_teams() is E'@omit execute';

CREATE POLICY "select_users_of_same_team"
  on "api_public"."users"
  for select
  to "api_connected_user"
    using ("users"."id" = any(api_public.user_id_of_members_of_current_user_teams()));

ALTER TABLE "api_public"."team" enable row level security;
CREATE POLICY "select_team"
  on "api_public"."team"
  for select
  to "api_connected_user"
    using ("team"."id" = any(api_public.current_user_teams_id()));
grant select
  on table api_public.team to postgraphile, api_connected_user;
-- Allow name modification of team only to owner
CREATE POLICY "update_team"
  on "api_public"."team"
  for update
  to "api_connected_user"
    using ("team"."ownerId" = api_public.current_user_id())
    with check ("team"."ownerId" = api_public.current_user_id());
grant update(name)
  on table api_public.team to postgraphile, api_connected_user;
