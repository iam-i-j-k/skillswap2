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
    // Create a new Peer instance
    const peer = new Peer();
    peerRef.current = peer;

    peer.on("open", (id) => {
      setPeerId(id);
      console.log("Your Peer ID:", id);
    });

    peer.on("call", (call) => {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
        localVideoRef.current.srcObject = stream;
        call.answer(stream); // Answer call with local stream
        call.on("stream", (remoteStream) => {
          remoteVideoRef.current.srcObject = remoteStream;
          setIsConnected(true);
        });
      });
    });

    return () => {
      peer.destroy();
    };
  }, []);

  const startCall = () => {
    const peer = peerRef.current;
    if (!remotePeerId) {
      alert("Enter the remote Peer ID");
      return;
    }

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      localVideoRef.current.srcObject = stream;
      const call = peer.call(remotePeerId, stream);
      call.on("stream", (remoteStream) => {
        remoteVideoRef.current.srcObject = remoteStream;
        setIsConnected(true);
      });
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-3xl">
        <h2 className="text-2xl font-bold text-center mb-4">Peer-to-Peer Video Call</h2>
        
        {/* Display Peer ID */}
        <div className="mb-4 text-center">
          <p className="font-semibold">Your Peer ID:</p>
          <input
            type="text"
            value={peerId}
            readOnly
            className="w-full border rounded-md p-2 text-center"
          />
        </div>

        {/* Input Remote Peer ID */}
        <div className="mb-4 flex items-center gap-2">
          <input
            type="text"
            placeholder="Enter remote peer ID"
            value={remotePeerId}
            onChange={(e) => setRemotePeerId(e.target.value)}
            className="flex-1 border rounded-md p-2"
          />
          <button
            onClick={startCall}
            className="bg-green-500 text-white px-4 py-2 rounded-md"
          >
            Call
          </button>
        </div>

        {/* Video Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative aspect-video bg-black rounded-lg">
            <video ref={localVideoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" />
            <p className="absolute bottom-2 left-2 bg-black/50 text-white text-sm px-2 py-1 rounded">You</p>
          </div>
          <div className="relative aspect-video bg-black rounded-lg">
            <video ref={remoteVideoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover" />
            <p className="absolute bottom-2 left-2 bg-black/50 text-white text-sm px-2 py-1 rounded">Remote</p>
            {!isConnected && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-white">Waiting for connection...</div>
            )}
          </div>
        </div>

        {/* End Call Button */}
        {isConnected && (
          <div className="mt-4 text-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-red-500 text-white px-4 py-2 rounded-md"
            >
              End Call
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default VideoCall;
