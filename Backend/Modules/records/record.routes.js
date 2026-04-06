import express from "express";
import * as recordController from "./record.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { restrictTo } from "../../middlewares/role.middleware.js";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|pdf/;
    const valid = allowed.test(path.extname(file.originalname).toLowerCase());
    if (valid) cb(null, true);
    else cb(new Error("Only jpeg, jpg, png, pdf files are allowed"));
  },
});

const router = express.Router();

router.use(protect);

router.post("/", restrictTo("admin", "vet"), recordController.createRecord);
router.get("/pet/:petId", recordController.getRecordsByPet);
router.get("/visit/:visitId", recordController.getRecordByVisit);
router.get("/:id", recordController.getRecordById);
router.put("/:id", restrictTo("admin", "vet"), recordController.updateRecord);
router.post(
  "/:id/attachment",
  restrictTo("admin", "vet"),
  upload.single("file"),
  recordController.addAttachment,
);

export default router;
