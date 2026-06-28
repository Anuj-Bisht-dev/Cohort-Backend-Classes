ALTER TABLE "users" DROP CONSTRAINT "users_verify_token_unique";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "verification_token" varchar;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "verify_token";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_verification_token_unique" UNIQUE("verification_token");