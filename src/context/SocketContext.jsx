import React, { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [isReady, setIsReady] = React.useState(false);

  useEffect(() => {
    socketRef.current = io("wss://backend-y50t.onrender.com", {
      transports: ["websocket"],
      withCredentials: true,
    });

    socketRef.current.on("connect", () => {
      setIsReady(true);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  if (!isReady) return null; // or show loading spinner

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);