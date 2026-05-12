import { Router } from "express";
import { db } from "@workspace/db";
import { appSettingsTable } from "@workspace/db";
import bcrypt from "bcryptjs";
import {
  SetupAdminPasswordBody,
  LoginAdminBody,
  ChangeAdminPasswordBody,
} from "@workspace/api-zod";
import { eq } from "drizzle-orm";

const router = Router();

async function getSettings() {
  const [row] = await db.select().from(appSettingsTable).limit(1);
  return row ?? null;
}

router.get("/admin/auth/status", async (_req, res) => {
  const settings = await getSettings();
  return res.json({ hasPassword: !!(settings?.adminPasswordHash) });
});

router.post("/admin/auth/setup", async (req, res) => {
  const body = SetupAdminPasswordBody.safeParse(req.body);
  if (!body.success) return res.status(400).json({ error: "Invalid body" });
  const settings = await getSettings();
  if (settings?.adminPasswordHash) {
    return res.status(409).json({ error: "Password already set up" });
  }
  const hash = await bcrypt.hash(body.data.password, 10);
  if (settings) {
    await db.update(appSettingsTable).set({ adminPasswordHash: hash, updatedAt: new Date() }).where(eq(appSettingsTable.id, settings.id));
  } else {
    await db.insert(appSettingsTable).values({ adminPasswordHash: hash });
  }
  return res.json({ success: true });
});

router.post("/admin/auth/login", async (req, res) => {
  const body = LoginAdminBody.safeParse(req.body);
  if (!body.success) return res.status(400).json({ error: "Invalid body" });
  const settings = await getSettings();
  if (!settings?.adminPasswordHash) return res.status(401).json({ error: "No password set" });
  const ok = await bcrypt.compare(body.data.password, settings.adminPasswordHash);
  if (!ok) return res.status(401).json({ error: "Wrong password" });
  return res.json({ success: true });
});

router.post("/admin/auth/change-password", async (req, res) => {
  const body = ChangeAdminPasswordBody.safeParse(req.body);
  if (!body.success) return res.status(400).json({ error: "Invalid body" });
  const settings = await getSettings();
  if (!settings?.adminPasswordHash) return res.status(401).json({ error: "No password set" });
  const ok = await bcrypt.compare(body.data.currentPassword, settings.adminPasswordHash);
  if (!ok) return res.status(401).json({ error: "Wrong current password" });
  const hash = await bcrypt.hash(body.data.newPassword, 10);
  await db.update(appSettingsTable).set({ adminPasswordHash: hash, updatedAt: new Date() }).where(eq(appSettingsTable.id, settings.id));
  return res.json({ success: true });
});

// Reset password using ADMIN_RESET_TOKEN env var (set in Railway Variables to enable)
router.post("/admin/auth/reset", async (req, res) => {
  const resetToken = process.env.ADMIN_RESET_TOKEN;
  if (!resetToken) {
    return res.status(403).json({ error: "Reset not enabled. Set ADMIN_RESET_TOKEN env var to enable." });
  }
  const { token } = req.body as { token?: string };
  if (!token || token !== resetToken) {
    return res.status(401).json({ error: "Invalid reset token." });
  }
  const settings = await getSettings();
  if (settings) {
    await db.update(appSettingsTable).set({ adminPasswordHash: null, updatedAt: new Date() }).where(eq(appSettingsTable.id, settings.id));
  }
  return res.json({ success: true });
});

export default router;
