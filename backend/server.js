import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { Server as SocketServer } from "socket.io";
import * as metrics from "./metrics/metrics.js";
import metricsMiddleware from "./middleware/metricsMiddleware.js";
import jwt from "jsonwebtoken";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import issueRoutes from "./routes/issueRoutes.js";
import Conversation from "./models/Conversation.js";
import Message from "./models/Message.js";

dotenv.config();
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: ".env.local", override: true });
}

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB();

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
const localFrontendOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];
const allowedOrigins = new Set([
  frontendUrl.replace(/\/$/, ""),
  ...(process.env.NODE_ENV === "production" ? [] : localFrontendOrigins),
]);
const corsOptions = {
  origin(origin, callback) {
    // Requests made outside a browser (health checks, curl) have no Origin.
    if (
      !origin ||
      allowedOrigins.has(origin) ||
      (origin && origin.endsWith(".vercel.app")) ||
      (origin && origin.endsWith(".onrender.com"))
    ) {
      return callback(null, true);
    }
    return callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },
  credentials: true,
};

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Metrics middleware
app.use(metricsMiddleware);

// Expose Prometheus metrics
app.get("/metrics", async (req, res) => {
  try {
    res.set("Content-Type", metrics.metricsRegistry.contentType);
    res.end(await metrics.metricsRegistry.metrics());
  } catch (err) {
    res.status(500).send("Failed to collect metrics");
  }
});

app.use("/api/auth", authRoutes);
app.use("/api", reportRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send({ status: "ok", message: "Lost & Found backend is running" });
});

const httpServer = createServer(app);
const io = new SocketServer(httpServer, {
  cors: corsOptions,
});

const connectedUsers = new Map();

const parseCookies = (cookieHeader = "") =>
  cookieHeader.split(";").reduce((cookies, pair) => {
    const [name, ...value] = pair.split("=");
    if (!name || value.length === 0) return cookies;
    cookies[name.trim()] = decodeURIComponent(value.join("=").trim());
    return cookies;
  }, {});

io.use((socket, next) => {
  try { metrics.socketConnectionAttempts.inc(); } catch (e) {}
  
  const cookies = parseCookies(socket.handshake.headers.cookie || "");
  const token = cookies.token || socket.handshake.auth?.token;
  if (!token) {
    try { metrics.socketConnectionFailures.inc({ reason: "token_missing" }); } catch (e) {}
    return next(new Error("Authentication error: token missing"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    return next();
  } catch (_error) {
    try { metrics.socketConnectionFailures.inc({ reason: "invalid_token" }); } catch (e) {}
    return next(new Error("Authentication error: invalid token"));
  }
});

io.on("connection", (socket) => {
  const userId = socket.userId;
  if (!userId) {
    try { metrics.socketConnectionFailures.inc({ reason: "missing_user_id" }); } catch (e) {}
    return socket.disconnect(true);
  }

  try {
    metrics.socketConnectionSuccess.inc();
    metrics.activeSocketConnections.inc();
  } catch (e) {}

  const sockets = connectedUsers.get(userId) || new Set();
  sockets.add(socket.id);
  connectedUsers.set(userId, sockets);

  socket.join(`user_${userId}`);

  socket.on("joinConversation", ({ conversationId }) => {
    if (conversationId) {
      socket.join(`conversation_${conversationId}`);
    }
  });

  socket.on("leaveConversation", ({ conversationId }) => {
    if (conversationId) {
      socket.leave(`conversation_${conversationId}`);
    }
  });

  socket.on("typing", ({ conversationId }) => {
    try { metrics.socketTypingEvents.inc({ type: "start" }); } catch (e) {}
    if (conversationId) {
      socket.to(`conversation_${conversationId}`).emit("typing", {
        conversationId,
        userId,
      });
    }
  });

  socket.on("stopTyping", ({ conversationId }) => {
    try { metrics.socketTypingEvents.inc({ type: "stop" }); } catch (e) {}
    if (conversationId) {
      socket.to(`conversation_${conversationId}`).emit("stopTyping", {
        conversationId,
        userId,
      });
    }
  });

  socket.on("sendMessage", async ({ conversationId, text, messageType = "text", attachments = [], clientTimestamp }, ack) => {
    try {
      try { metrics.socketMessagesReceived.inc(); } catch (e) {}
      const start = process.hrtime();
      if (!conversationId || !text) {
        if (typeof ack === "function") ack({ error: "Missing conversationId or text" });
        return;
      }

      const conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        if (typeof ack === "function") ack({ error: "Conversation not found" });
        return;
      }
      if (!conversation.participants.some((participant) => participant.toString() === userId.toString())) {
        if (typeof ack === "function") ack({ error: "Unauthorized for this conversation" });
        return;
      }

      const receiverId = conversation.participants.find((participant) => participant.toString() !== userId.toString());
      if (!receiverId) {
        if (typeof ack === "function") ack({ error: "Receiver not found" });
        return;
      }

      const message = await Message.create({
        conversationId,
        senderId: userId,
        receiverId,
        text,
        messageType,
        attachments,
        readStatus: false,
      });

      conversation.lastMessage = text;
      conversation.lastMessageSender = userId;
      conversation.lastMessageAt = new Date();
      await conversation.save();

      const populatedMessage = await message.populate("senderId", "name rollNumber");
      const payload = {
        message: populatedMessage,
        conversationId,
        clientTimestamp: clientTimestamp || Date.now(),
        serverTimestamp: Date.now(),
      };

      io.to(`conversation_${conversationId}`).emit("receiveMessage", payload);
      io.to(`user_${receiverId}`).emit("newMessage", payload);

      const diff = process.hrtime(start);
      const processingSeconds = diff[0] + diff[1] / 1e9;
      try {
        metrics.messageDeliveryLatency.observe(processingSeconds);
        metrics.socketMessagesDelivered.inc();
      } catch (e) {}

      if (typeof ack === "function") {
        ack({
          status: "ok",
          messageId: message._id,
          serverProcessingMs: (processingSeconds * 1000).toFixed(2),
        });
      }
    } catch (error) {
      console.error("Socket sendMessage error", error);
      if (typeof ack === "function") ack({ error: "Server error processing message" });
    }
  });

  socket.on("messageDeliveredReceipt", ({ clientSendTimestamp }) => {
    try {
      if (clientSendTimestamp) {
        const e2eSeconds = (Date.now() - clientSendTimestamp) / 1000;
        if (e2eSeconds >= 0 && e2eSeconds < 60) {
          metrics.messageEndToEndLatency.observe(e2eSeconds);
        }
      }
    } catch (e) {}
  });

  socket.on("messageSeen", async ({ conversationId }) => {
    try {
      try { metrics.socketReadReceiptEvents.inc(); } catch (e) {}
      if (!conversationId) return;
      await Message.updateMany(
        { conversationId, receiverId: userId, readStatus: false },
        { readStatus: true }
      );
      socket.to(`conversation_${conversationId}`).emit("messageSeen", { conversationId, userId });
    } catch (error) {
      console.error("Socket messageSeen error", error);
    }
  });

  socket.on("disconnect", () => {
    const currentSockets = connectedUsers.get(userId);
    if (currentSockets) {
      currentSockets.delete(socket.id);
      if (currentSockets.size === 0) {
        connectedUsers.delete(userId);
      } else {
        connectedUsers.set(userId, currentSockets);
      }
    }
    try {
      metrics.socketDisconnects.inc();
      metrics.activeSocketConnections.dec();
    } catch (e) {}
  });
});

app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Unexpected server error" });
});

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
