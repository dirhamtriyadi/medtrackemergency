import { Router } from "express";
import { requireAuth } from "../auth";
import { prisma } from "../db"; // ✅ pakai singleton

const router = Router();

router.get("/dashboard", requireAuth, async (req, res) => {
  const now = new Date();
  const expSoonDays = 30;
  const expSoon = new Date(now.getTime() + expSoonDays * 24 * 60 * 60 * 1000);

  const lowStock = await prisma.item
    .findMany({
      where: { stock: { lt: prisma.item.fields.minStock } }, // workaround below if error
    })
    .catch(async () => {
      // Prisma SQLite sometimes doesn't like "fields" in older versions.
      // fallback: fetch all then filter
      const all = await prisma.item.findMany();
      return all.filter((it) => it.stock < it.minStock);
    });

  const expiring = await prisma.item.findMany({
    where: { expiredAt: { not: null, lte: expSoon } },
    orderBy: { expiredAt: "asc" },
  });

  const countsByCategory = await prisma.item.groupBy({
    by: ["category"],
    _count: { _all: true },
  });

  res.render("dashboard", {
    lowStock,
    expiring,
    countsByCategory,
    expSoonDays,
  });
});

export default router;
