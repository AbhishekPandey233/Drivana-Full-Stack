import { Router } from "express";
import { createRenting, getMyRentings, extendRenting, decreaseRenting, cancelRenting } from "../controllers/rentingController";
import { requireAuth } from "../middleware/authMiddleware";

const router = Router();

// Protect both routes using authorization middleware
router.post("/", requireAuth, createRenting);
router.get("/my-rentings", requireAuth, getMyRentings);
router.put("/:id/extend", requireAuth, extendRenting);
router.put("/:id/decrease", requireAuth, decreaseRenting);
router.delete("/:id/cancel", requireAuth, cancelRenting);

export default router;