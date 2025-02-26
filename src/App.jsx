import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import LandingPage from './components/LandingPage';
import ChatPage from './components/ChatPage';
import VideoCallPage from './components/VideoCallPage';
import Profile from './components/Profile';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Chat from './components/Chat';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <main>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/chat/:userId" element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            } />
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/video-call/:userId" element={<VideoCallPage />} />
            <Route path='/profile' element={<Profile />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
