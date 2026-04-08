import express from "express";
import * as analyticsController from "./analytics.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { restrictTo } from "../../middlewares/role.middleware.js";

const router = express.Router();

router.use(protect, restrictTo("admin"));

router.get("/overview", analyticsController.getOverview);
router.get("/visits", analyticsController.getVisitStats);
router.get("/species", analyticsController.getSpeciesStats);
router.get("/vets", analyticsController.getVetStats);
router.get("/queue", analyticsController.getQueueStats);
router.get("/diagnoses", analyticsController.getTopDiagnoses);

export default router;
