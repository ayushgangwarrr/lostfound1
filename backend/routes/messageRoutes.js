import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { searchUsers, getConversations, getMessagesForConversation, sendMessage } from "../controllers/messageController.js";

const router = express.Router();

router.get("/users/search", requireAuth, searchUsers);
router.get("/conversations", requireAuth, getConversations);
router.get("/chat/:conversationId", requireAuth, getMessagesForConversation);
router.post("/", requireAuth, sendMessage);

export default router;
