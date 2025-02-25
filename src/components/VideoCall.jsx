import React, { useState, useEffect, useRef } from "react";
import Peer from "peerjs";

function VideoCall() {
  const [peerId, setPeerId] = useState("");
  const [remotePeerId, setRemotePeerId] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const peerRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localVideoRef = useRef(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const remoteIdFromURL = urlParams.get("peer");
    if (remoteIdFromURL) setRemotePeerId(remoteIdFromURL);

    const peer = new Peer();
    peerRef.current = peer;

    peer.on("open", (id) => {
      setPeerId(id);
      localStorage.setItem("peerId", id);
    });

    peer.on("call", (call) => {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
        localVideoRef.current.srcObject = stream;
        call.answer(stream);
        call.on("stream", (remoteStream) => {
          remoteVideoRef.current.srcObject = remoteStream;
          setIsConnected(true);
        });
      });
    });

    return () => peer.destroy();
  }, []);

  const startCall = () => {
    const peer = peerRef.current;
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      localVideoRef.current.srcObject = stream;
      const call = peer.call(remotePeerId, stream);
      call.on("stream", (remoteStream) => {
        remoteVideoRef.current.srcObject = remoteStream;
        setIsConnected(true);
      });
    });
  };

  const generateShareLink = () => {
    const inviteLink = `${window.location.origin}?peer=${peerId}`;
    navigator.clipboard.writeText(inviteLink);
    alert(`Share this link: ${inviteLink}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-center">
          <h2 className="text-2xl font-bold text-white">Live Video Call</h2>
          <p className="text-white text-sm opacity-80">Connect with others instantly</p>
        </div>

        {/* Controls */}
        <div className="p-6">
          {!isConnected && (
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              {/* Peer ID */}
              <div className="text-center w-full md:w-auto">
                <p className="font-semibold">Your Peer ID:</p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={peerId}
                    readOnly
                    className="w-full border rounded-md p-2 text-center shadow-sm"
                  />
                  <button
                    onClick={() => navigator.clipboard.writeText(peerId)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition"
                  >
                    Copy
                  </button>
                </div>
              </div>

              {/* Enter Peer ID */}
              <div className="w-full flex-1">
                <input
                  type="text"
                  placeholder="Enter Peer ID to call"
                  value={remotePeerId}
                  onChange={(e) => setRemotePeerId(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 border focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              {/* Call Button */}
              <button
                onClick={startCall}
                className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition transform active:scale-95"
              >
                Start Call
              </button>
            </div>
          )}
        </div>

        {/* Video Section */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Local Video */}
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
              <video ref={localVideoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover rounded-lg" />
              <div className="absolute bottom-3 left-3 bg-black/50 text-white text-sm px-3 py-1 rounded-full">You</div>
            </div>

            {/* Remote Video */}
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
              <video ref={remoteVideoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover rounded-lg" />
              <div className="absolute bottom-3 left-3 bg-black/50 text-white text-sm px-3 py-1 rounded-full">Remote</div>
              {!isConnected && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/75 text-white text-lg font-semibold animate-pulse">
                  <p>Waiting for connection...</p>
                </div>
              )}
            </div>
          </div>

          {/* Call Actions */}
          {isConnected && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-red-500 text-white font-semibold rounded-full hover:bg-red-600 transition transform active:scale-95"
              >
                End Call
              </button>
            </div>
          )}
        </div>

        {/* Share Link Button */}
        {!isConnected && (
          <div className="p-6 text-center">
            <button
              onClick={generateShareLink}
              className="px-6 py-3 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 transition transform active:scale-95"
            >
              Share Call Link
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default VideoCall;
