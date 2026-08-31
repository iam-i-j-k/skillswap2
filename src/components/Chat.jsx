import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext";

import {
  useGetChatHistoryQuery,
  useClearChatMutation,
} from "../services/chatApi";
import { useGetUserQuery } from "../services/usersApi";

import MessageList from "./chat/MessageList";
import MessageInput from "./chat/MessageInput";
import EmojiPicker from "./chat/EmojiPicker";
import ResourceModal from "./chat/ResourceModal";
import SwapModal from "./chat/SwapModal";

import {
  ArrowLeft,
  Moon,
  MoreVertical,
  Phone,
  PhoneOff,
  Sun,
  Trash2,
  Video,
  VideoOff,
  Mic,
  MicOff,
} from "lucide-react";
import { useWebRTC } from "../webrtc/useWebRTC";

const Chat = () => {
  const { id: chatUserId } = useParams();
  const currentUser = useSelector((state) => state.auth.user);
  const { socket, isConnected } = useSocket();
  const navigate = useNavigate();

  const roomName = `SkillSwap-${[currentUser._id, chatUserId].sort().join("-")}`;

  const [messages, setMessages] = useState([]);
  const [recipient, setRecipient] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState("");
  const [activeModal, setActiveModal] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [editing, setEditing] = useState(null);
  const [editText, setEditText] = useState("");
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const {
    stream,
    remoteStream,
    callUser,
    callUserAudio,
    answerCall,
    endCall,
    incomingCall,
    setIncomingCall,
    isCallActive,
    callStatus,
    callType,
    localVideoRef,
    remoteVideoRef,
  } = useWebRTC(socket, currentUser?._id, chatUserId);

  const typingTimeout = useRef();

  // Load history
  const { data, refetch } = useGetChatHistoryQuery(chatUserId, {
    skip: !chatUserId,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const { data: userData } = useGetUserQuery(chatUserId, { skip: !chatUserId });

  useEffect(() => { if (chatUserId) refetch(); }, [chatUserId]);

  useEffect(() => {
    if (data?.messages) {
      setMessages(data.messages);
      setRecipient((prev) => ({
        ...(data.recipient || prev),
        ...(userData?.user || {}),
      }));
    }
  }, [data, userData]);

  // Dark mode sync
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [darkMode]);

  // Socket events
  useEffect(() => {
    if (!socket || !isConnected || !currentUser?._id || !chatUserId) return;

    const onReceiveMessage = (msg) => {
      const belongs =
        (msg.sender === chatUserId && msg.recipient === currentUser._id) ||
        (msg.sender === currentUser._id && msg.recipient === chatUserId);
      if (!belongs) return;
      setMessages((prev) => [...prev, msg]);
      if (msg.recipient === currentUser._id) {
        socket.emit("markAsDelivered", { userId: currentUser._id, chatUserId });
        socket.emit("markAsSeen", { userId: currentUser._id, chatUserId });
      }
    };
    const onTyping = ({ from }) => { if (from === chatUserId) setIsTyping(true); };
    const onStopTyping = ({ from }) => { if (from === chatUserId) setIsTyping(false); };
    const onMessageDeleted = ({ messageId }) => setMessages((prev) => prev.filter((m) => m._id !== messageId));
    const onMessageEdited = ({ message }) => setMessages((prev) => prev.map((m) => (m._id === message._id ? message : m)));
    const onChatCleared = ({ chatUserId: cleared }) => { if (cleared === chatUserId) setMessages([]); };
    const onDelivered = ({ updatedMessages }) =>
      setMessages((prev) => prev.map((m) => { const f = updatedMessages.find((u) => u._id === m._id); return f ? { ...m, delivered: true } : m; }));
    const onSeen = ({ updatedMessages }) =>
      setMessages((prev) => prev.map((m) => { const f = updatedMessages.find((u) => u._id === m._id); return f ? { ...m, seen: true } : m; }));

    socket.on("receiveMessage", onReceiveMessage);
    socket.on("typing", onTyping);
    socket.on("stopTyping", onStopTyping);
    socket.on("messageDeleted", onMessageDeleted);
    socket.on("messageEdited", onMessageEdited);
    socket.on("chatCleared", onChatCleared);
    socket.on("messagesDelivered", onDelivered);
    socket.on("messagesSeen", onSeen);

    return () => {
      socket.off("receiveMessage", onReceiveMessage);
      socket.off("typing", onTyping);
      socket.off("stopTyping", onStopTyping);
      socket.off("messageDeleted", onMessageDeleted);
      socket.off("messageEdited", onMessageEdited);
      socket.off("chatCleared", onChatCleared);
      socket.off("messagesDelivered", onDelivered);
      socket.off("messagesSeen", onSeen);
    };
  }, [socket, isConnected, currentUser?._id, chatUserId]);

  const sendMessage = (text) => {
    if (!socket || !isConnected) return;
    socket.emit("sendMessage", { sender: currentUser._id, recipient: chatUserId, text });
  };

  const handleDelete = (id) => {
    if (!socket || !isConnected) return;
    socket.emit("deleteMessage", { messageId: id });
  };

  const handleEdit = (id, newText) => {
    if (!socket || !isConnected) return;
    socket.emit("editMessage", { messageId: id, userId: currentUser._id, newText });
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (!socket || !isConnected) return;
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    socket.emit("typing", { from: currentUser._id, to: chatUserId });
    typingTimeout.current = setTimeout(() => {
      socket.emit("stopTyping", { from: currentUser._id, to: chatUserId });
    }, 800);
  };

  const [clearChat] = useClearChatMutation();
  const handleClearChat = async () => {
    if (!window.confirm("Delete all messages in this chat?")) return;
    await clearChat(chatUserId).unwrap();
    if (socket && isConnected) socket.emit("clearChat", { userId: currentUser._id, chatUserId });
    setMenuOpen(false);
  };

  if (!socket || !isConnected) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-100 dark:bg-[#0B141A]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-gray-700 dark:text-gray-300">Connecting to chat server...</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Please wait while we establish the connection</p>
          <button onClick={() => navigate("/")} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col bg-gray-100 text-gray-900 dark:bg-[#0B141A] dark:text-white">

      {/* ── HEADER ─────────────────────────────────────────── */}
      <div className="h-16 px-4 flex items-center justify-between bg-white border-b border-gray-200 dark:bg-[#202C33] dark:border-[#2F3B43] flex-shrink-0">

        {/* Left: back + avatar + name */}
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/")} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl">
            <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-white" />
          </button>
          {recipient?.avatar ? (
            <img src={recipient.avatar} alt={recipient.username} className="w-9 h-9 rounded-full object-cover" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium text-sm">
              {recipient?.username?.charAt(0)?.toUpperCase() || "U"}
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-900 dark:text-white leading-tight">{recipient?.username || "User"}</p>
            <p className="text-xs text-blue-500 dark:text-blue-400">{isTyping ? "typing..." : "online"}</p>
          </div>
        </div>

        {/* Right: audio call + video call + three-dot menu */}
        <div className="flex items-center gap-1">
          {/* Audio call */}
          <button
            onClick={() => { if (socket && isConnected) callUserAudio(); else alert("Please wait for connection"); }}
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl"
            title="Audio Call"
          >
            <Phone className="w-5 h-5 text-gray-700 dark:text-white" />
          </button>

          {/* Video call */}
          <button
            onClick={() => { if (socket && isConnected) callUser(); else alert("Please wait for connection"); }}
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl"
            title="Video Call"
          >
            <Video className="w-5 h-5 text-gray-700 dark:text-white" />
          </button>

          {/* Three-dot menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl"
              title="More options"
            >
              <MoreVertical className="w-5 h-5 text-gray-700 dark:text-white" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden">
                {/* Theme toggle */}
                <button
                  onClick={() => { setDarkMode((v) => !v); setMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition"
                >
                  {darkMode
                    ? <Sun className="w-4 h-4 text-yellow-400" />
                    : <Moon className="w-4 h-4 text-gray-500" />}
                  {darkMode ? "Light mode" : "Dark mode"}
                </button>

                {/* Delete chat */}
                <button
                  onClick={handleClearChat}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition border-t border-gray-100 dark:border-slate-700"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete chat
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── MESSAGE AREA ───────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50 dark:bg-[#0B141A]">
        <MessageList
          messages={messages}
          currentUser={currentUser}
          selectedMessageId={selectedMessageId}
          setSelectedMessageId={setSelectedMessageId}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
          editing={editing}
          setEditing={setEditing}
          editText={editText}
          setEditText={setEditText}
          isTyping={isTyping}
          recipient={recipient}
        />
      </div>

      {/* ── INPUT ──────────────────────────────────────────── */}
      <MessageInput
        input={input}
        setInput={setInput}
        handleSendMessage={sendMessage}
        onInputChange={handleInputChange}
        currentUser={currentUser}
        chatUserId={chatUserId}
        socket={socket}
        setSelectedMessageId={setSelectedMessageId}
        showEmoji={showEmoji}
        setShowEmoji={setShowEmoji}
        setActiveModal={setActiveModal}
      />

      {/* ── EMOJI PICKER ───────────────────────────────────── */}
      {showEmoji && (
        <EmojiPicker
          input={input}
          setInput={setInput}
          onSelectEmoji={(e) => { setInput(input + e); setShowEmoji(false); }}
        />
      )}

      {/* ── MODALS ─────────────────────────────────────────── */}
      <ResourceModal
        activeModal={activeModal}
        setActiveModal={setActiveModal}
        recipient={recipient}
        currentUser={currentUser}
      />
      <SwapModal
        activeModal={activeModal}
        setActiveModal={setActiveModal}
        recipient={recipient}
        currentUser={currentUser}
        userSkills={currentUser?.skills}
        recipientSkills={recipient?.skills}
      />

      {/* ── INCOMING CALL ──────────────────────────────────── */}
      {incomingCall && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/80 z-50 gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-4xl font-bold shadow-2xl">
              {recipient?.username?.charAt(0)?.toUpperCase() || "?"}
            </div>
            {/* Ripple rings */}
            <span className="absolute inset-0 rounded-full bg-white/20 animate-ping" />
          </div>

          <div className="text-center">
            <p className="text-white text-xl font-semibold">{recipient?.username}</p>
            <p className="text-gray-300 text-sm mt-1 flex items-center justify-center gap-2">
              {callType === "audio"
                ? <><Phone className="w-4 h-4" /> Incoming audio call</>
                : <><Video className="w-4 h-4" /> Incoming video call</>}
            </p>
          </div>

          <div className="flex gap-6">
            <button
              onClick={() => { setIncomingCall(false); socket?.emit("rejectCall", { to: chatUserId, from: currentUser._id }); }}
              className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-lg transition"
              title="Decline"
            >
              <PhoneOff className="w-7 h-7 text-white" />
            </button>
            <button
              onClick={answerCall}
              disabled={!isConnected}
              className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center shadow-lg transition disabled:opacity-50"
              title="Accept"
            >
              <Phone className="w-7 h-7 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* ── ACTIVE CALL SCREEN ─────────────────────────────── */}
      {(isCallActive || callStatus === "calling") && (
        <div className="fixed inset-0 z-40 flex flex-col">

          {/* ── VIDEO CALL ── */}
          {callType === "video" && (
            <div className="relative w-full h-full bg-black">
              {/* Remote video (full screen) */}
              {remoteStream ? (
                <video autoPlay playsInline ref={remoteVideoRef} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 gap-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold">
                    {recipient?.username?.charAt(0)?.toUpperCase()}
                  </div>
                  <p className="text-white font-semibold">{recipient?.username}</p>
                  <p className="text-gray-400 text-sm animate-pulse">
                    {callStatus === "calling" ? "Calling..." : "Connecting..."}
                  </p>
                </div>
              )}

              {/* Remote label */}
              {remoteStream && (
                <div className="absolute top-4 left-4 text-white bg-black/50 px-3 py-1 rounded-lg text-sm backdrop-blur-sm">
                  {recipient?.username}
                </div>
              )}

              {/* Local PiP */}
              {stream && (
                <div className="absolute bottom-24 right-4 w-36 h-24 bg-black rounded-xl border-2 border-white/30 shadow-2xl overflow-hidden">
                  <video autoPlay muted playsInline ref={localVideoRef} className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 left-1 text-white text-xs bg-black/50 px-1 rounded">You</span>
                </div>
              )}

              {/* Controls */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
                <button onClick={endCall} className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center shadow-xl transition" title="End call">
                  <PhoneOff className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>
          )}

          {/* ── AUDIO CALL ── */}
          {callType === "audio" && (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 gap-6">
              {/* Avatar with pulse rings */}
              <div className="relative flex items-center justify-center">
                <span className="absolute w-36 h-36 rounded-full bg-purple-500/20 animate-ping" style={{ animationDuration: "1.5s" }} />
                <span className="absolute w-28 h-28 rounded-full bg-purple-500/30 animate-ping" style={{ animationDuration: "1s" }} />
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold shadow-2xl z-10">
                  {recipient?.avatar
                    ? <img src={recipient.avatar} alt={recipient.username} className="w-full h-full rounded-full object-cover" />
                    : recipient?.username?.charAt(0)?.toUpperCase()
                  }
                </div>
              </div>

              {/* Name + status */}
              <div className="text-center">
                <p className="text-white text-2xl font-bold">{recipient?.username}</p>
                <p className="text-purple-300 text-sm mt-1 animate-pulse">
                  {callStatus === "calling" ? "Calling..." : callStatus === "connected" ? "Connected" : "Connecting..."}
                </p>
              </div>

              {/* Audio waveform animation (decorative) */}
              {callStatus === "connected" && (
                <div className="flex items-end gap-1 h-8">
                  {[3, 5, 8, 5, 9, 4, 7, 5, 3, 6, 8, 4, 6].map((h, i) => (
                    <div
                      key={i}
                      className="w-1 bg-purple-400 rounded-full"
                      style={{
                        height: `${h * 3}px`,
                        animation: `pulse 0.8s ease-in-out ${i * 0.07}s infinite alternate`,
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Hidden audio element for remote stream */}
              {remoteStream && (
                <audio autoPlay ref={remoteVideoRef} />
              )}

              {/* End call button */}
              <button
                onClick={endCall}
                className="mt-4 w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center shadow-2xl transition"
                title="End call"
              >
                <PhoneOff className="w-7 h-7 text-white" />
              </button>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default Chat;
