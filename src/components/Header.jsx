"use client"

import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Sparkles, Menu, X, Users, Layout, Bell, Check, XIcon as XMark, Moon, Sun, Home } from "lucide-react"
import { useSocket } from "../context/SocketContext"

export function Header({ connectionRequests, handleAccept, handleDecline }) {
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("darkMode") === "true" ||
        (!localStorage.getItem("darkMode") && window.matchMedia("(prefers-color-scheme: dark)").matches)
      )
    }
    return true
  })

  const socket = useSocket() // Use shared socket

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("darkMode", "true")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("darkMode", "false")
    }
  }, [darkMode])

  const menuItems = [
    {
      label: "Home",
      icon: Home,
      onClick: () => navigate("/home"),
    },
    {
      label: "My Matches",
      icon: Users,
      onClick: () => navigate("/matches"),
    },
    {
      label: "Dashboard",
      icon: Layout,
      onClick: () => navigate("/dashboard"),
    },
  ]

  const [localConnectionRequests, setLocalConnectionRequests] = useState(connectionRequests)

  React.useEffect(() => {
    if (!socket) return

    socket.on("new-connection-request", (request) => {
      setLocalConnectionRequests((prev) => [...prev, request])
    })

    socket.on("connection-request-sent", (request) => {
      setLocalConnectionRequests((prev) => [...prev, request])
    })

    socket.on("request-accepted", (request) => {
      setLocalConnectionRequests((prev) => prev.map((r) => (r._id === request._id ? request : r)))
    })

    socket.on("request-rejected", (request) => {
      setLocalConnectionRequests((prev) => prev.map((r) => (r._id === request._id ? request : r)))
    })

    return () => {
      socket.off("new-connection-request")
      socket.off("connection-request-sent")
      socket.off("request-accepted")
      socket.off("request-rejected")
    }
  }, [socket])

  useEffect(() => {
    setLocalConnectionRequests(connectionRequests);
  }, [connectionRequests]);

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-200/20 dark:border-white/10 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <a href="/dashboard" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
              <div className="relative w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="relative">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Skill<span className="text-purple-600 dark:text-purple-400">Swap</span>
              </h1>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={item.onClick}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-200 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 group"
              >
                <item.icon className="w-4 h-4" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative flex items-center space-x-2 px-4 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-200 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
              >
                <div className="relative">
                  <Bell className="w-4 h-4" />
                  {localConnectionRequests.length > 0 && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-medium animate-pulse">
                      {localConnectionRequests.length}
                    </span>
                  )}
                </div>
                <span className="font-medium">Notifications</span>
              </button>

              {/* Notifications Dropdown */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 py-2 z-50 backdrop-blur-xl">
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Connection Requests</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage your pending connections</p>
                  </div>

                  {localConnectionRequests.length === 0 ? (
                    <div className="px-6 py-8 text-center">
                      <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500 dark:text-gray-400">No new notifications</p>
                    </div>
                  ) : (
                    <div className="max-h-96 overflow-y-auto">
                      {localConnectionRequests
                        .filter((req) => req.requester && (req.requester.username || req.requester.email))
                        .map((request) => (
                          <div
                            key={request._id}
                            className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-100 dark:border-white/5 last:border-0"
                          >
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold flex-shrink-0 shadow-lg">
                                {request.requester?.username?.charAt(0) || request.requester?.email?.charAt(0) || "?"}
                              </div>

                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {request.requester.username}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                  {request.requester.email}
                                </p>

                                <div className="flex items-center gap-2 mt-3">
                                  <button
                                    onClick={() => handleAccept(request._id)}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-medium rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg"
                                  >
                                    <Check className="w-3 h-3" />
                                    Accept
                                  </button>
                                  <button
                                    onClick={() => handleDecline(request._id)}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full hover:bg-gray-200 dark:hover:bg-white/20 transition-all duration-200"
                                  >
                                    <XMark className="w-3 h-3" />
                                    Decline
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-200 text-gray-700 dark:text-gray-300"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-200 text-gray-700 dark:text-gray-300"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-200 text-gray-700 dark:text-gray-300"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden py-4 px-2 space-y-2 border-t border-gray-200 dark:border-white/10">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  item.onClick()
                  setIsMobileMenuOpen(false)
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-200 text-gray-700 dark:text-gray-300 text-left"
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}

            {/* Mobile Notifications */}
            <button
              onClick={() => {
                setIsNotificationsOpen(!isNotificationsOpen)
                setIsMobileMenuOpen(false)
              }}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-200 text-gray-700 dark:text-gray-300"
            >
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5" />
                <span className="font-medium">Notifications</span>
              </div>
              {localConnectionRequests.length > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                  {localConnectionRequests.length}
                </span>
              )}
            </button>
          </nav>
        )}
      </div>
    </header>
  )
}
