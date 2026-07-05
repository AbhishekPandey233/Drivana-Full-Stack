import { Router } from "express";
import { createRenting, getMyRentings } from "../controllers/rentingController";
import { requireAuth } from "../middleware/authMiddleware";

const router = Router();

// Protect both routes using authorization middleware
router.post("/", requireAuth, createRenting);
router.get("/my-rentings", requireAuth, getMyRentings);

export default router;