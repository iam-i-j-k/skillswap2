import React from "react"
import Picker from "@emoji-mart/react"
import data from "@emoji-mart/data"
import { Edit3, Trash2, Download } from "lucide-react"

const Message = ({
  msg,
  recipient,
  idx,
  isSentByMe,
  isSelected,
  onMessageClick,
  onReact,
  onDelete,
  onEdit,
  editing,
  setEditing,
  editText,
  setEditText,
  currentUser,
}) => {
  return (
    <div
      key={msg._id || idx}
      className={`flex ${isSentByMe ? "justify-end" : "justify-start"} group`}
      onClick={(e) => {
        e.stopPropagation()
        onMessageClick(msg._id)
      }}
    >
      <div className="flex items-end gap-2 max-w-xs lg:max-w-md">
        {/* Avatar for received messages */}
        {!isSentByMe && (
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mb-1">
            {recipient.username?.charAt(0) || "U"}
          </div>
        )}

        <div className="flex flex-col">
          {/* Message Bubble */}
          <div
            className={`relative px-4 py-3 rounded-3xl shadow-lg ${
              isSentByMe
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-lg"
                : "bg-white dark:bg-slate-700 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-bl-lg"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Message Content */}
            <div>
              {/* Text Content */}
              {msg.text && (
                <div className="break-words">
                  {msg.text}
                  {msg.updatedAt && msg.updatedAt !== msg.createdAt && (
                    <span className="ml-2 text-xs opacity-70">(edited)</span>
                  )}
                </div>
              )}

              {/* File Content */}
              {msg.file && msg.file.url && (
                <div className="mt-2">
                  {msg.file.mimetype?.startsWith("image/") ? (
                    <img
                      src={msg.file.url || "/placeholder.svg"}
                      alt={msg.file.originalName || "file"}
                      className="max-w-full max-h-48 rounded-2xl"
                    />
                  ) : msg.file.mimetype?.startsWith("video/") ? (
                    <div>
                      <video src={msg.file.url} controls className="max-w-full max-h-60 rounded-2xl" />
                      <a
                        href={msg.file.url}
                        download={msg.file.originalName || true}
                        className="inline-flex items-center gap-2 text-sm opacity-80 hover:opacity-100 mt-2 transition-opacity"
                      >
                        <Download className="w-4 h-4" />
                        Download video
                      </a>
                    </div>
                  ) : (
                    <a
                      href={msg.file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2 p-3 rounded-2xl transition-colors ${
                        isSentByMe
                          ? "bg-white/10 hover:bg-white/20"
                          : "bg-gray-100 dark:bg-slate-600 hover:bg-gray-200 dark:hover:bg-slate-500"
                      }`}
                      download={msg.file.originalName || true}
                    >
                      <Download className="w-4 h-4" />
                      <div>
                        <div className="font-medium">{msg.file.originalName || "Download file"}</div>
                        {msg.file.size && (
                          <div className="text-xs opacity-70">
                            {msg.file.size >= 1024 * 1024
                              ? `${(msg.file.size / (1024 * 1024)).toFixed(2)} MB`
                              : `${(msg.file.size / 1024).toFixed(2)} KB`}
                          </div>
                        )}
                      </div>
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Reactions */}
            {msg.reactions && msg.reactions.length > 0 && (
              <div className="flex items-center gap-1 mt-2 flex-wrap">
                {msg.reactions.map((r, i) => (
                  <span key={i} className="text-lg">
                    {r.emoji}
                  </span>
                ))}
              </div>
            )}

            {/* Message Status & Time */}
            <div
              className={`flex items-center justify-between mt-2 text-xs ${
                isSentByMe ? "text-white/70" : "text-gray-500 dark:text-gray-400"
              }`}
            >
              <span>
                {msg.createdAt &&
                  new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
              </span>
              {isSentByMe && <span className="ml-2">{msg.seen ? "✓✓" : msg.delivered ? "✓" : "○"}</span>}
            </div>

            {/* Reaction Picker */}
            {isSelected && (
              <div className="absolute z-50 top-full mt-2 right-0 w-[280px] sm:w-[320px]">
                <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/20 rounded-2xl shadow-2xl max-h-[350px] overflow-hidden">
                  <Picker
                    data={data}
                    onEmojiSelect={(emoji) => {
                      onReact(msg._id, emoji.native)
                      onMessageClick(null)
                    }}
                    previewPosition="none"
                    skinTonePosition="none"
                    theme="auto"
                    perLine={7}
                    maxFrequentRows={1}
                    navPosition="top"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Edit Input */}
          {editing === msg._id && (
            <div className="flex gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
              <input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && editText.trim()) {
                    onEdit(msg._id, editText)
                    setEditing(null)
                  } else if (e.key === "Escape") {
                    setEditing(null)
                    setEditText(msg.text)
                  }
                }}
                className="flex-1 px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-white/20 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                autoFocus
              />
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (editText.trim()) {
                    onEdit(msg._id, editText)
                    setEditing(null)
                  }
                }}
                className="px-4 py-2 bg-green-500 text-white rounded-2xl hover:bg-green-600 transition-colors disabled:opacity-50"
                disabled={!editText.trim()}
              >
                Save
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setEditing(null)
                  setEditText(msg.text)
                }}
                className="px-4 py-2 bg-gray-500 dark:bg-slate-600 text-white rounded-2xl hover:bg-gray-600 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Message Actions */}
        {isSentByMe && (
          <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setEditing(msg._id)
                setEditText(msg.text)
              }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-colors text-gray-500 dark:text-slate-400 hover:text-yellow-500 dark:hover:text-yellow-400"
              title="Edit message"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete(msg._id)
              }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-colors text-gray-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400"
              title="Delete message"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Message
