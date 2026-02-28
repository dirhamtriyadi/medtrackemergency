import { NextFunction, Request, Response } from "express";

/**
 * Middleware untuk memastikan user sudah login
 * Redirect ke /login jika belum authenticate
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
}

/**
 * Middleware untuk redirect ke dashboard jika sudah login
 * Berguna untuk halaman login agar user yang sudah login tidak bisa akses
 */
export function redirectIfAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.session.user) {
    return res.redirect("/dashboard");
  }
  next();
}

/**
 * Middleware untuk attach user info ke res.locals
 * Agar bisa diakses di semua views
 */
export function attachUserToLocals(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  res.locals.user = req.session.user || null;
  next();
}
