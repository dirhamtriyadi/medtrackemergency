import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { prisma } from "../db";

export class AuthController {
  /**
   * GET /login
   * Tampilkan halaman login
   */
  static showLoginPage(req: Request, res: Response) {
    res.render("login");
  }

  /**
   * POST /login
   * Handle login form submission
   */
  static async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      // Validasi input
      if (!username || !password) {
        return res.render("login", {
          error: "Username dan password harus diisi",
        });
      }

      // Cari user
      const user = await prisma.user.findUnique({ where: { username } });
      if (!user) {
        return res.render("login", { error: "User tidak ditemukan" });
      }

      // Verifikasi password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.render("login", { error: "Password salah" });
      }

      // Set session
      req.session.user = {
        id: user.id,
        name: user.name,
        role: user.role,
      };

      // Redirect ke dashboard
      res.redirect("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      res.render("login", { error: "Terjadi kesalahan, silakan coba lagi" });
    }
  }

  /**
   * POST /logout
   * Handle logout
   */
  static logout(req: Request, res: Response) {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
      }
      res.redirect("/login");
    });
  }
}
