import { pgTable, text, serial, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const blogsTable = pgTable("blogs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  coverImage: text("cover_image"),
  published: boolean("published").notNull().default(false),
  category: text("category").notNull().default("blog"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertBlogSchema = createInsertSchema(blogsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertBlog = z.infer<typeof insertBlogSchema>;
export type Blog = typeof blogsTable.$inferSelect;
