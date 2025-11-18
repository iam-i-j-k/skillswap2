import React from "react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { Edit3, Trash2, Download } from "lucide-react";

const Message = ({
  msg,
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
  recipient,
}) => {
  const messageId = msg._id || msg.clientId;
  const file = msg?.file;

  const avatarLetter =
    recipient?.username?.charAt(0) ||
    recipient?.email?.charAt(0) ||
    "U";

  const isEdited =
    msg.updatedAt && msg.createdAt && msg.updatedAt !== msg.createdAt;

  const handleSelect = (e) => {
    e.stopPropagation();
    onMessageClick(messageId);
  };

const renderFile = () => {
  if (!file?.url) return null;

  const downloadFile = () => {
    // Ensure we ALWAYS keep the extension
    let filename = file.originalName || "file";

    // If filename has no extension, try to extract from mimetype
    if (!filename.includes(".")) {
      const ext = file.mimetype?.split("/")[1] || "";
      if (ext) filename += "." + ext;
    }

    const link = document.createElement("a");
    link.href = file.url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  const type = file.mimetype || "";

  // IMAGE preview
  if (type.startsWith("image/")) {
    return (
      <div className="relative group">
        <img
          src={file.url}
          alt={file.originalName}
          className="max-w-full max-h-60 rounded-xl cursor-pointer"
          onClick={downloadFile}
        />
        <button
          onClick={downloadFile}
          className="absolute bottom-2 right-2 px-3 py-1 bg-black/60 text-white text-xs rounded-lg shadow opacity-0 group-hover:opacity-100 transition"
        >
          Download
        </button>
      </div>
    );
  }

  // VIDEO preview
  if (type.startsWith("video/")) {
    return (
      <div className="relative">
        <video
          src={file.url}
          controls
          className="max-w-full max-h-60 rounded-xl"
        />
        <button
          onClick={downloadFile}
          className="mt-2 inline-flex items-center gap-2 text-sm text-blue-500 hover:underline"
        >
          <Download className="w-4 h-4" /> Download Video
        </button>
      </div>
    );
  }

  // ANY OTHER FILE (docx/pdf/zip etc)
  return (
    <div
      onClick={downloadFile}
      className={`
        cursor-pointer p-4 rounded-2xl flex items-center gap-3
        transition border
        ${
          isSentByMe
            ? "bg-white/20 hover:bg-white/30 text-white border-white/30"
            : "bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 border-gray-300 dark:border-white/10 text-gray-900 dark:text-white"
        }
      `}
    >
      <Download className="w-6 h-6" />
      <div className="flex flex-col">
        <span className="font-medium truncate max-w-[200px]">
          {file.originalName || "Download file"}
        </span>
        {file.size && (
          <span className="text-xs opacity-70">
            {file.size > 1024 * 1024
              ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
              : `${(file.size / 1024).toFixed(2)} KB`}
          </span>
        )}
      </div>
    </div>
  );
};


  const renderStatus = () => {
    if (!isSentByMe) return null;
    if (msg.seen) return <span>✓✓</span>;
    if (msg.delivered) return <span>✓</span>;
    return <span>○</span>;
  };

  const bubbleClasses = isSentByMe
    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-lg"
    : "bg-white dark:bg-slate-700 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-bl-lg";

  return (
    <div
      className={`flex ${isSentByMe ? "justify-end" : "justify-start"} group`}
      onClick={handleSelect}
    >
      <div className="flex items-end gap-2 max-w-xs lg:max-w-md">
        {!isSentByMe && (
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">
            {avatarLetter.toUpperCase()}
          </div>
        )}

        <div className="flex flex-col">
          <div
            className={`relative px-4 py-3 rounded-3xl shadow-md hover:shadow-lg animate-[fadeIn_0.2s_ease-out] ${bubbleClasses} ${isSelected ? "ring-2 ring-purple-400" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            {msg.text && (
              <div className="break-words">
                {msg.text}
                {isEdited && <span className="ml-2 text-xs opacity-70">(edited)</span>}
              </div>
            )}

            {renderFile()}

            {msg.reactions?.length > 0 && (
              <div className="flex gap-1 mt-2 flex-wrap">
                {msg.reactions.map((r, i) => <span key={i} className="text-lg">{r.emoji}</span>)}
              </div>
            )}

            <div className={`flex justify-between mt-2 text-xs ${isSentByMe ? "text-white/70" : "text-gray-500 dark:text-gray-400"}`}>
              <span>
                {msg.createdAt && new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
              {renderStatus()}
            </div>

            {isSelected && (
              <div className="absolute z-50 top-full mt-2 right-0 w-[260px] sm:w-[300px]">
                <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/20 rounded-2xl shadow-2xl">
                  <Picker
                    data={data}
                    previewPosition="none"
                    skinTonePosition="none"
                    navPosition="top"
                    theme="auto"
                    onEmojiSelect={(emoji) => {
                      onReact && onReact(messageId, emoji.native);
                      onMessageClick && onMessageClick(null);
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Edit input */}
          {editing === messageId && (
            <div className="flex gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
              <input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (editText.trim()) {
                      onEdit && onEdit(messageId, editText);
                    }
                    setEditing(null);
                  } else if (e.key === "Escape") {
                    setEditing(null);
                    setEditText(msg.text);
                  }
                }}
                className="flex-1 px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-white/20 rounded-2xl text-gray-900 dark:text-white"
                autoFocus
              />

              <button
                type="button"
                onClick={() => { if (editText.trim()) onEdit && onEdit(messageId, editText); setEditing(null); }}
                className="px-3 py-2 bg-green-500 text-white rounded-xl"
              >
                Save
              </button>

              <button
                type="button"
                onClick={() => { setEditing(null); setEditText(msg.text); }}
                className="px-3 py-2 bg-gray-500 dark:bg-slate-600 text-white rounded-xl"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Edit/Delete for sender */}
        {isSentByMe && (
          <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition ml-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setEditing && setEditing(messageId);
                setEditText && setEditText(msg.text);
              }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl"
              title="Edit message"
            >
              <Edit3 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete && onDelete(messageId);
              }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl"
              title="Delete message"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
