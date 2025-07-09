import React from "react"

const TypingIndicator = ({ isTyping, recipient }) => {
  if (!isTyping) return null

  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
          {recipient?.username?.charAt(0) || "U"}
        </div>
        <div className="px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl rounded-bl-lg">
          <div className="flex items-center gap-1">
            <span className="text-slate-300 text-sm">{recipient?.username || "User"} is typing</span>
            <div className="flex gap-1 ml-2">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
              <div
                className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TypingIndicator
