import React from "react"
import { Send, Smile } from "lucide-react"

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
  chatUserId,
}) => {
  const handleSend = () => {
    if (input.trim()) {
      handleSendMessage(input)
      setInput("")
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex items-end gap-3">
      <div className="flex-1 relative">
        <textarea
          className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
          placeholder="Type your message..."
          value={input}
          onChange={onInputChange}
          onKeyPress={handleKeyPress}
          rows={1}
          style={{
            minHeight: "48px",
            maxHeight: "120px",
            height: "auto",
          }}
        />

        <button
          onClick={() => setShowEmoji(!showEmoji)}
          className="absolute right-3 bottom-3 p-1 hover:bg-white/10 rounded-xl transition-colors text-slate-400 hover:text-yellow-400"
        >
          <Smile className="w-5 h-5" />
        </button>
      </div>

      <button
        onClick={handleSend}
        disabled={!input.trim()}
        className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-purple-500 disabled:hover:to-pink-500"
      >
        <Send className="w-5 h-5" />
      </button>
    </div>
  )
}

export default MessageInput
