import React,{ useState, useEffect } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useSelector } from "react-redux"
import Profile from "./components/Profile"
import Home from "./components/Home"
import Login from "./components/Login"
import SignUp from "./components/SignUp"
import ProtectedRoute from "./components/ProtectedRoute"
import Dashboard from "./components/Dashboard"
import Matches from "./components/Matches"
import UserProfile from "./components/UserProfile"
import Chat from "./components/Chat"
import LoadingScreen from "./components/LoadingScreen"
import { Toaster } from "react-hot-toast"

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [isFirstLoad, setIsFirstLoad] = useState(true)
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    // Check if this is the first load
    const hasLoadedBefore = sessionStorage.getItem("hasLoadedBefore")

    if (!hasLoadedBefore) {
      // First time loading - show loading screen
      setIsFirstLoad(true)
      setIsLoading(true)
    } else {
      // Already loaded before in this session - skip loading screen
      setIsFirstLoad(false)
      setIsLoading(false)
    }
  }, [])

  const handleLoadingComplete = () => {
    setIsLoading(false)
    sessionStorage.setItem("hasLoadedBefore", "true")
  }

  // Show loading screen only on first load
  if (isFirstLoad && isLoading) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <main>
          <Routes>
            <Route path="/profile" element={<Profile />} />
            <Route
              path="/login"
              element={
                token ? <Navigate to="/dashboard" replace /> : <Login />
              }
            />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/chat/:id"
              element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" />} />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/matches"
              element={
                <ProtectedRoute>
                  <Matches />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/:userId"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Toaster />
      </div>
    </BrowserRouter>
  )
}

export default App
