import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { fetchJson } from "../utils/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useChat } from "../context/ChatContext.jsx";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Messages() {
  const { user } = useAuth();
  const {
    socket,
    conversations,
    loadConversations,
    joinConversation,
    leaveConversation,
    sendMessage,
    markConversationRead,
  } = useChat();

  const query = useQuery();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(false);
  const [typingIndicator, setTypingIndicator] = useState(false);
  const messagesEndRef = useRef(null);

  const conversationIdQuery = query.get("conversationId");
  const participantIdQuery = query.get("userId");

  const displayedList = useMemo(() => {
    if (search.trim()) {
      return searchResults.map((user) => ({
        ...user,
        type: "search",
      }));
    }
    return conversations.map((conversation) => ({
      ...conversation,
      type: "conversation",
    }));
  }, [search, searchResults, conversations]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const loadMessages = useCallback(async (conversationId) => {
    if (!conversationId) return;
    setLoading(true);
    try {
      const data = await fetchJson(`/api/chat/messages/${conversationId}`);
      setMessages(data.messages || []);
      scrollToBottom();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [scrollToBottom]);

  const selectConversation = async (conversation) => {
    setSelectedConversation(conversation);
    await loadMessages(conversation.conversationId);
    joinConversation(conversation.conversationId);
    markConversationRead(conversation.conversationId);
  };

  const openConversationWithUser = useCallback(async (userToChat) => {
    try {
      const data = await fetchJson("/api/chat/create-conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantId: userToChat._id }),
      });
      const otherUser = data.conversation.participants.find(
        (participant) => participant._id?.toString() !== user?._id?.toString()
      );
      const conversation = {
        conversationId: data.conversation._id,
        otherUser,
        lastMessage: data.conversation.lastMessage,
        lastMessageAt: data.conversation.lastMessageAt,
        unreadCount: 0,
      };
      setSelectedConversation(conversation);
      await loadMessages(conversation.conversationId);
      joinConversation(conversation.conversationId);
      markConversationRead(conversation.conversationId);
      navigate(`/messages?conversationId=${conversation.conversationId}`, { replace: true });
    } catch (error) {
      console.error(error);
      alert(error.message || "Unable to open chat with this student.");
    }
  }, [joinConversation, loadMessages, markConversationRead, navigate, user]);

  useEffect(() => {
    if (!user) return;
    const loadInitialConversation = async () => {
      if (conversationIdQuery) {
        try {
          const data = await fetchJson(`/api/chat/conversation/${conversationIdQuery}`);
          const otherUser = data.conversation.participants.find(
            (participant) => participant._id?.toString() !== user._id?.toString()
          );
          const conversation = {
            conversationId: data.conversation._id,
            otherUser,
            lastMessage: data.conversation.lastMessage,
            lastMessageAt: data.conversation.lastMessageAt,
            unreadCount: 0,
          };
          setSelectedConversation(conversation);
          await loadMessages(conversation.conversationId);
          joinConversation(conversation.conversationId);
          markConversationRead(conversation.conversationId);
        } catch (error) {
          console.error(error);
        }
      } else if (participantIdQuery) {
        await openConversationWithUser({ _id: participantIdQuery });
      }
    };
    loadInitialConversation();
  }, [
    conversationIdQuery,
    participantIdQuery,
    user,
    loadMessages,
    joinConversation,
    markConversationRead,
    openConversationWithUser,
  ]);

  useEffect(() => {
    if (!search.trim()) {
      setSearchResults([]);
      return;
    }
    const timeout = setTimeout(async () => {
      try {
        const data = await fetchJson(`/api/users/search?q=${encodeURIComponent(search)}`);
        setSearchResults(data.users || []);
      } catch (error) {
        console.error(error);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (payload) => {
      if (selectedConversation?.conversationId === payload.conversationId) {
        setMessages((prev) => [...prev, payload.message]);
        markConversationRead(payload.conversationId);
      } else {
        loadConversations();
      }
    };

    const handleTyping = ({ conversationId, userId }) => {
      if (selectedConversation?.conversationId === conversationId && userId !== user?._id) {
        setTypingIndicator(true);
      }
    };

    const handleStopTyping = ({ conversationId, userId }) => {
      if (selectedConversation?.conversationId === conversationId && userId !== user?._id) {
        setTypingIndicator(false);
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("typing", handleTyping);
    socket.on("stopTyping", handleStopTyping);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("typing", handleTyping);
      socket.off("stopTyping", handleStopTyping);
    };
  }, [socket, selectedConversation, user, loadConversations, markConversationRead]);

  useEffect(() => {
    if (!selectedConversation) return;
    const conversationId = selectedConversation.conversationId;
    return () => {
      leaveConversation(conversationId);
    };
  }, [selectedConversation, leaveConversation]);

  const handleSend = async () => {
    if (!selectedConversation || !messageText.trim()) return;

    await sendMessage({
      conversationId: selectedConversation.conversationId,
      text: messageText.trim(),
      messageType: "text",
    });

    setMessageText("");
  };

  const handleTyping = (value) => {
    if (!selectedConversation || !socket) return;
    if (value) {
      socket.emit("typing", { conversationId: selectedConversation.conversationId });
    } else {
      socket.emit("stopTyping", { conversationId: selectedConversation.conversationId });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-10 grid gap-8 lg:grid-cols-[320px_1fr]">
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-3xl p-6 shadow-lg">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-2xl font-semibold">Messages</h2>
                <p className="text-gray-400 text-sm">Search students, open chats, and stay in touch.</p>
              </div>
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search students by name or roll number"
              className="w-full rounded-2xl border border-gray-700 bg-slate-800 p-3 text-white"
            />
            <div className="mt-4 space-y-3 max-h-[520px] overflow-y-auto">
              {displayedList.length === 0 ? (
                <p className="text-gray-400">Search for a student or select a conversation.</p>
              ) : (
                displayedList.map((item) => {
                  const isSelected = selectedConversation?.conversationId === item.conversationId;
                  return (
                    <button
                      key={item.type === "conversation" ? item.conversationId : item._id}
                      onClick={async () => {
                        if (item.type === "conversation") {
                          await selectConversation(item);
                        } else {
                          await openConversationWithUser(item);
                        }
                      }}
                      className={`w-full text-left rounded-2xl p-4 transition ${isSelected ? "bg-blue-600" : "bg-slate-800 hover:bg-slate-700"}`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h3 className="font-semibold">{item.type === "conversation" ? item.otherUser.name : item.name}</h3>
                          <p className="text-gray-400 text-sm">Roll: {item.type === "conversation" ? item.otherUser.rollNumber : item.rollNumber}</p>
                        </div>
                        <div className="text-right">
                          {item.type === "conversation" && item.lastMessageAt && (
                            <span className="text-xs text-gray-400">{new Date(item.lastMessageAt).toLocaleTimeString()}</span>
                          )}
                          {item.type === "conversation" && item.unreadCount > 0 && (
                            <span className="ml-2 inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-rose-500 px-2 text-xs font-semibold text-white">
                              {item.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                      {item.type === "conversation" && item.lastMessage && (
                        <p className="text-gray-400 text-sm mt-2 truncate">{item.lastMessage}</p>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="bg-slate-900 rounded-3xl p-6 shadow-lg flex flex-col h-[calc(100vh-120px)]">
          <div className="border-b border-slate-700 pb-4 mb-4">
            <h2 className="text-2xl font-semibold">{selectedConversation ? selectedConversation.otherUser.name : "Select a student"}</h2>
            <p className="text-gray-400 text-sm">
              {selectedConversation
                ? `Roll: ${selectedConversation.otherUser.rollNumber}`
                : "Open a conversation to chat."}
            </p>
            {typingIndicator && <p className="text-sm text-emerald-400 mt-2">Typing…</p>}
          </div>
          <div className="flex-1 overflow-auto space-y-4 mb-4">
            {loading ? (
              <p className="text-gray-400">Loading chat...</p>
            ) : selectedConversation ? (
              messages.length === 0 ? (
                <p className="text-gray-400">No messages yet. Send the first one.</p>
              ) : (
                messages.map((message) => {
                  const isMine = message.senderId?._id === user?._id;
                  return (
                    <div key={message._id} className={`max-w-[85%] ${isMine ? "ml-auto bg-blue-600 text-white" : "bg-slate-800 text-gray-200"} rounded-3xl p-4`}>
                      <p className="text-sm whitespace-pre-line">{message.text}</p>
                      <div className="mt-2 flex items-center justify-between text-xs text-gray-300">
                        <span>{new Date(message.createdAt).toLocaleString()}</span>
                        {isMine && <span>{message.readStatus ? "Seen" : "Sent"}</span>}
                      </div>
                    </div>
                  );
                })
              )
            ) : (
              <p className="text-gray-400">Select a user to start chatting.</p>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="mt-auto">
            <div className="flex gap-3">
              <input
                value={messageText}
                onChange={(e) => {
                  setMessageText(e.target.value);
                  handleTyping(true);
                }}
                onBlur={() => handleTyping(false)}
                placeholder="Type your message..."
                className="flex-1 rounded-2xl border border-gray-700 bg-slate-800 p-3 text-white"
                disabled={!selectedConversation}
              />
              <button
                onClick={handleSend}
                disabled={!selectedConversation || !messageText.trim()}
                className="rounded-2xl bg-blue-600 px-6 py-3 font-semibold transition disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
