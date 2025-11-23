// SocketContext.jsx - Add proper connection state management
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const currentUser = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const joinedUserIdRef = useRef(null);

  useEffect(() => {
    if (!token) {
      // Clean up if no token
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    console.log("🔌 Initializing socket connection...");
    
    // Create new socket connection
    const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
      transports: ["websocket"],
      withCredentials: true,
      auth: { token },
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    const handleConnect = () => {
      console.log("✅ Socket connected:", newSocket.id);
      setIsConnected(true);
      
      // Join room immediately when connected
      if (currentUser?._id) {
        console.log("🚪 Emitting join-room for user:", currentUser._id);
        newSocket.emit("join-room", currentUser._id);
        joinedUserIdRef.current = currentUser._id;
      }
    };

    const handleDisconnect = (reason) => {
      console.log("❌ Socket disconnected:", reason);
      setIsConnected(false);
    };

    const handleConnectError = (error) => {
      console.error("🔌 Socket connection error:", error);
      setIsConnected(false);
    };

    newSocket.on("connect", handleConnect);
    newSocket.on("disconnect", handleDisconnect);
    newSocket.on("connect_error", handleConnectError);

    return () => {
      console.log("🧹 Cleaning up socket");
      newSocket.off("connect", handleConnect);
      newSocket.off("disconnect", handleDisconnect);
      newSocket.off("connect_error", handleConnectError);
      newSocket.disconnect();
      socketRef.current = null;
      setSocket(null);
      setIsConnected(false);
    };
  }, [token]);

  // Handle room joining when user changes or socket connects
  useEffect(() => {
    const sock = socketRef.current;
    const userId = currentUser?._id;
    
    if (!sock || !userId || !isConnected) return;

    // If already joined for the same user, skip
    if (joinedUserIdRef.current === userId) return;

    console.log("🚪 Joining room for user:", userId);
    sock.emit("join-room", userId);
    joinedUserIdRef.current = userId;
  }, [currentUser?._id, isConnected]);

  // Debug: log socket state changes
  useEffect(() => {
    console.log("🔌 Socket state update - connected:", isConnected, "socket:", socket ? "available" : "null");
  }, [socket, isConnected]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  
  // Debug hook usage
  useEffect(() => {
    if (context) {
      console.log("🔌 useSocket called - connected:", context.isConnected, "id:", context.socket?.id);
    }
  }, [context]);
  
  return context;
};