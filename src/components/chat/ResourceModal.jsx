import React,{ useState } from "react"
import axios from "axios"
import { toast } from "react-hot-toast"
import { useSocket } from "../../context/SocketContext"
import { X, Upload, File, ImageIcon, Video } from "lucide-react"

const ResourceModal = ({ activeModal, setActiveModal, recipient, currentUser }) => {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const socket = useSocket()

  if (activeModal !== "resource") return null

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/svg+xml",
        "application/pdf",
        "text/plain",
        "application/javascript",
        "application/json",
        "text/markdown",
        "video/mp4",
        "video/webm",
        "video/ogg",
        "video/x-matroska",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/zip",
        "application/x-zip-compressed",
        "text/csv",
        "application/csv",
        "application/vnd.rar",
        "application/x-rar-compressed",
        "audio/mpeg",
        "audio/ogg",
        "audio/wav",
      ]

      if (!allowedTypes.includes(selectedFile.type)) {
        setError("File type not supported. Please upload an image, PDF, text file, or code file.")
        return
      }
      if (selectedFile.size > 20 * 1024 * 1024) {
        setError("File is too large. Max allowed size is 20MB.")
        return
      }

      setFile(selectedFile)
      setError("")
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("file", file, file.name)

      const token = localStorage.getItem("token")
      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/chat/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })

      if (socket) {
        socket.emit("sendMessage", {
          sender: currentUser._id,
          recipient: recipient._id,
          text: `${file.name}`,
          file: {
            url: response.data.url,
            originalName: response.data.originalName,
            mimetype: response.data.mimetype,
            size: file.size,
          },
          type: "file",
          createdAt: new Date().toISOString(),
          delivered: false,
          seen: false,
        })
      }

      toast.success("File sent successfully!")
      setFile(null)
      setActiveModal(null)
    } catch (err) {
      console.error("Upload error:", err)
      const errorMessage = err.response?.data?.error || err.response?.data?.message || "Failed to upload file"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setUploading(false)
    }
  }

  const getFileIcon = () => {
    if (!file) return <Upload className="w-8 h-8 text-gray-400" />

    if (file.type.startsWith("image/")) return <ImageIcon className="w-8 h-8 text-blue-500" />
    if (file.type.startsWith("video/")) return <Video className="w-8 h-8 text-purple-500" />
    return <File className="w-8 h-8 text-green-500" />
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl w-full max-w-md mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Share Resource with {recipient?.username}
            </h3>
            <button
              onClick={() => setActiveModal(null)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-colors text-gray-500 dark:text-gray-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Select File</label>
            <div className="relative">
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="fileInput"
                accept="image/*,video/*,.pdf,.txt,.js,.json,.md,.docx,.xlsx,.zip,.rar,.csv"
              />
              <label
                htmlFor="fileInput"
                className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl cursor-pointer hover:border-purple-400 dark:hover:border-purple-500 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-all duration-200"
              >
                <div className="flex flex-col items-center justify-center">
                  {getFileIcon()}
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-semibold text-purple-600 dark:text-purple-400">Click to upload</span> or drag
                    and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Images, Videos, Documents (Max 20MB)</p>
                </div>
              </label>
            </div>
          </div>

          {file && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-slate-700 rounded-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getFileIcon()}
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">{file.name}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg transition-colors text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setActiveModal(null)}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-white/20 text-gray-700 dark:text-gray-300 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              className={`flex-1 px-4 py-3 rounded-2xl font-medium transition-all duration-200 ${
                uploading || !file
                  ? "bg-gray-300 dark:bg-gray-600 cursor-not-allowed text-gray-500 dark:text-gray-400"
                  : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl"
              }`}
              disabled={uploading || !file}
            >
              {uploading ? "Uploading..." : "Send Resource"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResourceModal
