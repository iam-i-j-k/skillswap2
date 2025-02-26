import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_REACT_APP_BACKEND_BASEURL, {
  transports: ["websocket"],
  autoConnect: false
});

function Chat({ userId, receiverId }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Connect socket
    socket.connect();

    // Register user on WebSocket connection
    socket.emit("register", userId);

    // Listen for incoming messages
    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    // Handle errors
    socket.on("messageError", (error) => {
      setError(error.message);
    });

    return () => {
      socket.off("message");
      socket.off("messageError");
      socket.disconnect();
    };
  }, [userId]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage = { senderId: userId, receiverId, text: message };
      socket.emit("sendMessage", newMessage);
      setMessages((prev) => [...prev, newMessage]); // Update local state
      setMessage("");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold">Chat</h2>
      <div className="border p-3 h-60 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <div className="text-sm text-gray-500">
              {msg.senderId === userId ? "You" : "Other"}:
            </div>
            <div className="text-md">{msg.text}</div>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="mt-4 flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border p-2 flex-grow rounded-l-lg"
          placeholder="Type your message..."
        />
        <button
          type="submit"
          disabled={!message.trim()}
          className="px-4 py-2 bg-purple-600 text-white rounded-r-lg"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default Chat;
