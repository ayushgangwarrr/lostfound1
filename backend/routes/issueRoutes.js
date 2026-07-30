import express from "express";
import multer from "multer";
import { createIssueReport } from "../controllers/issueController.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("screenshot"), createIssueReport);

export default router;
