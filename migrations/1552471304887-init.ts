import {MigrationInterface, QueryRunner} from "typeorm";

export class init1552471304887 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    const q = queryRunner.query.bind(queryRunner);

    await q(`create schema "api_public"`);
    await q(`create schema "api_private"`);

    await q(`create role api_anonymous`);
    await q(`create role api_connected_user`);

    await q(`CREATE FUNCTION api_public.current_user_id() RETURNS uuid AS $$
      select current_setting('api.user.id', true)::uuid
    $$ LANGUAGE sql stable`)

    await q(`CREATE TABLE "api_public"."users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" character varying NOT NULL,
        "active" boolean NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_f1c105576275c5e14ffd5433b06" UNIQUE ("email"),
        CONSTRAINT "PK_3a3c76fd9951a6bece7296fee06" PRIMARY KEY ("id")
      )`);
    await q(`CREATE INDEX "IDX_f1c105576275c5e14ffd5433b0" ON "api_public"."users" ("email") `);
    await q(`CREATE TABLE "api_public"."todo" (
      "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
      "name" character varying NOT NULL,
      "comment" character varying,
      "creatorId" uuid NOT NULL DEFAULT api_public.current_user_id(),
      CONSTRAINT "PK_0467a898702d0989fffeae67507" PRIMARY KEY ("id")
      )`);
    await q(`CREATE TABLE "api_private"."auth_token" ("token" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "lastUsed" TIMESTAMP NOT NULL, "userId" uuid, CONSTRAINT "PK_d4ab2d7c4f0212463d0879d06e9" PRIMARY KEY ("token"))`);
    await q(`CREATE TYPE "api_private"."auth_method_type_enum" AS ENUM('email')`);
    await q(`CREATE TABLE "api_private"."auth_method" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "api_private"."auth_method_type_enum" NOT NULL DEFAULT 'email', "email" character varying NOT NULL, "hashedPassword" character varying NOT NULL, "active" boolean NOT NULL DEFAULT false, "userId" uuid, CONSTRAINT "UQ_f1ba092d9c28f209e5f2eb82375" UNIQUE ("email"), CONSTRAINT "PK_e3921e5815f2b3a2b868dc6b567" PRIMARY KEY ("id"))`);
    await q(`ALTER TABLE "api_public"."todo" ADD CONSTRAINT "FK_cf0917c67ffe457ca6ffc8d7a26" FOREIGN KEY ("creatorId") REFERENCES "api_public"."users"("id")`);
    await q(`ALTER TABLE "api_private"."auth_token" ADD CONSTRAINT "FK_69562a9cdded6afc05743d06ab7" FOREIGN KEY ("userId") REFERENCES "api_public"."users"("id")`);
    await q(`ALTER TABLE "api_private"."auth_method" ADD CONSTRAINT "FK_40988a3b7924eebd060f38daf4f" FOREIGN KEY ("userId") REFERENCES "api_public"."users"("id")`);

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
      to api_anonymous, api_connected_user;`);
    await q(`grant execute
      on function api_public.current_user_id()
      to api_anonymous, api_connected_user;`)
    await q(`grant select, delete
      on table api_public.todo to api_connected_user`)
    await q(`grant insert (name, comment), update (name, comment)
      on table api_public.todo to api_connected_user`)
    await q(`grant select
      on table api_public.users to api_connected_user`)

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

    await q(`ALTER TABLE "api_private"."auth_method" DROP CONSTRAINT "FK_40988a3b7924eebd060f38daf4f"`);
    await q(`ALTER TABLE "api_private"."auth_token" DROP CONSTRAINT "FK_69562a9cdded6afc05743d06ab7"`);
    await q(`ALTER TABLE "api_public"."todo" DROP CONSTRAINT "FK_cf0917c67ffe457ca6ffc8d7a26"`);
    await q(`DROP TABLE "api_private"."auth_method"`);
    await q(`DROP TYPE "api_private"."auth_method_type_enum"`);
    await q(`DROP TABLE "api_private"."auth_token"`);
    await q(`DROP TABLE "api_public"."todo"`);
    await q(`DROP INDEX "api_public"."IDX_f1c105576275c5e14ffd5433b0"`);
    await q(`DROP TABLE "api_public"."users"`);

    await q(`DROP FUNCTION api_public.current_user_id`);

    await q(`drop role api_anonymous`);
    await q(`drop role api_connected_user`);
    await q(`drop schema "api_public"`);
    await q(`drop schema "api_private"`);
  }

}
