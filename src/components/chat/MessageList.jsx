import React, { useEffect, useRef } from "react";
import Message from "./Message";
import TypingIndicator from "../TypingIndicator";

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
  recipient
}) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-[400px] overflow-y-auto border rounded p-4 bg-gray-50">
      {messages.map((msg, idx) => {
        const isSentByMe = msg.sender === currentUser._id;
        const isSelected = selectedMessageId === msg._id;

        // Handle file messages
        if (msg.type === 'file') {
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
          );
        }

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
        );
      })}
      {isTyping && <TypingIndicator isTyping={isTyping} recipient={recipient} />}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;