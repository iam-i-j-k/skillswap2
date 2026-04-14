import React, { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom"
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
import toast, { Toaster } from "react-hot-toast"
import Header from "./components/Header"

import Benefits from "./quicklinks/Benefits"
import HowItWorks from "./quicklinks/HowItWorks"
import Testimonials from "./quicklinks/Testimonials"
import FAQ from "./quicklinks/FAQ"
import Team from "./quicklinks/Team"
import ContactUs from "./quicklinks/ContactUs"
import Footer from "./components/Footer"
import ForgotPassword from "./components/ForgotPassword"
import VerifyEmail from "./components/VerifyEmail"
import ResetPassword from "./components/ResetPassword"
import TermsOfService from "./components/TermsOfService"
import PrivacyPolicy from "./components/PrivacyPolicy"
import ScrollToTop from "./components/ScrollToTop"
import CheckConnection from "./components/CheckConnection"

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [isFirstLoad, setIsFirstLoad] = useState(true)

  const token = useSelector((state) => state.auth.token)

  useEffect(() => {
    const hasLoadedBefore = sessionStorage.getItem("hasLoadedBefore")

    if (!hasLoadedBefore) {
      setIsFirstLoad(true)
      setIsLoading(true)
    } else {
      setIsFirstLoad(false)
      setIsLoading(false)
    }
  }, [])

  const handleLoadingComplete = () => {
    setIsLoading(false)
    sessionStorage.setItem("hasLoadedBefore", "true")
  }

  // ✅ Handle auth initialization WITHOUT breaking hooks
  if (token === undefined) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />
  }

  // ✅ First load animation
  if (isFirstLoad && isLoading) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />
  }

  return (
    <BrowserRouter>
      <AppWithRouter token={token} />
    </BrowserRouter>
  )
}

function AppWithRouter({ token }) {
  const location = useLocation()

  const showError = (err) =>
    toast.error(err.response?.data?.error || err.message)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <CheckConnection />

      {/* Header condition */}
      {location.pathname !== "/login" &&
        location.pathname !== "/signup" &&
        !location.pathname.startsWith("/chat/") && <Header />}

      <main>
        <Routes>
          <Route path="/profile" element={<Profile />} />

          <Route
            path="/login"
            element={token ? <Navigate to="/dashboard" replace /> : <Login />}
          />

          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
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

          {/* Static pages */}
          <Route path="/benefits" element={<Benefits />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/team" element={<Team />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <ScrollToTop />
      <Toaster />

      {/* Footer condition */}
      {!token &&
        location.pathname !== "/login" &&
        location.pathname !== "/signup" && <Footer />}
    </div>
  )
}

export default App