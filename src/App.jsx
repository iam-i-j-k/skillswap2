import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import LandingPage from './components/LandingPage';
import ChatPage from './components/ChatPage';
import VideoCallPage from './components/VideoCallPage';
import Profile from './components/Profile';



function App() {


  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<Home />  } />
            <Route path="/chat/:userId" Component={ChatPage} />
            <Route path="/video-call/:userId" Component={VideoCallPage} />
            <Route path='/profile' Component={Profile} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
