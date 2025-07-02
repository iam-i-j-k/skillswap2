import React,{ useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { useSocket } from "../context/SocketContext"
import axios from "axios"
import MessageList from "./chat/MessageList"
import MessageInput from "./chat/MessageInput"
import ChatActions from "./chat/ChatActions"
import EmojiPicker from "./chat/EmojiPicker"
import SwapModal from "./chat/SwapModal"
import ResourceModal from "./chat/ResourceModal"

const Chat = () => {
  const { id: chatUserId } = useParams()
  const currentUser = useSelector((state) => state.auth.user)
  const token = useSelector((state) => state.auth.token)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [recipient, setRecipient] = useState(null)
  const [activeModal, setActiveModal] = useState(null)
  const [isTyping, setIsTyping] = useState(false)
  const [showEmoji, setShowEmoji] = useState(false)
  const [editing, setEditing] = useState(null)
  const [editText, setEditText] = useState("")
  const [selectedMessageId, setSelectedMessageId] = useState(null)
  const typingTimeout = useRef()
  const socket = useSocket()
  const calendlyLink = "https://calendly.com/irfanjankhan7860"

  console.log("Socket ID", socket?.id); // Must print a real socket ID

  useEffect(() => {
    if (!socket) return <div>Connecting to chat server...</div>;


    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message])
      if (message.text && message.sender === chatUserId) {
        socket.emit("markAsDelivered", {
          userId: currentUser._id,
          chatUserId: message.sender,
        })
      }
    })

    socket.on("typing", ({ from }) => {
      if (from === chatUserId) setIsTyping(true)
    })
    socket.on("stopTyping", ({ from }) => {
      if (from === chatUserId) setIsTyping(false)
    })

    // Update these handlers:
    socket.on("messagesDelivered", ({ updatedMessages }) => {
      setMessages((prev) =>
        prev.map((msg) => {
          const updated = updatedMessages.find((um) => um._id === msg._id)
          return updated ? { ...msg, delivered: updated.delivered } : msg
        }),
      )
    })

    socket.on("messagesSeen", ({ updatedMessages }) => {
      setMessages((prev) =>
        prev.map((msg) => {
          const updated = updatedMessages.find((um) => um._id === msg._id)
          return updated ? { ...msg, seen: updated.seen } : msg
        }),
      )
    })

    return () => {
      socket.off("receiveMessage")
      socket.off("typing")
      socket.off("stopTyping")
      socket.off("messagesDelivered")
      socket.off("messagesSeen")
    }
  }, [socket, currentUser._id, chatUserId])

