import express from "express";
import * as petController from "./pet.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { restrictTo } from "../../middlewares/role.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/owner/:ownerId", petController.getPetsByOwner);

router.get("/", petController.getAllPets);
router.get("/:id", petController.getPetById);
router.post("/", restrictTo("admin", "staff"), petController.createPet);
router.put("/:id", restrictTo("admin", "staff"), petController.updatePet);
router.delete("/:id", restrictTo("admin"), petController.deletePet);

export default router;
