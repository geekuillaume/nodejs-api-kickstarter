CREATE TABLE "api_public"."reset_password_token" (
  "token" character varying NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "expireAt" TIMESTAMP NOT NULL DEFAULT NOW() + '1 hour',
  "userId" uuid NOT NULL,
  CONSTRAINT "PK_reset_password_token_token" PRIMARY KEY ("token")
);

CREATE UNIQUE INDEX "IDX_reset_password_token_userId"
  ON "api_public"."reset_password_token" ("userId");

ALTER TABLE "api_public"."reset_password_token"
  ADD CONSTRAINT "reset_password_token_userId" FOREIGN KEY ("userId")
  REFERENCES "api_public"."users"("id")
  ON DELETE NO ACTION ON UPDATE NO ACTION;
