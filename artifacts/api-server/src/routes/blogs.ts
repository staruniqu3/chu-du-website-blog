import { Router } from "express";
import { db } from "@workspace/db";
import { blogsTable } from "@workspace/db";
import { eq, desc, and } from "drizzle-orm";
import {
  ListBlogsQueryParams,
  CreateBlogBody,
  GetBlogParams,
  UpdateBlogParams,
  UpdateBlogBody,
  DeleteBlogParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/blogs", async (req, res) => {
  const query = ListBlogsQueryParams.safeParse(req.query);
  if (!query.success) {
    return res.status(400).json({ error: "Invalid query params" });
  }
  const { limit = 20, offset = 0, published, category } = query.data;
  const conditions = [];
  if (published !== undefined) {
    conditions.push(eq(blogsTable.published, published));
  }
  if (category !== undefined) {
    conditions.push(eq(blogsTable.category, category));
  }
  const blogs = await db
    .select()
    .from(blogsTable)
    .where(conditions.length > 1 ? and(...conditions) : conditions[0])
    .orderBy(desc(blogsTable.createdAt))
    .limit(limit)
    .offset(offset);
  return res.json(blogs);
});

router.get("/blogs/recent", async (_req, res) => {
  const blogs = await db
    .select()
    .from(blogsTable)
    .where(and(eq(blogsTable.published, true), eq(blogsTable.category, "blog")))
    .orderBy(desc(blogsTable.createdAt))
    .limit(5);
  return res.json(blogs);
});

router.get("/blogs/:id", async (req, res) => {
  const params = GetBlogParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    return res.status(400).json({ error: "Invalid id" });
  }
  const [blog] = await db
    .select()
    .from(blogsTable)
    .where(eq(blogsTable.id, params.data.id));
  if (!blog) {
    return res.status(404).json({ error: "Blog not found" });
  }
  return res.json(blog);
});

router.post("/blogs", async (req, res) => {
  const body = CreateBlogBody.safeParse(req.body);
  if (!body.success) {
    return res.status(400).json({ error: "Invalid body" });
  }
  const [blog] = await db
    .insert(blogsTable)
    .values({
      title: body.data.title,
      content: body.data.content,
      excerpt: body.data.excerpt,
      coverImage: body.data.coverImage,
      published: body.data.published ?? false,
      category: body.data.category ?? "blog",
    })
    .returning();
  return res.status(201).json(blog);
});

router.patch("/blogs/:id", async (req, res) => {
  const params = UpdateBlogParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    return res.status(400).json({ error: "Invalid id" });
  }
  const body = UpdateBlogBody.safeParse(req.body);
  if (!body.success) {
    return res.status(400).json({ error: "Invalid body" });
  }
  const updateData: Record<string, unknown> = { updatedAt: new Date() };
  if (body.data.title !== undefined) updateData.title = body.data.title;
  if (body.data.content !== undefined) updateData.content = body.data.content;
  if (body.data.excerpt !== undefined) updateData.excerpt = body.data.excerpt;
  if (body.data.coverImage !== undefined) updateData.coverImage = body.data.coverImage;
  if (body.data.published !== undefined) updateData.published = body.data.published;
  if (body.data.category !== undefined) updateData.category = body.data.category;

  const [blog] = await db
    .update(blogsTable)
    .set(updateData)
    .where(eq(blogsTable.id, params.data.id))
    .returning();
  if (!blog) {
    return res.status(404).json({ error: "Blog not found" });
  }
  return res.json(blog);
});

router.delete("/blogs/:id", async (req, res) => {
  const params = DeleteBlogParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    return res.status(400).json({ error: "Invalid id" });
  }
  await db.delete(blogsTable).where(eq(blogsTable.id, params.data.id));
  return res.status(204).send();
});

export default router;
