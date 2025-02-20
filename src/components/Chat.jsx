import React from 'react';
import { useState, useEffect } from "react";
import io from "socket.io-client";
import { MessageSquare, Share2, Phone, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const socket = io(import.meta.env.VITE_REACT_APP_BACKEND_BASEURL);

function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("User");

  useEffect(() => {
    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage = {
        sender: username,
        text: message,
        timestamp: new Date().toLocaleTimeString(),
      };
      socket.emit("sendMessage", newMessage);
      setMessages((prev) => [...prev, newMessage]);
      setMessage("");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold">Chat Room</h2>
      <div className="border p-3 h-60 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <div className="text-sm text-gray-500">
              {msg.sender} at {msg.timestamp}
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
          className={`px-4 py-2 rounded-r-lg transition ${
            message.trim() 
              ? 'bg-purple-600 text-white hover:bg-purple-700 cursor-pointer'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default Chat;
