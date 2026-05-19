import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { searchUsers } from "../controllers/messageController.js";

const router = express.Router();

router.get("/search", requireAuth, searchUsers);

export default router;
