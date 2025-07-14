import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Sparkles, Menu, X, Users, Layout, Bell, Check, XIcon as XMark, Moon, Sun, Home } from "lucide-react"
import { useSocket } from "../context/SocketContext"
import ConnectionRequests from "./ConnectionRequests"
import { useSelector, useDispatch } from 'react-redux';
import { fetchRequests, addRequest } from '../features/connectionsSlice.js/connectionSlice';

const Header = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("darkMode");
    if (stored !== null) {
      return stored === "true";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  return false;
});



  const socket = useSocket() // Use shared socket
  const currentUserId = useSelector((state) => state.auth.user?._id);

  useEffect(() => {
  if (darkMode) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
  localStorage.setItem("darkMode", darkMode.toString());
}, [darkMode]);


  useEffect(() => {
    if (!socket || !currentUserId) return;

    // Real-time updates for connection requests
    socket.on("newConnectionRequest", (connection) => {
      dispatch(addRequest(connection));
    });

    socket.on("connectionAccepted", () => {
      dispatch(fetchRequests());
    });

    socket.on("connectionDeclined", () => {
      dispatch(fetchRequests());
    });

    // Clean up listeners on unmount
    return () => {
      socket.off("newConnectionRequest");
      socket.off("connectionAccepted");
      socket.off("connectionDeclined");
    };
  }, [socket, currentUserId, dispatch]);

  useEffect(() => {
    if (socket && currentUserId) {
      socket.emit("join-connection-rooms", currentUserId);
    }
  }, [socket, currentUserId]);

  // Always fetch connection requests on header mount
  const user = useSelector(state => state.auth.user);
  useEffect(() => {
    if(user && user.token){
      dispatch(fetchRequests());
    }
  }, [user, dispatch]);

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

  // Redux connection requests
  const requests = useSelector(state => state.connections.requests);
  const safeRequests = Array.isArray(requests) ? requests : [];
  const [isRequestsOpen, setIsRequestsOpen] = useState(false)

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
                className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-200 text-gray-700 dark:text-gray-300 font-medium"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
            {/* Bell Button for Connection Requests */}
            <div className="relative">
              <button
                onClick={() => setIsRequestsOpen((prev) => !prev)}
                className="relative flex items-center px-4 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-200 text-gray-700 dark:text-gray-300"
              >
                <Bell className="w-5 h-5" />
                {safeRequests.length > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-medium animate-pulse">
                    {safeRequests.length}
                  </span>
                )}
              </button>
              <ConnectionRequests open={isRequestsOpen} />
            </div>
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
              {safeRequests.length > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                  {safeRequests.length}
                </span>
              )}
            </button>
          </nav>
        )}
      </div>
    </header>
  )
}

export default Header
