import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { redirectIfAuthenticated } from "../middlewares/auth.middleware";

const router = Router();

// Auth routes
router.get("/login", redirectIfAuthenticated, AuthController.showLoginPage);
router.get("/", redirectIfAuthenticated, AuthController.showLoginPage);
router.post("/login", AuthController.login);
router.post("/logout", AuthController.logout);

export default router;
