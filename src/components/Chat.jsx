import React from "react"
import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"
import { useSocket } from "../context/SocketContext"
import axios from "axios"
import MessageList from "./chat/MessageList"
import MessageInput from "./chat/MessageInput"
import ChatActions from "./chat/ChatActions"
import EmojiPicker from "./chat/EmojiPicker"
import SwapModal from "./chat/SwapModal"
import ResourceModal from "./chat/ResourceModal"
import { ArrowLeft, Phone, Video, MoreVertical } from "lucide-react"
import toast from "react-hot-toast"

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
  const navigate = useNavigate()
  const calendlyLink = "https://calendly.com/irfanjankhan7860"

  
  useEffect(() => {
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
          { headers: { Authorization: `Bearer ${token}` } },
        )
        setMessages(res.data.messages)
        setRecipient(res.data.recipient)
        if (socket) {
          socket.emit("markAsDelivered", {
            userId: currentUser._id,
            chatUserId,
          })
        }
      } catch (err) {
        console.error("Failed to load chat", err)
      }
    }
    if (socket) {
      fetchChat()
    }
  }, [chatUserId, token, socket])

  useEffect(() => {
    const handleClickOutside = () => setSelectedMessageId(null)
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  useEffect(() => {
    if (socket && currentUser?._id) {
      socket.emit("join-connection-rooms", currentUser._id)
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
    if (!text.trim() || !socket) return
    const messageObj = {
      sender: currentUser._id,
      recipient: chatUserId,
      text,
    }
    socket.emit("sendMessage", messageObj)
    setInput("")
  }

  const handleInputChange = (e) => {
    const newValue = e.target.value
    setInput(newValue)
    
    if (!socket) return

    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current)
    }

    if (newValue.trim()) {
      socket.emit("typing", { to: chatUserId, from: currentUser._id })
      typingTimeout.current = setTimeout(() => {
        socket.emit("stopTyping", { to: chatUserId, from: currentUser._id })
      }, 1000) 
    } else {
      socket.emit("stopTyping", { to: chatUserId, from: currentUser._id })
    }
  }

  const handleReact = (messageId, emoji) => {
    socket.emit("reactMessage", { messageId, userId: currentUser._id, emoji })
  }

  const handleDelete = (messageId) => {
    if (window.confirm("Delete this message?")) {
      socket.emit("deleteMessage", { messageId })
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
                reactions: [...(msg.reactions || []), { userId, emoji }],
              }
            : msg,
        ),
      )
    })
    socket.on("messageDeleted", ({ messageId }) => {
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId))
    })
    socket.on("messageEdited", ({ message }) => {
      setMessages((prev) => prev.map((msg) => (msg._id === message._id ? { ...msg, ...message } : msg)))
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

  const handleClearChat = async () => {
    if (!socket || !currentUser?._id || !chatUserId) return
    if (window.confirm("Are you sure you want to clear this chat?")) {
      await axios.delete(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/chat/clear/${chatUserId}`, 
        { headers: { Authorization: `Bearer ${token}` } },
      )
      socket.emit("clearChat", {
        userId: currentUser._id,
        chatUserId,
      })
    }
  }

  useEffect(() => {
    if (!socket) return
    socket.on("chatCleared", ({ chatUserId: clearedId, userId: clearedUserId }) => {
      if (
        (chatUserId === clearedId && currentUser._id === clearedUserId) ||
        (chatUserId === clearedUserId && currentUser._id === clearedId)
      ) {
        setMessages([])
      }
    })
    return () => {
      socket.off("chatCleared")
    }
  }, [socket, chatUserId, currentUser?._id])

    useEffect(() => {
    if (!socket || !currentUser?._id) return
    socket.emit("join-connection-rooms", currentUser._id)
  }, [socket, currentUser?._id, chatUserId])

  if (!chatUserId) return <div>No user selected for chat.</div>

  return (
    <div className="bg-gray-50 dark:bg-slate-900 min-h-screen">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\60\ height=\60\ viewBox=\0 0 60 60\ xmlns=\http://www.w3.org/2000/svg\%3E%3Cg fill=\none\ fillRule=\evenodd\%3E%3Cg fill=\%239C92AC\ fillOpacity=\0.05\%3E%3Ccircle cx=\30\ cy=\30\ r=\2\/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20 dark:opacity-10"></div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Chat Header */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-3xl p-6 mb-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/matches")}
                className="p-2 hover:bg-white/10 rounded-2xl transition-colors text-gray-600 dark:text-gray-400 hover:text-white"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-gray-900 dark:text-white text-lg font-bold shadow-lg">
                    {recipient?.username?.charAt(0) || "U"}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-800"></div>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{recipient?.username || "User"}</h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{isTyping ? "typing..." : "online"}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-3 hover:bg-white/10 rounded-2xl transition-colors text-gray-600 dark:text-gray-400 hover:text-white">
                <Phone className="w-5 h-5" />
              </button>
              <button className="p-3 hover:bg-white/10 rounded-2xl transition-colors text-gray-600 dark:text-gray-400 hover:text-white">
                <Video className="w-5 h-5" />
              </button>
              <button className="p-3 hover:bg-white/10 rounded-2xl transition-colors text-gray-600 dark:text-gray-400 hover:text-white">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden">
          {/* Messages Area */}
          <div className="p-6">
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

          {/* Chat Actions */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-white/10">
            <ChatActions
              setActiveModal={setActiveModal}
              openCalendly={openCalendly}
              showEmoji={showEmoji}
              setShowEmoji={setShowEmoji}
              handleClearChat={handleClearChat}
              input={input}
              setInput={setInput}
            />
          </div>

          {/* Message Input */}
          <div className="p-6 pt-0">
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
              <div className="mt-4">
                <EmojiPicker
                  showEmoji={showEmoji}
                  input={input}
                  setInput={setInput}
                  onSelectEmoji={(emoji) => {
                    setInput(input + emoji)
                    setShowEmoji(false)
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
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
        recipientSkills={recipient?.skills || []}
        userSkills={currentUser?.skills || []}
      />
    </div>
  )
}

export default Chat
