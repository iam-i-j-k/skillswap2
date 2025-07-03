import React from "react";

const MessageInput = ({ 
  input, 
  setInput,
  handleSendMessage,
  isTyping,
  setIsTyping,
  showEmoji,
  setShowEmoji,
  editing,
  setEditing,
  editText,
  setEditText,
  selectedMessageId,
  setSelectedMessageId,
  onInputChange,
  socket,
  chatUserId
}) => {
  const handleSend = () => {
    if (input.trim()) {
      handleSendMessage(input); // Pass the input value!
      setInput('');
      setIsTyping(false);
    }
  };

  return (
    <div className="flex gap-2 mb-4">
      <input
        className="border px-3 py-2 rounded w-full"
        placeholder={"Type your message..."}
        value={input}
        onChange={onInputChange}
      />
      <button
        onClick={handleSend}
        className={`px-4 py-2 rounded ${"bg-blue-600 text-white"
        }`}
        disabled={(!input.trim() || !handleSendMessage)}
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;