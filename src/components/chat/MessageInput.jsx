import React, { useRef, useEffect, useCallback } from "react";
import { Send, Smile } from "lucide-react";

const MessageInput = ({
  input,
  setInput,
  handleSendMessage,
  showEmoji,
  setShowEmoji,
  setSelectedMessageId,
  onInputChange,
  socket,
  chatUserId,
  currentUser,
}) => {
  const textareaRef = useRef(null);
  const typingTimeout = useRef(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }, [input]);

  const triggerTyping = useCallback(() => {
    if (!socket || !currentUser?._id || !chatUserId) return;
    socket.emit("typing", { from: currentUser._id, to: chatUserId });
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit("stopTyping", { from: currentUser._id, to: chatUserId });
    }, 700);
  }, [socket, currentUser?._id, chatUserId]);

  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value);
    triggerTyping();
    onInputChange?.(e);
    setSelectedMessageId(null);
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    handleSendMessage(text);
    setInput("");
    if (socket && currentUser?._id && chatUserId) {
      socket.emit("stopTyping", { from: currentUser._id, to: chatUserId });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-end gap-3 p-4 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-white/10 shadow-inner">
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          placeholder="Type a message..."
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          rows={1}
          className="w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none overflow-hidden scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-white/20 scrollbar-track-transparent"
        />

        <button
          tabIndex={-1}
          onClick={(e) => {
            e.stopPropagation();
            setShowEmoji((prev) => !prev);
            setSelectedMessageId(null);
          }}
          className="absolute right-3 bottom-4 p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded-xl transition-colors text-gray-500 dark:text-slate-400 hover:text-yellow-500 dark:hover:text-yellow-400"
        >
          <Smile className="w-5 h-5" />
        </button>
      </div>

      <button
        onClick={handleSend}
        disabled={!input.trim()}
        className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send className="w-5 h-5" />
      </button>
    </div>
  );
};

export default MessageInput;
