import React, { useEffect, useRef, useState } from "react";
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
  recipient,
}) => {
  const listRef = useRef(null);
  const bottomRef = useRef(null);
  const [autoScroll, setAutoScroll] = useState(true);

  // -------------------------------
  // Handle scroll events
  // -------------------------------
  const handleScroll = () => {
    const el = listRef.current;
    if (!el) return;

    const nearBottom =
      el.scrollTop + el.clientHeight >= el.scrollHeight - 80;

    setAutoScroll(nearBottom);

    el._prevScrollTop = el.scrollTop;
    el._prevScrollHeight = el.scrollHeight;
  };

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  // -------------------------------
  // On new messages → restore or scroll bottom
  // -------------------------------
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    if (autoScroll) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    const prevHeight = el._prevScrollHeight || 0;
    const prevTop = el._prevScrollTop || 0;
    const newHeight = el.scrollHeight;

    const diff = newHeight - prevHeight;
    if (diff !== 0) {
      el.scrollTop = prevTop + diff;
    }

    el._prevScrollHeight = el.scrollHeight;
    el._prevScrollTop = el.scrollTop;
  }, [messages]); // <-- only messages, not autoScroll

  return (
    <div
      ref={listRef}
      className="h-full overflow-y-auto px-2 space-y-4 scrollbar-thin scrollbar-thumb-gray-400 no-scrollbar"
    >
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Start the conversation!</p>
        </div>
      ) : (
        <>
          {messages.map((msg, idx) => {
            const isSentByMe = msg.sender === currentUser._id;
            const isSelected =
              selectedMessageId === (msg._id || msg.clientId);

            return (
              <Message
                key={msg._id || msg.clientId || idx}
                msg={msg}
                recipient={recipient}
                isSentByMe={isSentByMe}
                isSelected={isSelected}
                onMessageClick={(id) =>
                  setSelectedMessageId((prev) =>
                    prev === id ? null : id
                  )
                }
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

          {isTyping && (
            <TypingIndicator isTyping={isTyping} recipient={recipient} />
          )}

          <div ref={bottomRef} />
        </>
      )}
    </div>
  );
};

export default MessageList;
