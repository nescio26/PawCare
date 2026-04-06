import express from "express";
import * as visitController from "./visit.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { restrictTo } from "../../middlewares/role.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/today", visitController.getTodayVisits);
router.get("/pet/:petId", visitController.getVisitsByPet);
router.get("/:id", visitController.getVisitById);
router.post("/", restrictTo("admin", "staff"), visitController.createVisit);
router.put(
  "/:id/status",
  restrictTo("admin", "vet"),
  visitController.updateVisitStatus,
);
router.put(
  "/:id/cancel",
  restrictTo("admin", "staff"),
  visitController.cancelVisit,
);

export default router;
