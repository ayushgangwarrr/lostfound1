import express from "express";
import multer from "multer";
import {
  createReport,
  getReports,
  getReportById,
  updateReport,
  deleteReport,
  getMyReports,
} from "../controllers/reportController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/report", requireAuth, upload.single("image"), createReport);
router.get("/reports", getReports);
router.get("/reports/user", requireAuth, getMyReports);
router.get("/reports/:id", getReportById);
router.put("/report/:id", requireAuth, upload.single("image"), updateReport);
router.delete("/report/:id", requireAuth, deleteReport);

export default router;
