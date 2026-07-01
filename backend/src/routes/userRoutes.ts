import { Router } from "express";
import { getAllUsers, getUserById, deleteUser, createUser, updateUser } from "../controllers/userController";
import { requireAdmin } from "../middleware/adminMiddleware";

const router = Router();

// Admin-only backend routes
router.get("/", requireAdmin, getAllUsers);
router.get("/:id", requireAdmin, getUserById);
router.post("/", requireAdmin, createUser); 
router.put("/:id", requireAdmin, updateUser);
router.delete("/:id", requireAdmin, deleteUser);

export default router;