import React from "react";

const TypingIndicator = ({ isTyping, recipient }) => {
  if (!isTyping) return null;

  return (
    <div className="flex justify-start mb-2">
      <div className="px-3 py-2 rounded-lg max-w-xs bg-gray-200 text-black">
        {recipient?.username} is typing...
      </div>
    </div>
  );
};

export default TypingIndicator;