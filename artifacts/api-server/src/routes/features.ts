import { Router } from "express";
import { db } from "@workspace/db";
import { featuresTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import {
  CreateFeatureBody,
  UpdateFeatureParams,
  UpdateFeatureBody,
  DeleteFeatureParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/features", async (_req, res) => {
  const features = await db
    .select()
    .from(featuresTable)
    .orderBy(asc(featuresTable.sortOrder), asc(featuresTable.createdAt));
  return res.json(features);
});

router.post("/features", async (req, res) => {
  const body = CreateFeatureBody.safeParse(req.body);
  if (!body.success) return res.status(400).json({ error: "Invalid body" });
  const [feature] = await db.insert(featuresTable).values({
    title: body.data.title,
    description: body.data.description,
    icon: body.data.icon ?? "star",
    enabled: body.data.enabled ?? true,
    sortOrder: body.data.sortOrder ?? 0,
  }).returning();
  return res.status(201).json(feature);
});

router.patch("/features/:id", async (req, res) => {
  const params = UpdateFeatureParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) return res.status(400).json({ error: "Invalid id" });
  const body = UpdateFeatureBody.safeParse(req.body);
  if (!body.success) return res.status(400).json({ error: "Invalid body" });
  const updateData: Record<string, unknown> = { updatedAt: new Date() };
  if (body.data.title !== undefined) updateData.title = body.data.title;
  if (body.data.description !== undefined) updateData.description = body.data.description;
  if (body.data.icon !== undefined) updateData.icon = body.data.icon;
  if (body.data.enabled !== undefined) updateData.enabled = body.data.enabled;
  if (body.data.sortOrder !== undefined) updateData.sortOrder = body.data.sortOrder;
  const [feature] = await db.update(featuresTable).set(updateData).where(eq(featuresTable.id, params.data.id)).returning();
  if (!feature) return res.status(404).json({ error: "Feature not found" });
  return res.json(feature);
});

router.delete("/features/:id", async (req, res) => {
  const params = DeleteFeatureParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) return res.status(400).json({ error: "Invalid id" });
  await db.delete(featuresTable).where(eq(featuresTable.id, params.data.id));
  return res.status(204).send();
});

export default router;
