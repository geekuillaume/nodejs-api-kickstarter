import {MigrationInterface, QueryRunner} from "typeorm";

export class init1552471304887 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    const q = queryRunner.query.bind(queryRunner);

    await q(`create extension if not exists "uuid-ossp" with schema public`);

    await q(`create schema "api_public"`);
    await q(`create schema "api_private"`);

    await q(`grant usage on schema api_public to postgraphile`);
    await q(`alter default privileges in schema api_public grant usage, select on sequences to postgraphile`)

    await q(`create role api_anonymous`);
    await q(`create role api_connected_user`);

    await q(`grant api_anonymous to postgraphile`)
    await q(`grant api_connected_user to postgraphile`)

    await q(`CREATE FUNCTION api_public.current_user_id() RETURNS uuid AS $$
      select current_setting('api.user.id', true)::uuid
    $$ LANGUAGE sql stable`)
    await q(`COMMENT ON FUNCTION api_public.current_user_id() is E'@omit execute'`)

    await q(`CREATE TABLE "api_public"."users" (
      "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
      "email" character varying NOT NULL,
      "active" boolean NOT NULL DEFAULT false,
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
      "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
      CONSTRAINT "UQ_users_id" UNIQUE ("email"),
      CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
    )`);
    await q(`CREATE INDEX "IDX_users_email" ON "api_public"."users" ("email") `);
    await q(`COMMENT ON CONSTRAINT "UQ_users_id" on "api_public"."users" is E'@omit'`)


    await q(`CREATE TABLE "api_public"."todo" (
      "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
      "name" character varying NOT NULL,
      "comment" character varying,
      "creatorId" uuid NOT NULL DEFAULT api_public.current_user_id(),
      CONSTRAINT "PK_todo_id" PRIMARY KEY ("id")
    )`);
    await q(`CREATE TABLE "api_private"."auth_token" (
      "token" character varying NOT NULL,
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
      "lastUsed" TIMESTAMPTZ NOT NULL,
      "userId" uuid,
      CONSTRAINT "PK_auth_token_token" PRIMARY KEY ("token")
    )`);

    await q(`CREATE TYPE "api_private"."auth_method_type_enum" AS ENUM('email')`);
    await q(`CREATE TABLE "api_private"."auth_method" (
      "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
      "type" "api_private"."auth_method_type_enum" NOT NULL DEFAULT 'email',
      "email" character varying NOT NULL,
      "hashedPassword" character varying NOT NULL,
      "active" boolean NOT NULL DEFAULT false,
      "userId" uuid NOT NULL,
      CONSTRAINT "UQ_auth_method_email" UNIQUE ("email"),
      CONSTRAINT "PK_auth_method_id" PRIMARY KEY ("id")
    )`);
    await q(`ALTER TABLE "api_public"."todo"
      ADD CONSTRAINT "FK_todo_creatorId" FOREIGN KEY ("creatorId")
      REFERENCES "api_public"."users"("id")`);
    await q(`ALTER TABLE "api_private"."auth_token"
      ADD CONSTRAINT "FK_auth_token_userId" FOREIGN KEY ("userId")
      REFERENCES "api_public"."users"("id")`);
    await q(`ALTER TABLE "api_private"."auth_method"
      ADD CONSTRAINT "FK_auth_method_userId" FOREIGN KEY ("userId")
      REFERENCES "api_public"."users"("id")`);

    await q(`CREATE FUNCTION api_public.current_user() RETURNS "api_public"."users" AS $$
      SELECT * from "api_public"."users" WHERE id = api_public.current_user_id() LIMIT 1
    $$ LANGUAGE sql stable`)

    await q(`ALTER TABLE "api_public"."todo" enable row level security`);
    await q(`CREATE POLICY "select_todo"
      on "api_public"."todo"
      for select
      to "api_connected_user"
        using ("todo"."creatorId" = api_public.current_user_id())`);
    await q(`CREATE POLICY "update_todo"
      on "api_public"."todo"
      for update
      to "api_connected_user"
        using ("todo"."creatorId" = api_public.current_user_id())
        with check ("todo"."creatorId" = api_public.current_user_id())`);
    await q(`CREATE POLICY "insert_todo"
      on "api_public"."todo"
      for insert
      to "api_connected_user"
        with check ("todo"."creatorId" = api_public.current_user_id())`);
    await q(`CREATE POLICY "delete_todo"
      on "api_public"."todo"
      for delete
      to "api_connected_user"
        using ("todo"."creatorId" = api_public.current_user_id())`);

    await q(`ALTER TABLE "api_public"."users" enable row level security`);
    await q(`CREATE POLICY "select_user"
      on "api_public"."users"
      for select
      to "api_connected_user"
        using ("users"."id" = api_public.current_user_id())`);


    await q(`grant usage
      on schema api_public
      to postgraphile, api_anonymous, api_connected_user;`);
    await q(`grant execute
      on function api_public.current_user_id()
      to postgraphile, api_connected_user;`)
    await q(`grant select, delete
      on table api_public.todo to postgraphile, api_connected_user`)
    await q(`grant insert (name, comment), update (name, comment)
      on table api_public.todo to postgraphile, api_connected_user`)
    await q(`grant select
      on table api_public.users to postgraphile, api_connected_user`)

    await q(`comment on table "api_public"."users" is E'@omit delete,create,all'`)
    await q(`comment on function "api_public"."current_user_id" is E'@omit execute'`)
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const q = queryRunner.query.bind(queryRunner);

    await q(`DROP POLICY select_user`);
    await q(`DROP POLICY select_todo`);
    await q(`DROP POLICY update_todo`);
    await q(`DROP POLICY insert_todo`);
    await q(`DROP POLICY delete_todo`);

    await q(`ALTER TABLE "api_private"."auth_method" DROP CONSTRAINT "FK_auth_method_userId"`);
    await q(`ALTER TABLE "api_private"."auth_token" DROP CONSTRAINT "FK_auth_token_userId"`);
    await q(`ALTER TABLE "api_public"."todo" DROP CONSTRAINT "FK_todo_creatorId"`);
    await q(`DROP TABLE "api_private"."auth_method"`);
    await q(`DROP TYPE "api_private"."auth_method_type_enum"`);
    await q(`DROP TABLE "api_private"."auth_token"`);
    await q(`DROP TABLE "api_public"."todo"`);
    await q(`DROP INDEX "api_public"."IDX_users_email"`);
    await q(`DROP TABLE "api_public"."users"`);

    await q(`DROP FUNCTION api_public.current_user_id`);

    await q(`drop role api_anonymous`);
    await q(`drop role api_connected_user`);
    await q(`drop schema "api_public"`);
    await q(`drop schema "api_private"`);
  }

}
