import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { restrictTo } from "../../middlewares/role.middleware.js";
import {
  summary,
  visitTrends,
  queueStats,
  topBreedsAndDiagnoses,
  growthOverTime,
} from "./analytics.controller.js";

const router = express.Router();

// Apply authentication to all routes
router.use(protect);

// Analytics routes (accessible by admin and vet)
router.get("/summary", restrictTo("admin", "vet"), summary);
router.get("/visits", restrictTo("admin", "vet"), visitTrends);
router.get("/queue", restrictTo("admin", "vet"), queueStats);
router.get("/top", restrictTo("admin", "vet"), topBreedsAndDiagnoses);
router.get("/growth", restrictTo("admin", "vet"), growthOverTime);

export default router;
