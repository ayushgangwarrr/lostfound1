import express from "express";
import { signup, login, getProfile, logout } from "../controllers/authController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", requireAuth, logout);
router.get("/profile", requireAuth, getProfile);

export default router;
