import React, { useRef, useEffect, useCallback } from "react";
import { Plus, Send, Smile } from "lucide-react";

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
  setActiveModal, // opens resource modal when "+" is clicked
}) => {
  const textareaRef = useRef(null);
  const typingTimeout = useRef(null);

  // Auto-resize textarea up to 120px
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
    setInput(e.target.value);
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
    <div className="flex items-end gap-2 px-3 py-3 bg-white dark:bg-[#202C33] border-t border-gray-200 dark:border-[#2F3B43]">

      {/* "+" Attach resource button */}
      <button
        type="button"
        onClick={() => setActiveModal?.("resource")}
        title="Attach file or resource"
        className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/10 hover:bg-purple-100 dark:hover:bg-purple-500/20 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-300 transition-colors"
      >
        <Plus className="w-5 h-5" />
      </button>

      {/* Textarea + emoji */}
      <div className="relative flex-1">
        <textarea
          ref={textareaRef}
          placeholder="Type a message..."
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          rows={1}
          className="w-full px-4 py-2.5 pr-10 bg-gray-50 dark:bg-[#2A3942] border border-gray-200 dark:border-transparent rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none overflow-hidden"
        />
        {/* Emoji toggle — inside the textarea on the right */}
        <button
          type="button"
          tabIndex={-1}
          onClick={(e) => {
            e.stopPropagation();
            setShowEmoji?.((prev) => !prev);
            setSelectedMessageId?.(null);
          }}
          className="absolute right-2.5 bottom-2.5 p-1 rounded-lg text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors"
          title="Emoji"
        >
          <Smile className="w-5 h-5" />
        </button>
      </div>

      {/* Send button */}
      <button
        type="button"
        onClick={handleSend}
        disabled={!input.trim()}
        className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        title="Send"
      >
        <Send className="w-4 h-4" />
      </button>
    </div>
  );
};

export default MessageInput;
