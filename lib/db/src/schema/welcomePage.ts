import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const welcomePageTable = pgTable("welcome_page", {
  id: serial("id").primaryKey(),
  headline: text("headline").notNull(),
  subheadline: text("subheadline").notNull(),
  body: text("body").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertWelcomePageSchema = createInsertSchema(welcomePageTable).omit({ id: true, updatedAt: true });
export type InsertWelcomePage = z.infer<typeof insertWelcomePageSchema>;
export type WelcomePage = typeof welcomePageTable.$inferSelect;
