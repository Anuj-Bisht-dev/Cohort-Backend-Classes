ALTER TABLE "users" ADD COLUMN "verify_token" varchar;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_verify_token_unique" UNIQUE("verify_token");