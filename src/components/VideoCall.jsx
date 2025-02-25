
import React, { useState, useEffect, useRef } from "react"
import Peer from "peerjs"

function VideoCall() {
  const [peerId, setPeerId] = useState("")
  const [remotePeerId, setRemotePeerId] = useState("")
  const [isConnected, setIsConnected] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const peerRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const localVideoRef = useRef(null)
  const localStreamRef = useRef(null)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const remoteIdFromURL = urlParams.get("peer")
    if (remoteIdFromURL) setRemotePeerId(remoteIdFromURL)

    const peer = new Peer()
    peerRef.current = peer

    peer.on("open", (id) => {
      setPeerId(id)
      localStorage.setItem("peerId", id)
      setIsLoading(false)
    })

    peer.on("call", (call) => {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
        localVideoRef.current.srcObject = stream
        localStreamRef.current = stream
        call.answer(stream)
        call.on("stream", (remoteStream) => {
          remoteVideoRef.current.srcObject = remoteStream
          setIsConnected(true)
        })
      })
    })

    return () => peer.destroy()
  }, [])

  const startCall = () => {
    if (!remotePeerId.trim()) {
      alert("Please enter a Peer ID to call")
      return
    }

    const peer = peerRef.current
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      localVideoRef.current.srcObject = stream
      localStreamRef.current = stream
      const call = peer.call(remotePeerId, stream)
      call.on("stream", (remoteStream) => {
        remoteVideoRef.current.srcObject = remoteStream
        setIsConnected(true)
      })
    })
  }

  const toggleMute = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled
      })
      setIsMuted(!isMuted)
    }
  }

  const toggleVideo = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled
      })
      setIsVideoOff(!isVideoOff)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  const generateShareLink = () => {
    const inviteLink = `${window.location.origin}?peer=${peerId}`
    copyToClipboard(inviteLink)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Initializing video call...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-center relative">
          <h2 className="text-2xl font-bold text-white">Live Video Call</h2>
          <p className="text-white text-sm mt-1">{isConnected ? "Call in progress" : "Ready to connect"}</p>
          <div className="absolute top-1/2 right-6 transform -translate-y-1/2">
            <div className="flex items-center space-x-2">
              <span
                className={`h-3 w-3 rounded-full ${isConnected ? "bg-green-400" : "bg-yellow-400"} animate-pulse`}
              ></span>
              <span className="text-white text-sm">{isConnected ? "Connected" : "Waiting"}</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        {!isConnected && (
          <div className="p-6 bg-gray-50 border-b">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="w-full md:w-1/3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Your ID</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={peerId}
                    readOnly
                    className="w-full px-4 py-2 bg-white border rounded-lg text-gray-700 focus:ring-2 focus:ring-purple-400"
                  />
                  <button
                    onClick={() => copyToClipboard(peerId)}
                    className={`px-4 py-2 rounded-lg transition ${
                      copySuccess ? "bg-green-500 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                    }`}
                  >
                    {copySuccess ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              <div className="w-full md:w-1/3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Enter Peer ID</label>
                <input
                  type="text"
                  placeholder="Enter ID to call"
                  value={remotePeerId}
                  onChange={(e) => setRemotePeerId(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div className="w-full md:w-1/3 flex gap-2">
                <button
                  onClick={startCall}
                  className="flex-1 px-6 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition transform hover:scale-105"
                >
                  Start Call
                </button>
                <button
                  onClick={generateShareLink}
                  className="flex-1 px-6 py-2 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 transition transform hover:scale-105"
                >
                  Share Link
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Video Grid */}
        <div className="p-6 bg-gray-900">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                You {isMuted && "(Muted)"}
              </div>
            </div>

            <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                Remote
              </div>
              {!isConnected && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/75">
                  <div className="text-white text-center">
                    <p className="text-xl font-semibold mb-2">Waiting for connection...</p>
                    <p className="text-sm opacity-75">Share your ID or enter a peer ID to start</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Call Controls */}
        <div className="p-6 bg-gray-50 flex justify-center items-center space-x-4">
          <button
            onClick={toggleMute}
            className={`p-4 rounded-full transition ${
              isMuted ? "bg-red-500 text-white" : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {isMuted ? "Unmute" : "Mute"}
          </button>
          <button
            onClick={toggleVideo}
            className={`p-4 rounded-full transition ${
              isVideoOff ? "bg-red-500 text-white" : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {isVideoOff ? "Start Video" : "Stop Video"}
          </button>
          {isConnected && (
            <button
              onClick={() => window.location.reload()}
              className="p-4 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
            >
              End Call
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default VideoCall

