import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import createSocket from "../utils/socket.js";
import { fetchJson } from "../utils/api.js";
import { useAuth } from "./AuthContext.jsx";

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [typingState, setTypingState] = useState({});

  const loadConversations = useCallback(async () => {
    if (!user) return;
    try {
      const data = await fetchJson("/api/chat/conversations");
      setConversations(data.conversations || []);
      setUnreadCount((data.conversations || []).reduce((sum, conv) => sum + (conv.unreadCount || 0), 0));
    } catch (error) {
      console.error(error);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const socketClient = createSocket();

    socketClient.on("connect", () => {
      console.log("Chat socket connected");
      setSocket(socketClient);
      loadConversations();
    });

    socketClient.on("receiveMessage", () => {
      loadConversations();
    });

    socketClient.on("newMessage", () => {
      loadConversations();
    });

    socketClient.on("typing", ({ conversationId, userId }) => {
      setTypingState((prev) => ({ ...prev, [conversationId]: userId }));
    });

    socketClient.on("stopTyping", ({ conversationId }) => {
      setTypingState((prev) => {
        const next = { ...prev };
        delete next[conversationId];
        return next;
      });
    });

    socketClient.on("messageSeen", () => {
      loadConversations();
    });

    return () => {
      socketClient.disconnect();
      setSocket(null);
    };
  }, [user, loadConversations]);

  const joinConversation = useCallback((conversationId) => {
    if (!socket || !conversationId) return;
    socket.emit("joinConversation", { conversationId });
  }, [socket]);

  const leaveConversation = useCallback((conversationId) => {
    if (!socket || !conversationId) return;
    socket.emit("leaveConversation", { conversationId });
  }, [socket]);

  const sendMessage = useCallback(async (payload) => {
    if (socket && socket.connected) {
      socket.emit("sendMessage", payload);
    } else {
      await fetchJson("/api/chat/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      loadConversations();
    }
  }, [socket, loadConversations]);

  const markConversationRead = useCallback(async (conversationId) => {
    if (!conversationId) return;
    try {
      await fetchJson(`/api/chat/mark-read/${conversationId}`, { method: "PUT" });
      loadConversations();
      if (socket) {
        socket.emit("messageSeen", { conversationId });
      }
    } catch (error) {
      console.error(error);
    }
  }, [socket, loadConversations]);

  const value = useMemo(
    () => ({
      socket,
      conversations: user ? conversations : [],
      unreadCount: user ? unreadCount : 0,
      typingState,
      loadConversations,
      joinConversation,
      leaveConversation,
      sendMessage,
      markConversationRead,
    }),
    [
      socket,
      user,
      conversations,
      unreadCount,
      typingState,
      loadConversations,
      joinConversation,
      leaveConversation,
      sendMessage,
      markConversationRead,
    ]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  return useContext(ChatContext);
}
