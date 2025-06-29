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
        placeholder={editing ? "Edit message..." : "Type your message..."}
        value={editing ? editText : input}
        onChange={editing ? (e) => setEditText(e.target.value) : onInputChange}
      />
      <button
        onClick={editing ? () => {
          setEditing(false);
          setEditText('');
          setSelectedMessageId(null);
        } : handleSend}
        className={`px-4 py-2 rounded ${
          editing ? "bg-gray-600 text-white" : "bg-blue-600 text-white"
        }`}
        disabled={editing ? !editText.trim() : (!input.trim() || !handleSendMessage)}
      >
        {editing ? "Cancel" : "Send"}
      </button>
    </div>
  );
};

export default MessageInput;