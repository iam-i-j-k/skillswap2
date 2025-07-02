import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSocket } from "../../context/SocketContext";

const ResourceModal = ({ activeModal, setActiveModal, recipient, currentUser }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const socket = useSocket();

  if (activeModal !== "resource") return null;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const allowedTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
        'application/pdf', 'text/plain',
        'application/javascript', 'application/json', 'text/markdown',
        'video/mp4', 'video/webm', 'video/ogg', 'video/x-matroska', // videos
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/zip', 'application/x-zip-compressed',
        'text/csv', 'application/csv',
        'application/vnd.rar', 'application/x-rar-compressed',
        'audio/mpeg', 'audio/ogg', 'audio/wav' // common audio formats
      ];
      


      if (!allowedTypes.includes(selectedFile.type)) {
        setError("File type not supported. Please upload an image, PDF, text file, or code file.");
        return;
      }
      if (selectedFile.size > 20 * 1024 * 1024) {
        setError("File is too large. Max allowed size is 5MB.");
        return;
      }

      setFile(selectedFile);
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file, file.name);

      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/chat/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.data;
      

      // ✅ Emit message in correct structure
      if (socket) {
        socket.emit("sendMessage", {
          sender: currentUser._id,
          recipient: recipient._id,
          text: `${file.name}`,
          file: {
            url: response.data.url,
            originalName: response.data.originalName,
            mimetype: response.data.mimetype,
            size: file.size
          },
          type: "file", // important to help renderer identify it's a file message
          createdAt: new Date().toISOString(),
          delivered: false,
          seen: false
        });
      }

      toast.success("File sent successfully!");
      setFile(null);
      setActiveModal(null);
    } catch (err) {
      console.error("Upload error:", err);
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to upload file";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow w-96">
        <h3 className="text-lg font-semibold mb-4">Share Resource with {recipient?.username}</h3>

        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select File
          </label>
          <div className="flex items-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-gray-400 transition-colors">
            <input type="file" onChange={handleFileChange} className="hidden" id="fileInput" />
            <label htmlFor="fileInput" className="flex flex-col items-center justify-center w-full">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-12 h-12 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PDF, Images, Code files</p>
              </div>
            </label>
          </div>
        </div>

        {file && (
          <div className="bg-gray-50 p-4 rounded mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{file.name}</h4>
                <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
              <button onClick={() => setFile(null)} className="text-red-500 hover:text-red-600">
                ×
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button onClick={() => setActiveModal(null)} className="text-sm text-gray-600 hover:text-gray-800">
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className={`px-4 py-2 rounded text-sm ${
              uploading ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
            disabled={uploading || !file}
          >
            {uploading ? "Uploading..." : "Send Resource"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceModal;
