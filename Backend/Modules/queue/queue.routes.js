import express from "express";
import * as queueController from "./queue.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { restrictTo } from "../../middlewares/role.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/live", queueController.getLiveQueue);
router.delete("/reset", restrictTo("admin"), queueController.resetQueue);

export default router;
