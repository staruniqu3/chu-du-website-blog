import { pool } from "@workspace/db";
import { logger } from "./lib/logger";

/**
 * Ensures all database tables exist (CREATE TABLE IF NOT EXISTS).
 * Safe to run on every startup — no-ops if tables already exist.
 */
export async function ensureSchema() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS "app_settings" (
        "id" serial PRIMARY KEY,
        "admin_password_hash" text,
        "contact_email" text NOT NULL DEFAULT '',
        "updated_at" timestamp NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS "welcome_page" (
        "id" serial PRIMARY KEY,
        "headline" text NOT NULL,
        "subheadline" text NOT NULL,
        "body" text NOT NULL,
        "updated_at" timestamp NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS "blogs" (
        "id" serial PRIMARY KEY,
        "title" text NOT NULL,
        "content" text NOT NULL,
        "excerpt" text,
        "cover_image" text,
        "published" boolean NOT NULL DEFAULT false,
        "category" text NOT NULL DEFAULT 'blog',
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS "order_rules" (
        "id" serial PRIMARY KEY,
        "title" text NOT NULL,
        "content" text NOT NULL,
        "sort_order" integer NOT NULL DEFAULT 0,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS "features" (
        "id" serial PRIMARY KEY,
        "title" text NOT NULL,
        "description" text NOT NULL,
        "icon" text NOT NULL DEFAULT 'star',
        "enabled" boolean NOT NULL DEFAULT true,
        "sort_order" integer NOT NULL DEFAULT 0,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS "portfolio_items" (
        "id" serial PRIMARY KEY,
        "title" text NOT NULL,
        "description" text NOT NULL,
        "cover_image" text,
        "link" text,
        "tags" text NOT NULL DEFAULT '',
        "sort_order" integer NOT NULL DEFAULT 0,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now()
      );
    `);

    // Seed welcome_page with one default row if empty
    await client.query(`
      INSERT INTO "welcome_page" ("headline", "subheadline", "body")
      SELECT 'Tiệm Chu Du', 'Nơi lưu giữ những câu chuyện', ''
      WHERE NOT EXISTS (SELECT 1 FROM "welcome_page" LIMIT 1);
    `);

    logger.info("Database schema verified");
  } finally {
    client.release();
  }
}
