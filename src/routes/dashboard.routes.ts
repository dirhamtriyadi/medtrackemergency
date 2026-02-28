import { Router } from "express";
import { DashboardController } from "../controllers/dashboard.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

// Dashboard route
router.get("/dashboard", requireAuth, DashboardController.showDashboard);

export default router;
