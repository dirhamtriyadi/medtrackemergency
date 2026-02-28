import { Router } from "express";
import { requireAuth } from "../auth";
import { prisma } from "../db"; // ✅ pakai singleton

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  const { q, category } = req.query;
  const where: any = {};
  if (q) where.name = { contains: q.toString(), mode: "insensitive" };
  if (category) where.category = category.toString();

  const items = await prisma.item.findMany({
    where,
    orderBy: { updatedAt: "desc" },
  });
  res.render("items", { items, q: q || "", category: category || "" });
});

router.get("/new", requireAuth, (req, res) => {
  res.render("item_form", { item: null });
});

router.post("/new", requireAuth, async (req, res) => {
  const { name, category, stock, unit, minStock, expiredAt } = req.body;
  await prisma.item.create({
    data: {
      name,
      category,
      stock: parseInt(stock || "0", 10),
      unit: unit || "pcs",
      minStock: parseInt(minStock || "5", 10),
      expiredAt: expiredAt ? new Date(expiredAt) : null,
    },
  });
  res.redirect("/items");
});

router.get("/:id/edit", requireAuth, async (req, res) => {
  const id = parseInt(req.params.id as string, 10);
  const item = await prisma.item.findUnique({ where: { id } });
  if (!item) return res.redirect("/items");
  res.render("item_form", { item });
});

router.post("/:id/edit", requireAuth, async (req, res) => {
  const id = parseInt(req.params.id as string, 10);
  const { name, category, stock, unit, minStock, expiredAt } = req.body;
  await prisma.item.update({
    where: { id },
    data: {
      name,
      category,
      stock: parseInt(stock || "0", 10),
      unit: unit || "pcs",
      minStock: parseInt(minStock || "5", 10),
      expiredAt: expiredAt ? new Date(expiredAt) : null,
    },
  });
  res.redirect("/items");
});

router.post("/:id/delete", requireAuth, async (req, res) => {
  const id = parseInt(req.params.id as string, 10);
  await prisma.item.delete({ where: { id } }).catch(() => {});
  res.redirect("/items");
});

export default router;
