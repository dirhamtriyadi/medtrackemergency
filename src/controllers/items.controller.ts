import { Request, Response } from "express";
import { prisma } from "../db";

export class ItemsController {
  /**
   * GET /items
   * Tampilkan daftar items dengan filter
   */
  static async index(req: Request, res: Response) {
    try {
      const { q, category } = req.query;
      const where: any = {};

      // Build filter query
      if (q) {
        where.name = { contains: q.toString(), mode: "insensitive" };
      }
      if (category) {
        where.category = category.toString();
      }

      // Fetch items
      const items = await prisma.item.findMany({
        where,
        orderBy: { updatedAt: "desc" },
      });

      res.render("items", {
        items,
        q: q || "",
        category: category || "",
      });
    } catch (error) {
      console.error("Items index error:", error);
      res.status(500).send("Terjadi kesalahan saat memuat items");
    }
  }

  /**
   * GET /items/new
   * Tampilkan form tambah item baru
   */
  static showCreateForm(req: Request, res: Response) {
    res.render("item_form", { item: null });
  }

  /**
   * POST /items/new
   * Handle create item
   */
  static async create(req: Request, res: Response) {
    try {
      const { name, category, stock, unit, minStock, expiredAt } = req.body;

      // Validasi input
      if (!name || !category) {
        return res.render("item_form", {
          item: req.body,
          error: "Nama dan kategori harus diisi",
        });
      }

      // Create item
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
    } catch (error) {
      console.error("Create item error:", error);
      res.render("item_form", {
        item: req.body,
        error: "Terjadi kesalahan saat menyimpan item",
      });
    }
  }

  /**
   * GET /items/:id/edit
   * Tampilkan form edit item
   */
  static async showEditForm(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string, 10);

      if (isNaN(id)) {
        return res.redirect("/items");
      }

      const item = await prisma.item.findUnique({ where: { id } });

      if (!item) {
        return res.redirect("/items");
      }

      res.render("item_form", { item });
    } catch (error) {
      console.error("Show edit form error:", error);
      res.redirect("/items");
    }
  }

  /**
   * POST /items/:id/edit
   * Handle update item
   */
  static async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string, 10);

      if (isNaN(id)) {
        return res.redirect("/items");
      }

      const { name, category, stock, unit, minStock, expiredAt } = req.body;

      // Validasi input
      if (!name || !category) {
        const item = await prisma.item.findUnique({ where: { id } });
        return res.render("item_form", {
          item: { ...item, ...req.body },
          error: "Nama dan kategori harus diisi",
        });
      }

      // Update item
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
    } catch (error) {
      console.error("Update item error:", error);
      res.redirect("/items");
    }
  }

  /**
   * POST /items/:id/delete
   * Handle delete item
   */
  static async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string, 10);

      if (isNaN(id)) {
        return res.redirect("/items");
      }

      await prisma.item.delete({ where: { id } });
      res.redirect("/items");
    } catch (error) {
      console.error("Delete item error:", error);
      // Tetap redirect meskipun error
      res.redirect("/items");
    }
  }
}
