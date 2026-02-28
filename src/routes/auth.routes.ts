import bcrypt from "bcrypt";
import { Router } from "express";
import { prisma } from "../db"; // ✅ pakai singleton

const router = Router();

router.get("/login", (req, res) => res.render("login"));

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return res.render("login", { error: "User tidak ditemukan" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.render("login", { error: "Password salah" });

  req.session.user = { id: user.id, name: user.name, role: user.role };
  res.redirect("/dashboard");
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/login"));
});

export default router;
