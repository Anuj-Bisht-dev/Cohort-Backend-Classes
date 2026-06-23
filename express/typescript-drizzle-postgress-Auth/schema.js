"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.userTable = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    firstName: (0, pg_core_1.varchar)("first_name", { length: 50 }).notNull(),
    lastName: (0, pg_core_1.varchar)("last_name", { length: 45 }),
    email: (0, pg_core_1.varchar)("email", { length: 322 }).notNull().unique(),
    verifyEmail: (0, pg_core_1.boolean)("verify_email").default(false).notNull(),
    password: (0, pg_core_1.varchar)("password", { length: 66 }),
    salt: (0, pg_core_1.text)("salt"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").$onUpdate(() => new Date()),
});
//# sourceMappingURL=schema.js.map