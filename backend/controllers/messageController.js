import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

const getOtherParticipant = (conversation, userId) => {
  return conversation.participants.find((participant) => participant._id.toString() !== userId.toString());
};

export const searchUsers = async (req, res) => {
  try {
    const query = (req.query.q || "").trim();
    if (!query) {
      return res.status(200).json({ users: [] });
    }

    const regex = new RegExp(query, "i");
    const users = await User.find({
      _id: { $ne: req.user._id },
      $or: [{ name: regex }, { rollNumber: regex }, { email: regex }],
    })
      .select("_id name rollNumber phone")
      .limit(20);

    return res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error searching users" });
  }
};

export const createConversation = async (req, res) => {
  try {
    const { participantId } = req.body;
    if (!participantId) {
      return res.status(400).json({ message: "Participant ID is required" });
    }
    if (participantId === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot create a conversation with yourself" });
    }

    const participant = await User.findById(participantId).select("name rollNumber phone");
    if (!participant) {
      return res.status(404).json({ message: "Participant not found" });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, participantId] },
    }).populate("participants", "name rollNumber phone");

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user._id, participantId],
        lastMessage: "",
        lastMessageSender: null,
        lastMessageAt: Date.now(),
      });
      conversation = await Conversation.findById(conversation._id).populate("participants", "name rollNumber phone");
    }

    return res.status(200).json({ conversation });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error creating conversation" });
  }
};

export const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({ participants: req.user._id })
      .sort({ lastMessageAt: -1 })
      .populate("participants", "name rollNumber phone");

    const result = await Promise.all(
      conversations.map(async (conversation) => {
        const otherUser = getOtherParticipant(conversation, req.user._id);
        const unreadCount = await Message.countDocuments({
          conversationId: conversation._id,
          receiverId: req.user._id,
          readStatus: false,
        });

        return {
          conversationId: conversation._id,
          otherUser,
          lastMessage: conversation.lastMessage,
          lastMessageSender: conversation.lastMessageSender,
          lastMessageAt: conversation.lastMessageAt,
          unreadCount,
        };
      })
    );

    return res.status(200).json({ conversations: result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error loading conversations" });
  }
};

export const getConversationById = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id).populate("participants", "name rollNumber phone");
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    if (!conversation.participants.some((participant) => participant._id.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: "Access denied" });
    }

    return res.status(200).json({ conversation });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error loading conversation" });
  }
};

export const getMessagesForConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 50, 100);

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    if (!conversation.participants.some((participant) => participant.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: "Access denied" });
    }

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("senderId", "name rollNumber")
      .populate("receiverId", "name rollNumber");

    return res.status(200).json({ messages, page, limit });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error loading messages" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { conversationId, text, messageType = "text", attachments = [] } = req.body;

    if (!conversationId || !text) {
      return res.status(400).json({ message: "Conversation and message text are required" });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    if (!conversation.participants.some((participant) => participant.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: "Access denied" });
    }

    const receiverId = conversation.participants.find((participant) => participant.toString() !== req.user._id.toString());
    if (!receiverId) {
      return res.status(400).json({ message: "No valid receiver found" });
    }

    const message = await Message.create({
      conversationId,
      senderId: req.user._id,
      receiverId,
      text,
      messageType,
      attachments,
      readStatus: false,
    });

    conversation.lastMessage = text;
    conversation.lastMessageSender = req.user._id;
    conversation.lastMessageAt = new Date();
    await conversation.save();

    return res.status(201).json({ message, conversation });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error sending message" });
  }
};

export const markConversationRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    if (!conversation.participants.some((participant) => participant.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: "Access denied" });
    }

    await Message.updateMany(
      { conversationId, receiverId: req.user._id, readStatus: false },
      { readStatus: true }
    );

    return res.status(200).json({ message: "Messages marked as read" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error marking messages read" });
  }
};

export const deleteConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    if (!conversation.participants.some((participant) => participant.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: "Access denied" });
    }

    await Message.deleteMany({ conversationId: id });
    await conversation.deleteOne();

    return res.status(200).json({ message: "Conversation deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error deleting conversation" });
  }
};
