import { Router } from "express";
import { db } from "@workspace/db";
import { appSettingsTable } from "@workspace/db";
import { UpdateContactSettingsBody } from "@workspace/api-zod";
import { eq } from "drizzle-orm";

const router = Router();

async function getSettings() {
  const [row] = await db.select().from(appSettingsTable).limit(1);
  return row ?? null;
}

router.get("/settings/contact", async (_req, res) => {
  let settings = await getSettings();
  if (!settings) {
    const [row] = await db.insert(appSettingsTable).values({ contactEmail: "" }).returning();
    settings = row;
  }
  return res.json({ id: settings.id, email: settings.contactEmail, updatedAt: settings.updatedAt });
});

router.patch("/settings/contact", async (req, res) => {
  const body = UpdateContactSettingsBody.safeParse(req.body);
  if (!body.success) return res.status(400).json({ error: "Invalid body" });
  let settings = await getSettings();
  if (!settings) {
    const [row] = await db.insert(appSettingsTable).values({ contactEmail: body.data.email ?? "" }).returning();
    return res.json({ id: row.id, email: row.contactEmail, updatedAt: row.updatedAt });
  }
  const [updated] = await db.update(appSettingsTable)
    .set({ contactEmail: body.data.email ?? settings.contactEmail, updatedAt: new Date() })
    .where(eq(appSettingsTable.id, settings.id))
    .returning();
  return res.json({ id: updated.id, email: updated.contactEmail, updatedAt: updated.updatedAt });
});

export default router;