useEffect(() => {
  const fetchChat = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/chat/history/${chatUserId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(res.data.messages);
      setRecipient(res.data.recipient);
      if (socket) {
        socket.emit("markAsDelivered", {
          userId: currentUser._id,
          chatUserId,
        });
      }
    } catch (err) {
      console.error("Failed to load chat", err);
    }
  };
  if (socket) {
    fetchChat();
  }
}, [chatUserId, token, socket]);


  useEffect(() => {
    const handleClickOutside = () => setSelectedMessageId(null)
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

useEffect(() => {
  if (socket && currentUser?._id) {
    socket.emit("join-connection-rooms", currentUser._id);
  }


    if (socket && chatUserId && currentUser?._id) {
      const seenTimeout = setTimeout(() => {
        socket.emit("markAsSeen", {
          userId: currentUser._id,
          chatUserId,
        })
      }, 150)
      return () => clearTimeout(seenTimeout)
    }
  }, [socket, chatUserId, currentUser?._id, messages.length])

  const sendMessage = (text) => {
    if (!text.trim() || !socket) return;
    const messageObj = {
      sender: currentUser._id,
      recipient: chatUserId,
      text,
    };
    socket.emit("sendMessage", messageObj);
    setInput("");
  }

  const handleInputChange = (e) => {
    setInput(e.target.value)
    if (socket) {
      socket.emit("typing", { to: chatUserId, from: currentUser._id })
      if (typingTimeout.current) clearTimeout(typingTimeout.current)
      typingTimeout.current = setTimeout(() => {
        socket.emit("stopTyping", { to: chatUserId, from: currentUser._id })
      }, 500)
    }
  }

  const handleReact = (messageId, emoji) => {
    socket.emit("reactMessage", { messageId, userId: currentUser._id, emoji })
  }

  const handleDelete = (messageId) => {
    if (window.confirm("Delete this message?")) {
      socket.emit("deleteMessage", { messageId }) // userId is not required by backend
      console.log("Deleting", messageId, socket); // Is socket null?
    }
  }

  const handleEdit = (messageId, newText) => {
    socket.emit("editMessage", { messageId, userId: currentUser._id, newText })
    setEditing(null)
    setEditText("")
  }

  useEffect(() => {
    if (!socket) return
    socket.on("messageReacted", ({ messageId, userId, emoji }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId
  ? {
      ...msg,
      reactions: [
        ...(msg.reactions || []),
        { userId, emoji }
      ],
    }
  : msg,
        ),
      )
    })
    socket.on("messageDeleted", ({ messageId }) => {
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId))
    })
    socket.on("messageEdited", ({ message }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === message._id
            ? { ...msg, ...message }
            : msg
        )
      )
    })
    return () => {
      socket.off("messageReacted")
      socket.off("messageDeleted")
      socket.off("messageEdited")
    }
  }, [socket])

  const openCalendly = () => {
    window.open(calendlyLink, "_blank")
  }

  const handleClearChat = () => {
    if (!socket || !currentUser?._id || !chatUserId) return;
    if (window.confirm("Are you sure you want to clear this chat?")) {
      socket.emit("clearChat", {
        userId: currentUser._id,
        chatUserId
      });
    }
  };

  useEffect(() => {
  if (!socket) return;
  const handleTestResponse = (data) => {
    alert("Test event response: " + JSON.stringify(data));
  };
  socket.on("testResponse", handleTestResponse);
  return () => {
    socket.off("testResponse", handleTestResponse);
  };
}, [socket]);

  useEffect(() => {
    if (!socket) return;
    socket.on("chatCleared", ({ chatUserId: clearedId, userId: clearedUserId }) => {
      // If this chat is between these two users, clear
      if (
        (chatUserId === clearedId && currentUser._id === clearedUserId) ||
        (chatUserId === clearedUserId && currentUser._id === clearedId)
      ) {
        setMessages([]);
      }
    });
    return () => {
      socket.off("chatCleared");
    };
  }, [socket, chatUserId, currentUser?._id]);

  useEffect(() => {
    if (!socket || !currentUser?._id) return;
    socket.emit("join-connection-rooms", currentUser._id)
  }, [socket, currentUser._id, chatUserId])

  if (!chatUserId) return <div>No user selected for chat.</div>

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Chat with {recipient?.username || "User"}</h2>

      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-hidden">
          <MessageList
            messages={messages}
            currentUser={currentUser}
            selectedMessageId={selectedMessageId}
            setSelectedMessageId={setSelectedMessageId}
            handleReact={handleReact}
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
        
        <div className="flex justify-between items-center mb-4">
          <ChatActions
            setActiveModal={setActiveModal}
            openCalendly={openCalendly}
            showEmoji={showEmoji}
            setShowEmoji={setShowEmoji}
            handleClearChat={handleClearChat}
          />
        </div>
        <MessageInput
          input={input}
          setInput={setInput}
          handleSendMessage={sendMessage}
          isTyping={isTyping}
          setIsTyping={setIsTyping}
          showEmoji={showEmoji}
          setShowEmoji={setShowEmoji}
          editing={editing}
          setEditing={setEditing}
          editText={editText}
          setEditText={setEditText}
          selectedMessageId={selectedMessageId}
          setSelectedMessageId={setSelectedMessageId}
          onInputChange={handleInputChange}
          socket={socket}
          chatUserId={chatUserId}
        />
        {showEmoji && (
          <EmojiPicker
            onSelectEmoji={(emoji) => {
              setInput(input + emoji);
              setShowEmoji(false);
            }}
          />
        )}
      </div>

{socket && (
  <button onClick={() => socket.emit("test", { hello: "world" })}>
    Emit test event
  </button>
)}


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
      />
    </div>
  );
};

export default Chat
