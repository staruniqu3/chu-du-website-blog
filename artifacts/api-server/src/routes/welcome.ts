import { Router } from "express";
import { db } from "@workspace/db";
import { welcomePageTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { UpdateWelcomeBody } from "@workspace/api-zod";

const router = Router();

router.get("/welcome", async (_req, res) => {
  const [page] = await db.select().from(welcomePageTable).limit(1);
  if (!page) {
    return res.status(404).json({ error: "Welcome page not found" });
  }
  return res.json(page);
});

router.patch("/welcome", async (req, res) => {
  const body = UpdateWelcomeBody.safeParse(req.body);
  if (!body.success) {
    return res.status(400).json({ error: "Invalid body" });
  }

  const [existing] = await db.select().from(welcomePageTable).limit(1);

  // Upsert: create a default row if none exists yet
  if (!existing) {
    const [created] = await db.insert(welcomePageTable).values({
      headline: body.data.headline ?? "Tiệm Chu Du",
      subheadline: body.data.subheadline ?? "Nơi lưu giữ những câu chuyện",
      body: body.data.body ?? "",
    }).returning();
    return res.json(created);
  }

  const updateData: Record<string, unknown> = { updatedAt: new Date() };
  if (body.data.headline !== undefined) updateData.headline = body.data.headline;
  if (body.data.subheadline !== undefined) updateData.subheadline = body.data.subheadline;
  if (body.data.body !== undefined) updateData.body = body.data.body;

  const [page] = await db
    .update(welcomePageTable)
    .set(updateData)
    .where(eq(welcomePageTable.id, existing.id))
    .returning();
  return res.json(page);
});

export default router;
