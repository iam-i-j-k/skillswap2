import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const currentUser = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!token) return;

    // Pass token in auth query if your server needs it (optional).
    socketRef.current = io(import.meta.env.VITE_SOCKET_URL, {
      transports: ["websocket"],
      withCredentials: true,
      auth: { token }, // optional: server can validate token
    });

    socketRef.current.on("connect", () => {
      setIsReady(true);
    });

    socketRef.current.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      setIsReady(false);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [token]);

  // join the user's room when socket and user id are ready
  useEffect(() => {
    if (!socketRef.current || !currentUser?._id) return;
    // Keep room name consistent with backend: "user-<id>" or custom event name
    socketRef.current.emit("join-user-room", currentUser._id);
  }, [currentUser?._id]);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
