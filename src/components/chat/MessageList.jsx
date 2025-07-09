import React,{ useEffect, useRef } from "react"
import Message from "./Message"
import TypingIndicator from "../TypingIndicator"

const MessageList = ({
  messages,
  currentUser,
  selectedMessageId,
  setSelectedMessageId,
  handleReact,
  handleDelete,
  handleEdit,
  editing,
  setEditing,
  editText,
  setEditText,
  isTyping,
  recipient,
}) => {
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="h-[500px] overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-slate-700/50 rounded-2xl flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl">💬</span>
            </div>
            <p className="text-slate-400 text-lg">No messages yet</p>
            <p className="text-slate-500 text-sm">Start the conversation!</p>
          </div>
        </div>
      ) : (
        <>
          {messages.map((msg, idx) => {
            const isSentByMe = msg.sender === currentUser._id
            const isSelected = selectedMessageId === msg._id

            return (
              <Message
                key={msg._id || idx}
                msg={msg}
                idx={idx}
                isSentByMe={isSentByMe}
                isSelected={isSelected}
                onMessageClick={setSelectedMessageId}
                onReact={handleReact}
                onDelete={handleDelete}
                onEdit={handleEdit}
                editing={editing}
                setEditing={setEditing}
                editText={editText}
                setEditText={setEditText}
                currentUser={currentUser}
              />
            )
          })}
          {isTyping && <TypingIndicator isTyping={isTyping} recipient={recipient} />}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  )
}

export default MessageList
