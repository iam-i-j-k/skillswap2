import React from "react"
import Picker from "@emoji-mart/react"
import data from "@emoji-mart/data"

const EmojiPicker = ({ showEmoji, input, setInput, onSelectEmoji }) => {
  if (!showEmoji) return null

  return (
    <div
      className="
        fixed bottom-24 right-8 z-50
        max-w-full
        max-h-[400px] sm:max-h-[420px]
        bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-white/20
        overflow-hidden
        animate-fade-in
      "
      style={{
        boxSizing: "border-box",
      }}
    >
      <Picker
        data={data}
        onEmojiSelect={(emoji) => {
          if (onSelectEmoji) {
            onSelectEmoji(emoji.native)
          } else {
            setInput(input + emoji.native)
          }
        }}
        previewPosition="none"
        skinTonePosition="none"
        perLine={8}
        maxFrequentRows={1}
        theme="auto"
      />
    </div>
  )
}

export default EmojiPicker
