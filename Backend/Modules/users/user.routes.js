import express from "express";
import * as userController from "./user.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { restrictTo } from "../../middlewares/role.middleware.js";

const router = express.Router();

router.use(protect, restrictTo("admin"));

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deactivateUser);
router.put("/:id/password", userController.changeUserPassword);

export default router;
