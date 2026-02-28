import { Router } from "express";
import { ItemsController } from "../controllers/items.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

// Items routes
router.get("/", requireAuth, ItemsController.index);
router.get("/new", requireAuth, ItemsController.showCreateForm);
router.post("/new", requireAuth, ItemsController.create);
router.get("/:id/edit", requireAuth, ItemsController.showEditForm);
router.post("/:id/edit", requireAuth, ItemsController.update);
router.post("/:id/delete", requireAuth, ItemsController.delete);

export default router;
