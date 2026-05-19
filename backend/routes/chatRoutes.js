import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  createConversation,
  getConversations,
  getConversationById,
  getMessagesForConversation,
  sendMessage,
  markConversationRead,
  deleteConversation,
} from "../controllers/messageController.js";

const router = express.Router();

router.post("/create-conversation", requireAuth, createConversation);
router.get("/conversations", requireAuth, getConversations);
router.get("/conversation/:id", requireAuth, getConversationById);
router.get("/messages/:conversationId", requireAuth, getMessagesForConversation);
router.post("/send-message", requireAuth, sendMessage);
router.put("/mark-read/:conversationId", requireAuth, markConversationRead);
router.delete("/conversation/:id", requireAuth, deleteConversation);

export default router;
