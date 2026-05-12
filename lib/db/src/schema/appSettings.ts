import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";

export const appSettingsTable = pgTable("app_settings", {
  id: serial("id").primaryKey(),
  adminPasswordHash: text("admin_password_hash"),
  contactEmail: text("contact_email").notNull().default(""),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type AppSettings = typeof appSettingsTable.$inferSelect;
