import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useSocket } from "../../context/SocketContext";
import { X, Upload, File, ImageIcon, Video } from "lucide-react";
import { useUploadResourceMutation } from "../../services/chatApi";

const makeClientId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const ResourceModal = ({ activeModal, setActiveModal, recipient, currentUser }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const socket = useSocket();

  const [uploadResource, { isLoading }] = useUploadResourceMutation();

  if (activeModal !== "resource") return null;

  // ---------------------------
  // FILE VALIDATION
  // ---------------------------
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    const allowed = [
      "image/jpeg","image/png","image/gif","image/webp","image/svg+xml",
      "application/pdf","text/plain","application/javascript","application/json",
      "text/markdown","video/mp4","video/webm","video/ogg","video/x-matroska",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/zip","application/x-zip-compressed","text/csv","application/csv",
      "application/vnd.rar","audio/mpeg","audio/ogg","audio/wav"
    ];

    if (!allowed.includes(selected.type)) {
      setError("Unsupported file type.");
      return;
    }

    if (selected.size > 20 * 1024 * 1024) {
      setError("Max file size is 20MB.");
      return;
    }

    setFile(selected);
    setError("");
  };

  // ---------------------------
  // UPLOAD USING RTK QUERY
  // ---------------------------
  const handleUpload = async () => {
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Send to backend via RTK
      const res = await uploadResource(formData).unwrap();

      // Build message payload
      const clientId = makeClientId();

      const msgPayload = {
        clientId,
        sender: currentUser._id,
        recipient: recipient._id,
        text: file.name,
        file: {
          url: res.url,
          originalName: res.originalName || file.name,
          mimetype: res.mimetype || file.type,
          size: file.size,
        },
        type: "file",
        createdAt: new Date().toISOString(),
        delivered: false,
        seen: false,
      };

      socket?.emit("sendMessage", msgPayload);

      toast.success("File sent!");
      setFile(null);
      setActiveModal(null);
    } catch (err) {
      console.error(err);
      const m = err?.data?.error || "Upload failed";
      setError(m);
      toast.error(m);
    }
  };

  // ---------------------------
  // ICON
  // ---------------------------
  const getFileIcon = () => {
    if (!file) return <Upload className="w-8 h-8 text-gray-400" />;
    if (file.type.startsWith("image/")) return <ImageIcon className="w-8 h-8 text-blue-500" />;
    if (file.type.startsWith("video/")) return <Video className="w-8 h-8 text-purple-500" />;
    return <File className="w-8 h-8 text-green-500" />;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl w-full max-w-md mx-4">
        <div className="p-6">
          {/* HEADER */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Share Resource with {recipient?.username}
            </h3>
            <button
              onClick={() => setActiveModal(null)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 rounded-xl text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* FILE SELECT */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Select File
            </label>
            <div className="relative">
              <input
                type="file"
                id="fileInput"
                className="hidden"
                onChange={handleFileChange}
                accept="image/*,video/*,.pdf,.txt,.js,.json,.md,.docx,.xlsx,.zip,.rar,.csv"
              />
              <label
                htmlFor="fileInput"
                className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-purple-400 hover:bg-gray-50 transition"
              >
                {getFileIcon()}
                <p className="mt-3 text-sm text-gray-600">
                  <span className="font-semibold text-purple-600">Click to upload</span> or drag & drop
                </p>
                <p className="text-xs text-gray-500 mt-1">Max 20MB</p>
              </label>
            </div>
          </div>

          {/* FILE PREVIEW */}
          {file && (
            <div className="mb-6 p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getFileIcon()}
                  <div>
                    <h4 className="font-medium text-sm">{file.name}</h4>
                    <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button onClick={() => setFile(null)} className="p-1 hover:bg-gray-200 rounded-lg">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex gap-3">
            <button
              onClick={() => setActiveModal(null)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-2xl"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={!file || isLoading}
              className={`flex-1 px-4 py-3 rounded-2xl ${
                !file || isLoading
                  ? "bg-gray-300 text-gray-500"
                  : "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              }`}
            >
              {isLoading ? "Uploading..." : "Send Resource"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceModal;
