import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const portfolioTable = pgTable("portfolio_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  coverImage: text("cover_image"),
  link: text("link"),
  tags: text("tags").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertPortfolioSchema = createInsertSchema(portfolioTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertPortfolio = z.infer<typeof insertPortfolioSchema>;
export type PortfolioItem = typeof portfolioTable.$inferSelect;
