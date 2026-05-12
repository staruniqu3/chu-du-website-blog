import { Router } from "express";
import { db } from "@workspace/db";
import { orderRulesTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import {
  CreateOrderRuleBody,
  UpdateOrderRuleParams,
  UpdateOrderRuleBody,
  DeleteOrderRuleParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/order-rules", async (_req, res) => {
  const rules = await db
    .select()
    .from(orderRulesTable)
    .orderBy(asc(orderRulesTable.sortOrder), asc(orderRulesTable.createdAt));
  return res.json(rules);
});

router.post("/order-rules", async (req, res) => {
  const body = CreateOrderRuleBody.safeParse(req.body);
  if (!body.success) {
    return res.status(400).json({ error: "Invalid body" });
  }
  const [rule] = await db
    .insert(orderRulesTable)
    .values({
      title: body.data.title,
      content: body.data.content,
      sortOrder: body.data.sortOrder ?? 0,
    })
    .returning();
  return res.status(201).json(rule);
});

router.patch("/order-rules/:id", async (req, res) => {
  const params = UpdateOrderRuleParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    return res.status(400).json({ error: "Invalid id" });
  }
  const body = UpdateOrderRuleBody.safeParse(req.body);
  if (!body.success) {
    return res.status(400).json({ error: "Invalid body" });
  }
  const updateData: Record<string, unknown> = { updatedAt: new Date() };
  if (body.data.title !== undefined) updateData.title = body.data.title;
  if (body.data.content !== undefined) updateData.content = body.data.content;
  if (body.data.sortOrder !== undefined) updateData.sortOrder = body.data.sortOrder;

  const [rule] = await db
    .update(orderRulesTable)
    .set(updateData)
    .where(eq(orderRulesTable.id, params.data.id))
    .returning();
  if (!rule) {
    return res.status(404).json({ error: "Order rule not found" });
  }
  return res.json(rule);
});

router.delete("/order-rules/:id", async (req, res) => {
  const params = DeleteOrderRuleParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    return res.status(400).json({ error: "Invalid id" });
  }
  await db.delete(orderRulesTable).where(eq(orderRulesTable.id, params.data.id));
  return res.status(204).send();
});

export default router;
