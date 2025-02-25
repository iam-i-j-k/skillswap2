import React from 'react';
import { useParams } from "react-router-dom";
import VideoCall from "./VideoCall";
import ChatPage from "./ChatPage";

const VideoCallPage = () => {
  const { userId } = useParams();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl">
        <VideoCall />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ChatPage />
      </div>
    </div>
  );
};

export default VideoCallPage;
