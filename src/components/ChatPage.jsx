import React from 'react';
import { useParams } from "react-router-dom";
import Chat from "./Chat";

const ChatPage = () => {
  const { userId } = useParams();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Chat Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Chat Session</h1>
          <div className="inline-flex items-center justify-center px-4 py-2 bg-white rounded-full shadow-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            <p className="text-sm text-gray-600">
              Connected with User: <span className="font-semibold">{userId}</span>
            </p>
          </div>
        </div>

        {/* Chat Container with Animation */}
        <div className="transform transition-all duration-500 ease-in-out hover:translate-y-[-4px]">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            {/* Status Bar */}
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
              </div>
              <div className="text-sm text-gray-500">{new Date().toLocaleDateString()}</div>
            </div>

            {/* Chat Component */}
            <Chat />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Having issues?{" "}
            <button className="text-purple-600 hover:text-purple-700 font-medium">Contact Support</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
