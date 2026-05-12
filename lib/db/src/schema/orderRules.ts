import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const orderRulesTable = pgTable("order_rules", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertOrderRuleSchema = createInsertSchema(orderRulesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertOrderRule = z.infer<typeof insertOrderRuleSchema>;
export type OrderRule = typeof orderRulesTable.$inferSelect;
