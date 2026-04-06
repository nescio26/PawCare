import express from "express";
import * as ownerController from "./owner.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { restrictTo } from "../../middlewares/role.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/", ownerController.getAllOwners);
router.get("/:id", ownerController.getOwnerById);
router.post("/", restrictTo("admin", "staff"), ownerController.createOwner);
router.put("/:id", restrictTo("admin", "staff"), ownerController.updateOwner);
router.delete("/:id", restrictTo("admin"), ownerController.deleteOwner);

export default router;
