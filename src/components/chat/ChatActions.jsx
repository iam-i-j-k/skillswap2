import React from "react"
import EmojiPicker from "./EmojiPicker"
import { FileText, Repeat, Calendar, Trash2 } from "lucide-react"

const ChatActions = ({ setActiveModal, openCalendly, showEmoji, setShowEmoji, handleClearChat, input, setInput }) => {
  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={() => setActiveModal("resource")}
        className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-2xl transition-all duration-200 border border-blue-500/30"
      >
        <FileText className="w-4 h-4" />
        <span className="cursor-pointer text-sm font-medium">Send Resource</span>
      </button>

      <button
        onClick={() => setActiveModal("swap")}
        className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-2xl transition-all duration-200 border border-purple-500/30"
      >
        <Repeat className="w-4 h-4" />
        <span className="cursor-pointer text-sm font-medium">Propose Swap</span>
      </button>

      <button
        onClick={openCalendly}
        className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-2xl transition-all duration-200 border border-green-500/30"
      >
        <Calendar className="w-4 h-4" />
        <span className="cursor-pointer text-sm font-medium">Schedule Call</span>
      </button>

      <button
        onClick={handleClearChat}
        className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-2xl transition-all duration-200 border border-red-500/30"
      >
        <Trash2 className="w-4 h-4" />
        <span className="cursor-pointer text-sm font-medium">Clear Chat</span>
      </button>

      {showEmoji && (
        <EmojiPicker
          showEmoji={showEmoji}
          input={input}
          setInput={setInput}
          onSelectEmoji={(emoji) => {
            setInput(input + emoji)
            setShowEmoji(false)
          }}
        />
      )}
    </div>
  )
}

export default ChatActions
