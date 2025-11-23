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
import ChatActions from "./chat/ChatActions";
import EmojiPicker from "./chat/EmojiPicker";
import SwapModal from "./chat/SwapModal";
import ResourceModal from "./chat/ResourceModal";

import { ArrowLeft, Moon, Phone, Sun, Video } from "lucide-react";
import { useWebRTC } from "../webrtc/useWebRTC";

const Chat = () => {
  const { id: chatUserId } = useParams();
  const currentUser = useSelector((state) => state.auth.user);
  const socket = useSocket();
  const navigate = useNavigate();

  const [callOpen, setCallOpen] = useState(false);
  const roomName = `SkillSwap-${
    [currentUser._id, chatUserId].sort().join("-")
  }`;
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

  const {
    stream,
    remoteStream,
    callUser,
    answerCall,
    endCall,
    incomingCall,
    setIncomingCall,
    isCallActive,
    callStatus,
    localVideoRef,
    remoteVideoRef,
  } = useWebRTC(socket, currentUser._id, chatUserId);



  const typingTimeout = useRef();

  // -----------------------
  // Load history
  // -----------------------
  const { data, refetch } = useGetChatHistoryQuery(chatUserId, {
    skip: !chatUserId,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  // ✅ Fetch recipient from users endpoint
  const { data: userData } = useGetUserQuery(chatUserId, {
    skip: !chatUserId,
  });

  
  // Optional extra safety net
  useEffect(() => {
    if (chatUserId) refetch();
  }, [chatUserId]);

  useEffect(() => {
    if (data?.messages) {
      setMessages(data.messages);
      // Merge chat recipient + fetched user data
      setRecipient((prev) => ({
        ...(data.recipient || prev),
        ...(userData?.user || {}),
      }));
    }
  }, [data, userData]);

  // -----------------------
  // Dark Mode
  // -----------------------
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

  // -----------------------
  // SOCKET EVENTS
  // -----------------------
  useEffect(() => {
    if (!socket || !currentUser?._id || !chatUserId) return;

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

    const onTyping = ({ from }) => {
      if (from === chatUserId) setIsTyping(true);
    };
    const onStopTyping = ({ from }) => {
      if (from === chatUserId) setIsTyping(false);
    };
    const onMessageDeleted = ({ messageId }) => {
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
    };
    const onMessageEdited = ({ message }) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === message._id ? message : m))
      );
    };
    const onChatCleared = ({ chatUserId: cleared }) => {
      if (cleared === chatUserId) setMessages([]);
    };
    const onDelivered = ({ updatedMessages }) => {
      setMessages((prev) =>
        prev.map((m) => {
          const f = updatedMessages.find((u) => u._id === m._id);
          return f ? { ...m, delivered: true } : m;
        })
      );
    };
    const onSeen = ({ updatedMessages }) => {
      setMessages((prev) =>
        prev.map((m) => {
          const f = updatedMessages.find((u) => u._id === m._id);
          return f ? { ...m, seen: true } : m;
        })
      );
    };

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
  }, [socket, currentUser?._id, chatUserId]);

  // -----------------------
  // SEND MESSAGE
  // -----------------------
  const sendMessage = (text) => {
    socket.emit("sendMessage", {
      sender: currentUser._id,
      recipient: chatUserId,
      text,
    });
  };

  // -----------------------
  // Delete message
  // -----------------------
  const handleDelete = (id) => {
    socket.emit("deleteMessage", { messageId: id });
  };

  // -----------------------
  // Edit message
  // -----------------------
  const handleEdit = (id, newText) => {
    socket.emit("editMessage", {
      messageId: id,
      userId: currentUser._id,
      newText,
    });
  };

  // -----------------------
  // Typing Indicator
  // -----------------------
  const handleInputChange = (e) => {
    const val = e.target.value;
    setInput(val);
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    socket.emit("typing", { from: currentUser._id, to: chatUserId });
    typingTimeout.current = setTimeout(() => {
      socket.emit("stopTyping", { from: currentUser._id, to: chatUserId });
    }, 800);
  };

  // -----------------------
  // Clear Chat
  // -----------------------
  const [clearChat] = useClearChatMutation();
  const handleClearChat = async () => {
    if (!window.confirm("Clear all messages?")) return;
    await clearChat(chatUserId).unwrap();
    socket.emit("clearChat", { userId: currentUser._id, chatUserId });
  };

  return (
    <div
      className="h-screen w-full flex flex-col 
                 bg-gray-100 text-gray-900 
                 dark:bg-[#0B141A] dark:text-white"
    >
      {/* HEADER */}
      <div
        className="h-16 px-4 flex items-center justify-between
                   bg-white border-b border-gray-200
                   dark:bg-[#202C33] dark:border-[#2F3B43]"
      >
        {/* LEFT SIDE */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("1")}
            className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-xl"
          >
            <ArrowLeft className="w-6 h-6 text-gray-800 dark:text-white" />
          </button>

          <div className="flex items-center gap-3">
            {/* ✅ Show avatar if available */}
            {recipient?.avatar ? (
              <img
                src={recipient.avatar}
                alt={recipient.username}
                className="w-9 h-9 rounded-full object-cover"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium text-sm">
                {recipient?.username?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}

            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {recipient?.username || "User"}
              </h2>
              <p className="text-blue-500 dark:text-blue-400 text-xs">
                {isTyping ? "typing..." : "online"}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">
          <button
            className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-xl"
            title="Audio Call"
          >
            <Phone className="w-5 h-5 text-gray-800 dark:text-white" />
          </button>

          <button
            onClick={callUser}
            className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-xl"
            title="Video Call"
          >
            <Video className="w-5 h-5 text-gray-800 dark:text-white" />
          </button>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-xl"
            title="Toggle Theme"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-800" />
            )}
          </button>
        </div>
      </div>

      {/* MAIN CHAT AREA */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div
          className="flex-1 overflow-y-auto px-6 py-4 
                      bg-gray-50 dark:bg-[#0B141A]"
        >
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

        {/* CHAT ACTIONS */}
        <div
          className="px-4 pb-2
                     bg-white border-t border-gray-300 
                     dark:bg-[#111B21] dark:border-[#222E35]"
        >
          <ChatActions
            setActiveModal={setActiveModal}
            setShowEmoji={setShowEmoji}
            handleClearChat={handleClearChat}
          />
        </div>

        {/* INPUT BOX */}
        <div
          className="px-4
                     bg-white border-t border-gray-300
                     dark:bg-[#202C33] dark:border-[#2F3B43]"
        >
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
          />
        </div>
      </div>

      {/* EMOJI PICKER */}
      {showEmoji && (
        <EmojiPicker
          input={input}
          setInput={setInput}
          onSelectEmoji={(e) => {
            setInput(input + e);
            setShowEmoji(false);
          }}
        />
      )}

      {/* MODALS */}
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

      {/* Incoming Call Popup */}
      {incomingCall && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/70 z-50">
          <h2 className="text-white text-lg mb-4">Incoming video call from {recipient?.username}</h2>
          <div className="flex gap-4">
            <button
              onClick={answerCall}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Accept
            </button>
            <button
              onClick={() => {
                setIncomingCall(false);
                socket.emit("rejectCall", { to: chatUserId });
              }}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Reject
            </button>
          </div>
        </div>
      )}

      {/* Video Call Interface */}
      {(isCallActive || callStatus === 'calling') && (
        <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-40">
          {/* Remote Video (Main) */}
          {remoteStream ? (
            <div className="w-full h-full relative">
              <video
                autoPlay
                playsInline
                ref={remoteVideoRef}
                className="w-full h-full object-cover bg-black"
                style={{ display: 'block' }}
              />
              <div className="absolute top-4 left-4 text-white bg-black/50 p-2 rounded">
                Remote Video
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-900">
              <div className="text-white text-center">
                <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Video className="w-8 h-8" />
                </div>
                <p>{callStatus === 'calling' ? 'Calling...' : 'Waiting for video...'}</p>
              </div>
            </div>
          )}

          {/* Local Video (Picture-in-picture) */}
          {stream && (
            <div className="absolute bottom-4 right-4 w-48 h-36 bg-black rounded-lg border-2 border-white shadow-lg">
              <video
                autoPlay
                muted
                playsInline
                ref={localVideoRef}
                className="w-full h-full object-cover rounded-lg"
                style={{ display: 'block' }}
              />
              <div className="absolute top-1 left-1 text-white text-xs bg-black/50 p-1 rounded">
                You
              </div>
            </div>
          )}

          {/* Call Controls */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <button
              onClick={endCall}
              className="bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 flex items-center gap-2"
            >
              <span>End Call</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
