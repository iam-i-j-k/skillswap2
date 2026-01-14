//src/webrtc/useWebRTC.js
import { useEffect, useRef, useState, useCallback } from "react";

/**
 * useWebRTC Hook
 * Handles peer connection, signaling, and media streams
 */
export const useWebRTC = (socket, currentUserId, peerId) => {
  const [stream, setStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [incomingCall, setIncomingCall] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callStatus, setCallStatus] = useState('idle'); // 'idle', 'calling', 'connected'

  const peerConnection = useRef(null);
  const offerSignal = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const isInitialized = useRef(false);
  const cleanupInProgress = useRef(false);
  const socketEventHandlers = useRef({});

  // -----------------------
  // Initialize WebRTC (without media stream)
  // -----------------------
  useEffect(() => {
    // Check if socket is valid before proceeding
    if (!socket || typeof socket.on !== 'function') {
      console.warn("⚠️ Socket not available or invalid, skipping WebRTC initialization");
      return;
    }

    if (!currentUserId || !peerId || isInitialized.current) return;

    const init = () => {
      try {
        console.log("🔄 Initializing WebRTC connection...");
        
        // Create peer connection only, don't get media yet
        const pc = new RTCPeerConnection({
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:stun1.l.google.com:19302" },
          ],
        });

        peerConnection.current = pc;
        isInitialized.current = true;
        cleanupInProgress.current = false;

        // Handle remote stream
        pc.ontrack = (event) => {
          console.log("🎥 Received remote track", event.streams[0]);
          setRemoteStream(event.streams[0]);
          setCallStatus('connected');
          setIsCallActive(true);
        };

        // Handle connection state changes
        pc.onconnectionstatechange = () => {
          console.log("📡 Connection state:", pc.connectionState);
          if (pc.connectionState === 'connected') {
            setIsCallActive(true);
          } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
            if (!cleanupInProgress.current) {
              endCall();
            }
          }
        };

        // Send ICE candidates to peer
        pc.onicecandidate = (event) => {
          if (event.candidate && peerConnection.current && peerConnection.current.connectionState !== 'closed') {
            console.log("📤 Sending ICE candidate");
            socket.emit("iceCandidate", {
              to: peerId,
              candidate: event.candidate,
            });
          }
        };

        // Handle ICE connection state
        pc.oniceconnectionstatechange = () => {
          console.log("🧊 ICE connection state:", pc.iceConnectionState);
        };

      } catch (err) {
        console.error("❌ Error initializing WebRTC:", err);
      }
    };

    init();

    // Setup socket listeners
    const setupSocketListeners = () => {
      // Clear any existing handlers
      const cleanupExistingHandlers = () => {
        Object.keys(socketEventHandlers.current).forEach(eventName => {
          const handler = socketEventHandlers.current[eventName];
          if (handler && socket && typeof socket.off === 'function') {
            socket.off(eventName, handler);
          }
        });
        socketEventHandlers.current = {};
      };

      cleanupExistingHandlers();

      // Receive ICE candidate from peer
      const handleIceCandidate = async (candidate) => {
        try {
          if (peerConnection.current && peerConnection.current.connectionState !== 'closed') {
            await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
            console.log("✅ Added ICE candidate");
          }
        } catch (err) {
          console.error("❌ Error adding ICE candidate", err);
        }
      };

      // Receive incoming call offer
      const handleIncomingCall = async ({ from, signalData }) => {
        if (from === peerId) {
          console.log("📞 Incoming call offer received");
          offerSignal.current = signalData;
          setIncomingCall(true);
        }
      };

      // Receive call accepted (answer)
      const handleCallAccepted = async (signal) => {
        console.log("✅ Call accepted - setting remote description");
        try {
          if (peerConnection.current) {
            await peerConnection.current.setRemoteDescription(new RTCSessionDescription(signal));
            setCallStatus('connected');
            setIsCallActive(true);
          }
        } catch (err) {
          console.error("❌ Error setting remote description:", err);
        }
      };


    // When other user ends call
    const handleCallEnded = (data) => {
      console.log("📞 Call ended by remote user", data);
      
      // Only end if the remote user ended it, not if we ended it
      if (!cleanupInProgress.current) {
        // Clean up without emitting another endCall event
        cleanupInProgress.current = true;
        
        if (peerConnection.current) {
          peerConnection.current.getSenders().forEach((sender) => {
            if (sender.track) {
              sender.track.stop();
            }
          });
          peerConnection.current.close();
          peerConnection.current = null;
        }
        
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
          setStream(null);
        }
        
        setRemoteStream(null);
        setIsCallActive(false);
        setIncomingCall(false);
        setCallStatus('idle');
        isInitialized.current = false;
        cleanupInProgress.current = false;
      }
    };

      // Store handlers for cleanup
      socketEventHandlers.current.iceCandidate = handleIceCandidate;
      socketEventHandlers.current.incomingCall = handleIncomingCall;
      socketEventHandlers.current.callAccepted = handleCallAccepted;
      socketEventHandlers.current.callEnded = handleCallEnded;

      // Add socket listeners only if socket is valid
      socket.on("iceCandidate", handleIceCandidate);
      socket.on("incomingCall", handleIncomingCall);
      socket.on("callAccepted", handleCallAccepted);
      socket.on("callEnded", handleCallEnded);

      // Return cleanup function
      return cleanupExistingHandlers;
    };

    const cleanupSocket = setupSocketListeners();

    // Cleanup when unmounting or dependencies change
    return () => {
      console.log("🧹 Cleaning up WebRTC");
      if (cleanupSocket) cleanupSocket();
      
      // Only do full cleanup if we're actually ending a call or unmounting
      // Not when dependencies change temporarily
      if (peerConnection.current) {
        cleanupInProgress.current = true;
        peerConnection.current.getSenders().forEach((sender) => {
          if (sender.track) {
            sender.track.stop();
          }
        });
        peerConnection.current.close();
        peerConnection.current = null;
      }
      
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
      
      setRemoteStream(null);
      setIsCallActive(false);
      setIncomingCall(false);
      setCallStatus('idle');
      isInitialized.current = false;
      cleanupInProgress.current = false;
    };
  }, [socket, currentUserId, peerId]);

  // -----------------------
  // Get local media stream (only when needed)
  // -----------------------
  const getLocalStream = async () => {
    try {
      console.log("🎥 Requesting camera and microphone access...");
      const localStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: true,
      });

      console.log("✅ Media access granted");
      console.log("📹 Video tracks:", localStream.getVideoTracks().length);
      console.log("🎙️ Audio tracks:", localStream.getAudioTracks().length);
      
      // Check if video tracks are actually working
      localStream.getVideoTracks().forEach(track => {
        console.log("📹 Video track:", track.label, "enabled:", track.enabled, "readyState:", track.readyState);
      });

      setStream(localStream);
      return localStream;
    } catch (err) {
      console.error("❌ Error accessing media devices:", err);
      throw err;
    }
  };

  // -----------------------
  // Call a user
  // -----------------------
  const callUser = async () => {
    if (!peerConnection.current) {
      console.error("❌ Peer connection not initialized");
      return;
    }

    if (!socket || typeof socket.emit !== 'function') {
      console.error("❌ Socket not available for calling");
      return;
    }

    try {
      setCallStatus('calling');
      
      // Get media permissions only when user initiates call
      const localStream = await getLocalStream();
      
      // Add local tracks to connection
      localStream.getTracks().forEach((track) => {
        peerConnection.current.addTrack(track, localStream);
        console.log("➕ Added local track:", track.kind);
      });

      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);

      socket.emit("callUser", {
        userToCall: peerId,
        signalData: offer,
        from: currentUserId,
      });

      console.log("📞 Sent call offer to", peerId);
    } catch (err) {
      console.error("❌ Error starting call:", err);
      alert("Could not access camera/microphone. Please check permissions.");
      endCall();
    }
  };

  // -----------------------
  // Answer a call
  // -----------------------
  const answerCall = async () => {
    if (!offerSignal.current || !peerConnection.current) {
      console.error("❌ No offer signal or peer connection");
      return;
    }

    if (!socket || typeof socket.emit !== 'function') {
      console.error("❌ Socket not available for answering call");
      return;
    }

    try {
      setCallStatus('calling');
      
      // Get media permissions when answering call
      const localStream = await getLocalStream();
      
      // Add local tracks to connection
      localStream.getTracks().forEach((track) => {
        peerConnection.current.addTrack(track, localStream);
        console.log("➕ Added local track:", track.kind);
      });

      await peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(offerSignal.current)
      );

      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);

      socket.emit("answerCall", { to: peerId, signalData: answer });
      console.log("✅ Sent answer to", peerId);
      setIncomingCall(false);
    } catch (err) {
      console.error("❌ Error answering call:", err);
      alert("Could not access camera/microphone. Please check permissions.");
      setIncomingCall(false);
      endCall();
    }
  };

  // -----------------------
  // End call - wrapped in useCallback to prevent recreation
  // -----------------------
  const endCall = useCallback(() => {
    if (cleanupInProgress.current) {
      console.log("⏸️  Cleanup already in progress, skipping");
      return;
    }

    console.log("📞 Ending call...");
    cleanupInProgress.current = true;
    
    // Stop local stream
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
      setStream(null);
    }
    
    // Close peer connection
    if (peerConnection.current) {
      peerConnection.current.getSenders().forEach((sender) => {
        if (sender.track) {
          sender.track.stop();
        }
      });
      peerConnection.current.close();
      peerConnection.current = null;
    }
    
    // Clear remote stream
    setRemoteStream(null);
    
    // Update state
    setIsCallActive(false);
    setIncomingCall(false);
    setCallStatus('idle');
    
    // Emit call ended event
    if (socket && typeof socket.emit === 'function' && peerId) {
      socket.emit("endCall", { to: peerId, from: currentUserId });
    }
    
    isInitialized.current = false;
    cleanupInProgress.current = false;
    
    console.log("✅ Call ended");
  }, [socket, stream, peerId]);

  // -----------------------
  // Attach media to video elements
  // -----------------------
  useEffect(() => {
    if (localVideoRef.current && stream) {
      console.log("🎥 Attaching local stream to video element");
      localVideoRef.current.srcObject = stream;
      
      // Add event listeners for debugging
      localVideoRef.current.onloadedmetadata = () => {
        console.log("✅ Local video metadata loaded");
      };
      
      localVideoRef.current.oncanplay = () => {
        console.log("✅ Local video can play");
      };
      
      localVideoRef.current.onerror = (e) => {
        console.error("❌ Local video error:", e);
      };

      // Play the video
      localVideoRef.current.play().then(() => {
        console.log("▶️ Local video playing");
      }).catch(err => {
        console.error("❌ Error playing local video:", err);
      });
    }
  }, [stream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      console.log("🎥 Attaching remote stream to video element");
      remoteVideoRef.current.srcObject = remoteStream;
      
      // Add event listeners for debugging
      remoteVideoRef.current.onloadedmetadata = () => {
        console.log("✅ Remote video metadata loaded");
      };
      
      remoteVideoRef.current.oncanplay = () => {
        console.log("✅ Remote video can play");
      };
      
      remoteVideoRef.current.onerror = (e) => {
        console.error("❌ Remote video error:", e);
      };

      // Play the video
      remoteVideoRef.current.play().then(() => {
        console.log("▶️ Remote video playing");
      }).catch(err => {
        console.error("❌ Error playing remote video:", err);
      });
    }
  }, [remoteStream]);

  return {
    stream,
    remoteStream,
    callUser,
    answerCall,
    endCall,
    incomingCall,
    setIncomingCall,
    isCallActive: callStatus === 'connected' || isCallActive,
    callStatus,
    localVideoRef,
    remoteVideoRef,
  };
};