import { Router } from "express";
import { createRenting, getMyRentings, extendRenting, decreaseRenting, cancelRenting, getAllRentings, adminCancelRenting } from "../controllers/rentingController";
import { requireAuth } from "../middleware/authMiddleware";
import { requireAdmin } from "../middleware/adminMiddleware";

const router = Router();

// Protect both routes using authorization middleware
router.post("/", requireAuth, createRenting);
router.get("/my-rentings", requireAuth, getMyRentings);
router.put("/:id/extend", requireAuth, extendRenting);
router.put("/:id/decrease", requireAuth, decreaseRenting);
router.delete("/:id/cancel", requireAuth, cancelRenting);

// Admin routes
router.get("/admin/all", requireAdmin, getAllRentings);
router.delete("/admin/:id/cancel", requireAdmin, adminCancelRenting);

export default router;