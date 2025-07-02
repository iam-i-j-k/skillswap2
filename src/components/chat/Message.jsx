import React from "react";
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

const Message = ({
  msg,
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
  currentUser
}) => {
  return (
    <div
      key={msg._id || idx}
      className={`mb-2 flex ${isSentByMe ? "justify-end" : "justify-start"}`}
      onClick={(e) => {
        e.stopPropagation();
        onMessageClick(msg._id);
      }}
    >
      <div
        className={`relative px-3 py-2 rounded-lg max-w-xs ${
          isSentByMe ? "bg-blue-600 text-white" : "bg-gray-200 text-black"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          {/* Render text if present */}
          {msg.text && (
            <span>
              {msg.text}
              {msg.updatedAt && msg.updatedAt !== msg.createdAt && (
                <span className="ml-2 text-xs text-gray-400">(edited)</span>
              )}
            </span>
          )}

          {/* Render file if present */}
          {msg.file && msg.file.url && (
            msg.file.mimetype?.startsWith('image/') ? (
              <img
                src={msg.file.url}
                alt={msg.file.originalName || "file"}
                className="max-w-xs max-h-40 rounded mt-2"
              />
            ) : msg.file.mimetype?.startsWith('video/') ? (
              <div className="mt-2">
                <video
                  src={msg.file.url}
                  controls
                  className="max-w-[18rem] max-h-60 rounded"
                />
                <a
                  href={msg.file.url}
                  download={msg.file.originalName || true}
                  className="text-sm text-blue-600 underline mt-1 block"
                >
                  Download video
                </a>
              </div>
            ) : (
              <a
                href={msg.file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline mt-2 block"
                download={msg.file.originalName || true}
                aria-label={`Download file: ${msg.file.originalName || "file"}`}
              >
                {msg.file.originalName || "Download file"}
              </a>
            )
          )}
          <p>
            {msg.file?.size && (
              msg.file.size >= 1024 * 1024
                ? `${(msg.file.size / (1024 * 1024)).toFixed(2)} MB`
                : `${(msg.file.size / 1024).toFixed(2)} KB`
            )}
          </p>

        </div>

        {/* Reactions display */}
        <div className="flex items-center gap-1 mt-1 flex-wrap">
          {msg.reactions?.map((r, i) => (
            <span key={i}>{r.emoji}</span>
          ))}
        </div>

        {/* Reaction picker on selected */}
        {isSelected && (
          <div className="absolute z-50 mt-2 right-0">
            <Picker
              data={data}
              onEmojiSelect={(emoji) => {
                onReact(msg._id, emoji.native);
                onMessageClick(null); // Clear selection after reacting
              }}
              theme="light"
            />
          </div>
        )}

        {/* Message meta */}
        {isSentByMe && (
          <div className="text-xs text-gray-200 mt-1 flex items-center gap-1">
            {msg.seen ? "✔✔" : msg.delivered ? "✅" : ""}
            {msg.createdAt && (
              <span>
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Edit & Delete buttons */}
      {isSentByMe && (
        <div className="flex flex-col justify-center ml-2 gap-1">
          <button
          aria-label="Delete Message"
            onClick={(e) => {
              // e.stopPropagation();
              onDelete(msg._id);
              console.log("Attempting to delete:", msg._id)
            }}
            className="text-red-500"
          >
            🗑️
          </button>
          <button
            aria-label="Edit Message"
            onClick={(e) => {
              e.stopPropagation();
              setEditing(msg._id);
              setEditText(msg.text);
            }}
            className="text-yellow-500"
          >
            ✏️
          </button>
        </div>
      )}

      {/* Edit input */}
      {editing === msg._id && (
        <div className="flex gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
          <input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && editText.trim()) {
                onEdit(msg._id, editText);
                setEditing(null);
              } else if (e.key === 'Escape') {
                setEditing(null);
                setEditText(msg.text); // Reset to original text
              }
            }}
            onClick={(e) => e.stopPropagation()}
            className="border px-2 py-1 rounded w-full"
            autoFocus
            disabled={editText.trim() === ""}
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (editText.trim()) {
                onEdit(msg._id, editText);
                setEditing(null);
              }
            }}
            className={`bg-green-600 text-white px-3 py-1 rounded text-sm ${editText.trim() === "" ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={editText.trim() === ""}
          >
            Save
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditing(null);
              setEditText(msg.text); // Reset to original text
            }}
            className="bg-gray-500 text-white px-3 py-1 rounded text-sm"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default Message;