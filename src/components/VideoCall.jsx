import React, { useState, useEffect, useRef } from "react";
import Peer from "peerjs";
import { useRouter } from "next/router";

function VideoCall() {
  const [peerId, setPeerId] = useState("");
  const [remotePeerId, setRemotePeerId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const peerRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localVideoRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const roomId = router.query.room;
    if (!roomId) return;
    
    const peer = new Peer(roomId); // Use room ID as Peer ID
    peerRef.current = peer;
    
    peer.on("open", (id) => {
      setPeerId(id);
      console.log("My Peer ID:", id);
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
  }, [router.query.room]);
  
  const startCall = () => {
    const peer = peerRef.current;
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      localVideoRef.current.srcObject = stream;
      const call = peer.call(router.query.room, stream);
      call.on("stream", (remoteStream) => {
        remoteVideoRef.current.srcObject = remoteStream;
        setIsConnected(true);
      });
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-purple-600 to-indigo-600">
          <h2 className="text-2xl font-bold text-white">Video Call</h2>
          {!isConnected && (
            <div className="mt-4 flex items-center space-x-4">
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-white text-sm">Room ID: {router.query.room}</p>
              </div>
              <button
                onClick={startCall}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Start Call
              </button>
            </div>
          )}
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <video ref={localVideoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute bottom-3 left-3 bg-black/50 text-white text-sm px-3 py-1 rounded-full">You</div>
            </div>
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <video ref={remoteVideoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute bottom-3 left-3 bg-black/50 text-white text-sm px-3 py-1 rounded-full">Remote</div>
              {!isConnected && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/75">
                  <p className="text-white">Waiting for connection...</p>
                </div>
              )}
            </div>
          </div>
          {isConnected && (
            <div className="mt-6 flex justify-center">
              <button onClick={() => window.location.reload()} className="px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
                End Call
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VideoCall;