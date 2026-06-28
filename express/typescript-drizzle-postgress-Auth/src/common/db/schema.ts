import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export const userTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),

  firstName: varchar("first_name", { length: 50 }).notNull(),
  lastName: varchar("last_name", { length: 45 }),

  email: varchar("email", { length: 322 }).notNull().unique(),
  verifyEmail: boolean("verify_email").default(false).notNull(),

  password: varchar("password", { length: 66 }),
  salt: text("salt"),

  refreshToken: varchar("refresh_token").unique(),

  verificationToken: varchar("verification_token").unique(),
  verificationTokenExpiresIn: timestamp('verification_token_expires_in'),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});
