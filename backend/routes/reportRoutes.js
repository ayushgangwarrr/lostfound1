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

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/\s+/g, "-").toLowerCase();
    cb(null, `${timestamp}-${safeName}`);
  },
});

const upload = multer({ storage });

router.post("/report", requireAuth, upload.single("image"), createReport);
router.get("/reports", getReports);
router.get("/reports/user", requireAuth, getMyReports);
router.get("/reports/:id", getReportById);
router.put("/report/:id", requireAuth, upload.single("image"), updateReport);
router.delete("/report/:id", requireAuth, deleteReport);

export default router;
