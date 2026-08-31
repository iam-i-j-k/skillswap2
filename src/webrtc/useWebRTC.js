// src/webrtc/useWebRTC.js
import { useCallback, useEffect, useRef, useState } from "react";

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

function createPC(socket, peerId, onRemoteStream, onStateChange) {
  const pc = new RTCPeerConnection(ICE_SERVERS);

  pc.ontrack = (event) => {
    if (event.streams?.[0]) onRemoteStream(event.streams[0]);
  };

  pc.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("iceCandidate", { to: peerId, candidate: event.candidate });
    }
  };

  pc.onconnectionstatechange = () => onStateChange(pc.connectionState);

  return pc;
}

export const useWebRTC = (socket, currentUserId, peerId) => {
  const [stream, setStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [incomingCall, setIncomingCall] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callStatus, setCallStatus] = useState("idle"); // idle | calling | connected
  const [callType, setCallType] = useState("video");     // video | audio  (active or incoming)

  const peerConnection = useRef(null);
  const offerSignal = useRef(null);
  const incomingCallType = useRef("video"); // type signalled by the remote peer
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const cleaningUp = useRef(false);

  // ── Attach streams to video elements ────────────────────────────────────────
  useEffect(() => {
    if (localVideoRef.current && stream) {
      localVideoRef.current.srcObject = stream;
      localVideoRef.current.play().catch(() => {});
    }
  }, [stream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
      remoteVideoRef.current.play().catch(() => {});
    }
  }, [remoteStream]);

  // ── Cleanup helper ───────────────────────────────────────────────────────────
  const cleanup = useCallback(
    (emitEnd = true) => {
      if (cleaningUp.current) return;
      cleaningUp.current = true;

      setStream((prev) => {
        prev?.getTracks().forEach((t) => t.stop());
        return null;
      });

      if (peerConnection.current) {
        peerConnection.current.getSenders().forEach((s) => s.track?.stop());
        peerConnection.current.close();
        peerConnection.current = null;
      }

      setRemoteStream(null);
      setIsCallActive(false);
      setIncomingCall(false);
      setCallStatus("idle");

      if (emitEnd && socket?.emit && peerId) {
        socket.emit("endCall", { to: peerId, from: currentUserId });
      }

      cleaningUp.current = false;
    },
    [socket, peerId, currentUserId]
  );

  // ── Socket listeners ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!socket || typeof socket.on !== "function") return;
    if (!currentUserId || !peerId) return;

    const handleIceCandidate = async (candidate) => {
      try {
        if (peerConnection.current?.connectionState !== "closed") {
          await peerConnection.current?.addIceCandidate(new RTCIceCandidate(candidate));
        }
      } catch (err) {
        console.error("ICE candidate error:", err);
      }
    };

    // callType is forwarded in the signalData envelope so the callee knows
    const handleIncomingCall = ({ from, signalData, callType: type = "video" }) => {
      if (from === peerId) {
        offerSignal.current = signalData;
        incomingCallType.current = type;
        setCallType(type);
        setIncomingCall(true);
      }
    };

    const handleCallAccepted = async (signal) => {
      try {
        await peerConnection.current?.setRemoteDescription(
          new RTCSessionDescription(signal)
        );
        setCallStatus("connected");
        setIsCallActive(true);
      } catch (err) {
        console.error("setRemoteDescription error:", err);
      }
    };

    const handleCallEnded = () => {
      if (!cleaningUp.current) cleanup(false);
    };

    const handleCallRejected = () => {
      setCallStatus("idle");
      cleanup(false);
    };

    socket.on("iceCandidate", handleIceCandidate);
    socket.on("incomingCall", handleIncomingCall);
    socket.on("callAccepted", handleCallAccepted);
    socket.on("callEnded", handleCallEnded);
    socket.on("rejectCall", handleCallRejected);

    return () => {
      socket.off("iceCandidate", handleIceCandidate);
      socket.off("incomingCall", handleIncomingCall);
      socket.off("callAccepted", handleCallAccepted);
      socket.off("callEnded", handleCallEnded);
      socket.off("rejectCall", handleCallRejected);
    };
  }, [socket, currentUserId, peerId, cleanup]);

  // ── Internal: get media stream ───────────────────────────────────────────────
  const getMedia = async (type) => {
    const constraints =
      type === "audio"
        ? { audio: true, video: false }
        : { audio: true, video: { width: { ideal: 1280 }, height: { ideal: 720 } } };

    const localStream = await navigator.mediaDevices.getUserMedia(constraints);
    setStream(localStream);
    return localStream;
  };

  // ── Internal: initiate a call of any type ────────────────────────────────────
  const startCall = async (type) => {
    if (!socket?.emit) { console.error("Socket not available"); return; }

    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    try {
      setCallType(type);
      setCallStatus("calling");

      const localStream = await getMedia(type);

      const pc = createPC(
        socket,
        peerId,
        (remote) => { setRemoteStream(remote); setIsCallActive(true); setCallStatus("connected"); },
        (state) => { if (state === "disconnected" || state === "failed") cleanup(false); }
      );
      peerConnection.current = pc;

      localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // Include callType in the payload so the receiver knows what to render
      socket.emit("callUser", {
        userToCall: peerId,
        signalData: offer,
        from: currentUserId,
        callType: type,
      });
    } catch (err) {
      console.error("Error starting call:", err);
      alert(`Could not access ${type === "audio" ? "microphone" : "camera/microphone"}. Please check permissions.`);
      cleanup(false);
    }
  };

  // ── Public API ───────────────────────────────────────────────────────────────
  const callUser = () => startCall("video");
  const callUserAudio = () => startCall("audio");

  const answerCall = async () => {
    if (!offerSignal.current || !socket?.emit) return;

    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    const type = incomingCallType.current;

    try {
      setCallType(type);
      setCallStatus("calling");

      const localStream = await getMedia(type);

      const pc = createPC(
        socket,
        peerId,
        (remote) => { setRemoteStream(remote); setIsCallActive(true); setCallStatus("connected"); },
        (state) => { if (state === "disconnected" || state === "failed") cleanup(false); }
      );
      peerConnection.current = pc;

      localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

      await pc.setRemoteDescription(new RTCSessionDescription(offerSignal.current));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("answerCall", { to: peerId, signalData: answer });
      setIncomingCall(false);
    } catch (err) {
      console.error("Error answering call:", err);
      alert(`Could not access ${type === "audio" ? "microphone" : "camera/microphone"}. Please check permissions.`);
      setIncomingCall(false);
      cleanup(false);
    }
  };

  return {
    stream,
    remoteStream,
    callUser,        // start video call
    callUserAudio,   // start audio call
    answerCall,
    endCall: () => cleanup(true),
    incomingCall,
    setIncomingCall,
    isCallActive: isCallActive || callStatus === "connected",
    callStatus,
    callType,        // "video" | "audio" — tells UI which screen to show
    localVideoRef,
    remoteVideoRef,
  };
};
