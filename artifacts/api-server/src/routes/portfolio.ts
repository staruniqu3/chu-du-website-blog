import { Router } from "express";
import { db } from "@workspace/db";
import { portfolioTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import {
  CreatePortfolioItemBody,
  UpdatePortfolioItemParams,
  UpdatePortfolioItemBody,
  DeletePortfolioItemParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/portfolio", async (_req, res) => {
  const items = await db
    .select()
    .from(portfolioTable)
    .orderBy(asc(portfolioTable.sortOrder), asc(portfolioTable.createdAt));
  return res.json(items);
});

router.post("/portfolio", async (req, res) => {
  const body = CreatePortfolioItemBody.safeParse(req.body);
  if (!body.success) return res.status(400).json({ error: "Invalid body" });
  const [item] = await db.insert(portfolioTable).values({
    title: body.data.title,
    description: body.data.description,
    coverImage: body.data.coverImage,
    link: body.data.link,
    tags: body.data.tags ?? "",
    sortOrder: body.data.sortOrder ?? 0,
  }).returning();
  return res.status(201).json(item);
});

router.patch("/portfolio/:id", async (req, res) => {
  const params = UpdatePortfolioItemParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) return res.status(400).json({ error: "Invalid id" });
  const body = UpdatePortfolioItemBody.safeParse(req.body);
  if (!body.success) return res.status(400).json({ error: "Invalid body" });
  const updateData: Record<string, unknown> = { updatedAt: new Date() };
  if (body.data.title !== undefined) updateData.title = body.data.title;
  if (body.data.description !== undefined) updateData.description = body.data.description;
  if (body.data.coverImage !== undefined) updateData.coverImage = body.data.coverImage;
  if (body.data.link !== undefined) updateData.link = body.data.link;
  if (body.data.tags !== undefined) updateData.tags = body.data.tags;
  if (body.data.sortOrder !== undefined) updateData.sortOrder = body.data.sortOrder;
  const [item] = await db.update(portfolioTable).set(updateData).where(eq(portfolioTable.id, params.data.id)).returning();
  if (!item) return res.status(404).json({ error: "Portfolio item not found" });
  return res.json(item);
});

router.delete("/portfolio/:id", async (req, res) => {
  const params = DeletePortfolioItemParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) return res.status(400).json({ error: "Invalid id" });
  await db.delete(portfolioTable).where(eq(portfolioTable.id, params.data.id));
  return res.status(204).send();
});

export default router;
