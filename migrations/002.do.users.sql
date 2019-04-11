CREATE TABLE "api_public"."users" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "email" character varying NOT NULL,
  "active" boolean NOT NULL DEFAULT false,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "UQ_users_id" UNIQUE ("email"),
  CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
);
CREATE INDEX "IDX_users_email" ON "api_public"."users" ("email") ;
COMMENT ON CONSTRAINT "UQ_users_id" on "api_public"."users" is E'@omit';


CREATE TABLE "api_private"."auth_token" (
  "token" character varying NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "lastUsed" TIMESTAMPTZ NOT NULL,
  "userId" uuid,
  CONSTRAINT "PK_auth_token_token" PRIMARY KEY ("token")
);

CREATE TYPE "api_private"."auth_method_type_enum" AS ENUM('email');
CREATE TABLE "api_private"."auth_method" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "type" "api_private"."auth_method_type_enum" NOT NULL DEFAULT 'email',
  "email" character varying NOT NULL,
  "hashedPassword" character varying NOT NULL,
  "active" boolean NOT NULL DEFAULT false,
  "userId" uuid NOT NULL,
  CONSTRAINT "UQ_auth_method_email" UNIQUE ("email"),
  CONSTRAINT "PK_auth_method_id" PRIMARY KEY ("id")
);

ALTER TABLE "api_private"."auth_token"
  ADD CONSTRAINT "FK_auth_token_userId" FOREIGN KEY ("userId")
  REFERENCES "api_public"."users"("id");
ALTER TABLE "api_private"."auth_method"
  ADD CONSTRAINT "FK_auth_method_userId" FOREIGN KEY ("userId")
  REFERENCES "api_public"."users"("id");

CREATE FUNCTION api_public.current_user() RETURNS "api_public"."users" AS $$
  SELECT * from "api_public"."users" WHERE id = api_public.current_user_id() LIMIT 1
$$ LANGUAGE sql stable;

ALTER TABLE "api_public"."users" enable row level security;
CREATE POLICY "select_user"
  on "api_public"."users"
  for select
  to "api_connected_user"
    using ("users"."id" = api_public.current_user_id());


grant usage
  on schema api_public
  to postgraphile, api_anonymous, api_connected_user;;
grant execute
  on function api_public.current_user_id()
  to postgraphile, api_connected_user;;
grant select
  on table api_public.users to postgraphile, api_connected_user;

comment on table "api_public"."users" is E'@omit delete,create,all';
comment on function "api_public"."current_user_id" is E'@omit execute';
