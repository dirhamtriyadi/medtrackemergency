import { Request, Response } from "express";
import { prisma } from "../db";

export class DashboardController {
  /**
   * GET /dashboard
   * Tampilkan dashboard dengan KPI dan alerts
   */
  static async showDashboard(req: Request, res: Response) {
    try {
      const now = new Date();
      const expSoonDays = 30;
      const expSoon = new Date(
        now.getTime() + expSoonDays * 24 * 60 * 60 * 1000,
      );

      // Ambil data secara parallel untuk performa lebih baik
      const [countsByCategory, allItems, expiring] = await Promise.all([
        // Hitung jumlah item per kategori
        prisma.item.groupBy({
          by: ["category"],
          _count: { _all: true },
          orderBy: { category: "asc" },
        }),

        // Ambil semua items untuk filter stok menipis
        prisma.item.findMany({
          select: {
            id: true,
            name: true,
            stock: true,
            minStock: true,
            unit: true,
          },
          orderBy: { stock: "asc" },
        }),

        // Cari item yang akan expired
        prisma.item.findMany({
          where: {
            expiredAt: {
              lte: expSoon,
              gte: now,
            },
          },
          orderBy: { expiredAt: "asc" },
        }),
      ]);

      // Filter item dengan stok menipis (manual karena Prisma SQLite limitation)
      const lowStock = allItems.filter((item) => item.stock < item.minStock);

      res.render("dashboard", {
        countsByCategory,
        lowStock,
        expiring,
        expSoonDays,
      });
    } catch (error) {
      console.error("Dashboard error:", error);
      res.status(500).send("Terjadi kesalahan saat memuat dashboard");
    }
  }
}
