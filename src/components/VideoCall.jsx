import React, { useState, useEffect, useRef } from "react"
import Peer from "peerjs"
import { Phone, PhoneOff, Video, VideoOff, Mic, MicOff, Copy, Share2 } from "lucide-react"
import { Check } from "lucide-react"

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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-400 mx-auto"></div>
          <p className="mt-4 text-purple-200 font-medium">Initializing secure connection...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-purple-500/20">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-center relative">
          <h2 className="text-3xl font-bold text-white mb-1">Video Call</h2>
          <p className="text-purple-200 text-sm">{isConnected ? "Call in progress" : "Ready to connect"}</p>
          <div className="absolute top-1/2 right-6 transform -translate-y-1/2">
            <div className="flex items-center space-x-2">
              <span
                className={`h-3 w-3 rounded-full ${isConnected ? "bg-green-400" : "bg-yellow-400"} animate-pulse`}
              ></span>
              <span className="text-white text-sm font-medium">{isConnected ? "Connected" : "Waiting"}</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        {!isConnected && (
          <div className="p-8 bg-gray-900/50 border-b border-gray-700">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-full md:w-1/3">
                <label className="block text-sm font-medium text-purple-200 mb-2">Your ID</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={peerId}
                    readOnly
                    className="w-full px-4 py-3 bg-gray-800 border border-purple-500/30 rounded-xl text-purple-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => copyToClipboard(peerId)}
                    className={`p-3 rounded-xl transition-all duration-300 ${
                      copySuccess ? "bg-green-500 text-white" : "bg-gray-700 hover:bg-gray-600 text-purple-200"
                    }`}
                  >
                    {copySuccess ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="w-full md:w-1/3">
                <label className="block text-sm font-medium text-purple-200 mb-2">Enter Peer ID</label>
                <input
                  type="text"
                  placeholder="Enter ID to call"
                  value={remotePeerId}
                  onChange={(e) => setRemotePeerId(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-purple-500/30 rounded-xl text-purple-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-500"
                />
              </div>

              <div className="w-full md:w-1/3 flex gap-3">
                <button
                  onClick={startCall}
                  className="flex-1 px-6 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Phone className="h-5 w-5" />
                  <span>Start Call</span>
                </button>
                <button
                  onClick={generateShareLink}
                  className="flex-1 px-6 py-3 bg-purple-500 text-white font-semibold rounded-xl hover:bg-purple-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Share2 className="h-5 w-5" />
                  <span>Share Link</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Video Grid */}
        <div className="p-8 bg-gray-900">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative aspect-video bg-gray-800 rounded-2xl overflow-hidden shadow-xl border border-purple-500/20">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-black/70 text-white px-4 py-2 rounded-xl text-sm font-medium">
                You {isMuted && "(Muted)"}
              </div>
            </div>

            <div className="relative aspect-video bg-gray-800 rounded-2xl overflow-hidden shadow-xl border border-purple-500/20">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-black/70 text-white px-4 py-2 rounded-xl text-sm font-medium">
                Remote
              </div>
              {!isConnected && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/90">
                  <div className="text-center space-y-4">
                    <div className="animate-pulse">
                      <div className="h-16 w-16 rounded-full bg-purple-500/20 border-2 border-purple-500 flex items-center justify-center mx-auto">
                        <Phone className="h-8 w-8 text-purple-400" />
                      </div>
                    </div>
                    <p className="text-xl font-semibold text-purple-200">Waiting for connection...</p>
                    <p className="text-sm text-purple-300/70">Share your ID or enter a peer ID to start</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Call Controls */}
        <div className="p-8 bg-gray-900/50 border-t border-gray-700 flex justify-center items-center space-x-6">
          <button
            onClick={toggleMute}
            className={`p-4 rounded-xl transition-all duration-300 flex items-center gap-2 ${
              isMuted ? "bg-red-500 text-white hover:bg-red-600" : "bg-gray-700 hover:bg-gray-600 text-purple-200"
            }`}
          >
            {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            <span>{isMuted ? "Unmute" : "Mute"}</span>
          </button>
          <button
            onClick={toggleVideo}
            className={`p-4 rounded-xl transition-all duration-300 flex items-center gap-2 ${
              isVideoOff ? "bg-red-500 text-white hover:bg-red-600" : "bg-gray-700 hover:bg-gray-600 text-purple-200"
            }`}
          >
            {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
            <span>{isVideoOff ? "Start Video" : "Stop Video"}</span>
          </button>
          {isConnected && (
            <button
              onClick={() => window.location.reload()}
              className="p-4 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-all duration-300 flex items-center gap-2"
            >
              <PhoneOff className="h-5 w-5" />
              <span>End Call</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default VideoCall

