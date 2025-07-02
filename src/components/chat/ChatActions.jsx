import React from "react";
import EmojiPicker from "./EmojiPicker";


const ChatActions = ({ 
  setActiveModal, 
  openCalendly, 
  showEmoji, 
  setShowEmoji,
  handleClearChat,
  input,
  setInput,
}) => {
  return (
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={() => setActiveModal("resource")}
        className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-sm"
      >
        📁 Send Resource
      </button>
      <button
        onClick={() => setActiveModal("swap")}
        className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-1 rounded text-sm"
      >
        🤝 Propose Swap
      </button>
      <button
        onClick={openCalendly}
        className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded text-sm"
      >
        📅 Schedule Call
      </button>
      <button 
        onClick={() => setShowEmoji(!showEmoji)} 
        className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-3 py-1 rounded text-sm"
      >
        😊
      </button>
      <button 
        onClick={handleClearChat}
        className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded text-sm"
      >
        🗑️ Clear Chat
      </button>
      {showEmoji && (
        <EmojiPicker
          showEmoji={showEmoji}
          input={input}
          setInput={setInput}
          onSelectEmoji={(emoji) => {
            setInput(input + emoji);
            setShowEmoji(false);
          }}
        />
      )}
    </div>
  );
};

export default ChatActions;