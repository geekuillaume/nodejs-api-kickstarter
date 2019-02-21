import {MigrationInterface, QueryRunner} from "typeorm";

export class init1550768614094 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "active" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `);
        await queryRunner.query(`CREATE TYPE "auth_method_type_enum" AS ENUM('email')`);
        await queryRunner.query(`CREATE TABLE "auth_method" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "auth_method_type_enum" NOT NULL DEFAULT 'email', "email" character varying NOT NULL, "hashedPassword" character varying NOT NULL, "active" boolean NOT NULL DEFAULT false, "userId" uuid, CONSTRAINT "UQ_da4ba2c5115d264e9713a095c2c" UNIQUE ("email"), CONSTRAINT "PK_a7387b7f806f012b27c2e889072" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "todo" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "comment" character varying, "creatorId" uuid NOT NULL, CONSTRAINT "PK_d429b7114371f6a35c5cb4776a7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "auth_method" ADD CONSTRAINT "FK_b44b4a93d5173dd028ea7414219" FOREIGN KEY ("userId") REFERENCES "user"("id")`);
        await queryRunner.query(`ALTER TABLE "todo" ADD CONSTRAINT "FK_a4bb15f5b622b108dd0bc9d248d" FOREIGN KEY ("creatorId") REFERENCES "user"("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "todo" DROP CONSTRAINT "FK_a4bb15f5b622b108dd0bc9d248d"`);
        await queryRunner.query(`ALTER TABLE "auth_method" DROP CONSTRAINT "FK_b44b4a93d5173dd028ea7414219"`);
        await queryRunner.query(`DROP TABLE "todo"`);
        await queryRunner.query(`DROP TABLE "auth_method"`);
        await queryRunner.query(`DROP TYPE "auth_method_type_enum"`);
        await queryRunner.query(`DROP INDEX "IDX_e12875dfb3b1d92d7d7c5377e2"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
