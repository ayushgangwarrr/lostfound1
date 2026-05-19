import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/adminMiddleware.js";
import { getUsers, deleteUser, getAllReports } from "../controllers/adminController.js";

const router = express.Router();

router.use(requireAuth);
router.use(requireAdmin);

router.get("/users", getUsers);
router.delete("/users/:id", deleteUser);
router.get("/reports", getAllReports);

export default router;
