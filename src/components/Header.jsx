import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  Menu,
  X,
  Users,
  Layout,
  Bell,
  Moon,
  Sun,
  Home,
  User,
  LogOut,
} from "lucide-react";
import { useSocket } from "../context/SocketContext";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import ConnectionRequests from "./ConnectionRequests";

// RTK Query
import { useListConnectionsQuery } from "../services/connectionsApi";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRequestsOpen, setIsRequestsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [socketStatus, setSocketStatus] = useState("disconnected");
  const [pendingRequestsList, setPendingRequestsList] = useState([]);

  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem("darkMode");
    return stored ? stored === "true" : false;
  });

  const notificationsRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const profileMenuRef = useRef(null);

  const { socket, isConnected } = useSocket(); // Destructure from context
  const authUser = useSelector((state) => state.auth.user);
  const currentUserId = authUser?._id;
  const username = authUser?.username;

  const {
    data: connectionsData,
    refetch: refetchRequests,
    isLoading: requestsLoading,
  } = useListConnectionsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const pendingRequests =
    // derive from local state if available so UI updates instantly via sockets
    (pendingRequestsList.length > 0
      ? pendingRequestsList
      : connectionsData?.connections?.filter((c) => {
          const recipientId = c?.recipient?._id || c?.recipient;
          return c.status === "pending" && recipientId === currentUserId;
        }) || []) ;

  console.log("🔔 Current pending requests:", pendingRequests.length);

  useEffect(() => {
    darkMode
      ? document.documentElement.classList.add("dark")
      : document.documentElement.classList.remove("dark");

    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  // Close menus when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) {
        setIsRequestsOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setIsMobileMenuOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // SINGLE CONSOLIDATED SOCKET EFFECT
  useEffect(() => {
    if (!socket || !isConnected || !currentUserId) {
      console.log("❌ Cannot setup socket events - socket:", socket ? "available" : "null", "connected:", isConnected, "userId:", currentUserId);
      return;
    }

    console.log("✅ Socket is available, setting up ALL listeners");

    // Remove any existing listeners for these events first (defensive)
    try {
      socket.off && socket.off("connect");
      socket.off && socket.off("disconnect");
      socket.off && socket.off("connect_error");
      socket.off && socket.off("newConnectionRequest");
      socket.off && socket.off("connectionAccepted");
      socket.off && socket.off("connectionDeclined");
    } catch (err) {
      console.warn('Could not remove previous socket listeners (ok):', err);
    }

    // Connection status handlers
    const handleConnect = () => {
      console.log("🔌 Socket connected");
      setSocketStatus("connected");
      
      // Note: joining the room is handled centrally in SocketContext to avoid duplicates
    };

    const handleDisconnect = () => {
      console.log("🔌 Socket disconnected");
      setSocketStatus("disconnected");
    };

    const handleConnectError = (error) => {
      console.error("🔌 Socket connection error:", error);
      setSocketStatus("error");
    };

    const handleNewConnectionRequest = (data) => {
      console.log("🆕 Header: Received newConnectionRequest event", data);
      // Data now comes as a populated connection object directly
      try {
        const incomingRequest = data; // No need for data?.connection || data
        const recipientId = incomingRequest?.recipient?._id || incomingRequest?.recipient;
        
        if (recipientId && recipientId === currentUserId) {
          setPendingRequestsList((prev) => {
            // Avoid duplicates using _id
            const exists = prev.some((p) => p._id === incomingRequest._id);
            return exists ? prev : [incomingRequest, ...prev];
          });
        }
      } catch (err) {
        console.error('Error updating local pending list:', err);
      }

      // Keep server in-sync by refetching as a fallback
      console.log("🔄 Refetching connection requests...");
      refetchRequests();
    };

    const handleConnectionAccepted = (data) => {
      console.log("✅ Header: Received connectionAccepted event", data);
      // Remove accepted connection from local pending list
      try {
        const connectionId = data?._id; // Data is the connection object itself
        if (connectionId) {
          setPendingRequestsList((prev) => prev.filter((p) => p._id !== connectionId));
        }
      } catch (err) {
        console.error('Error removing accepted from local pending list:', err);
      }

      console.log("🔄 Refetching connection requests...");
      refetchRequests();
    };

    const handleConnectionDeclined = (data) => {
      console.log("❌ Header: Received connectionDeclined event", data);
      // Remove declined connection from local pending list
      try {
        const connectionId = data?._id; // Data is the connection object itself
        if (connectionId) {
          setPendingRequestsList((prev) => prev.filter((p) => p._id !== connectionId));
        }
      } catch (err) {
        console.error('Error removing declined from local pending list:', err);
      }

      console.log("🔄 Refetching connection requests...");
      refetchRequests();
    };

    // Set up ALL socket listeners
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.on("newConnectionRequest", handleNewConnectionRequest);
    socket.on("connectionAccepted", handleConnectionAccepted);
    socket.on("connectionDeclined", handleConnectionDeclined);

    // SocketContext now joins rooms when appropriate; avoid emitting join-room here.

    // Set initial status
    setSocketStatus(socket.connected ? "connected" : "disconnected");

    // Cleanup function - remove ALL listeners
    return () => {
      console.log("🧹 Cleaning up ALL socket listeners");
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.off("newConnectionRequest", handleNewConnectionRequest);
      socket.off("connectionAccepted", handleConnectionAccepted);
      socket.off("connectionDeclined", handleConnectionDeclined);
    };
  }, [socket, currentUserId, refetchRequests, isConnected]); // All dependencies in one place

  // In Header.jsx - update the sync useEffect
  useEffect(() => {
    try {
      if (!connectionsData) return;

      const serverList = connectionsData?.connections || [];
      if (!serverList) return;

      const filtered = serverList.filter((c) => {
        const recipientId = c?.recipient?._id || c?.recipient;
        return c.status === 'pending' && recipientId === currentUserId;
      });

      setPendingRequestsList(filtered);
    } catch (err) {
      console.error('Error syncing pendingRequestsList from server data:', err);
    }
  }, [connectionsData, currentUserId]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const menuItems = [
    { label: "Home", icon: Home, onClick: () => navigate("/home") },
    { label: "My Matches", icon: Users, onClick: () => navigate("/matches") },
    { label: "Dashboard", icon: Layout, onClick: () => navigate("/dashboard") },
  ];

  const handleProfile = () => navigate("/profile");

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-200/20 dark:border-white/10 shadow-lg">
      <div className="container mx-auto px-4">

        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <a href="/dashboard" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition" />
              <div className="relative w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Skill<span className="text-purple-600 dark:text-purple-400">Swap</span>
            </h1>
          </a>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-2">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={item.onClick}
                className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition text-gray-700 dark:text-gray-300"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}

            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setIsRequestsOpen((prev) => !prev)}
                className="relative px-4 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition text-gray-700 dark:text-gray-300"
              >
                <Bell className="w-5 h-5" />
                {pendingRequests.length > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-xs text-white rounded-full flex items-center justify-center animate-pulse">
                    {pendingRequests.length}
                  </span>
                )}
              </button>

              <ConnectionRequests 
                open={isRequestsOpen} 
                requests={pendingRequests}
                loading={requestsLoading}
                onUpdate={refetchRequests}
              />
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition text-gray-700 dark:text-gray-300"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Avatar Dropdown */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 
                flex items-center justify-center text-white font-bold uppercase shadow-md hover:opacity-90 transition"
              >
                {username?.charAt(0) || "U"}
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-3 w-40 bg-white dark:bg-slate-800 shadow-lg rounded-xl border border-gray-200 dark:border-slate-700 py-2 z-50">
                  <button
                    onClick={() => {
                      handleProfile();
                      setIsProfileMenuOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-300 
                    hover:bg-gray-100 dark:hover:bg-white/10 transition"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsProfileMenuOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-3 text-sm text-red-600 dark:text-red-400 
                    hover:bg-red-100 dark:hover:bg-red-500/20 transition"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition text-gray-700 dark:text-gray-300"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition text-gray-700 dark:text-gray-300"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav
            ref={mobileMenuRef}
            className="md:hidden py-4 px-2 space-y-2 border-t border-gray-200 dark:border-white/10"
          >
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  item.onClick();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition text-gray-700 dark:text-gray-300"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
            <button
              onClick={() => {
                handleProfile();
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition text-gray-700 dark:text-gray-300"
            >
              <User className="w-5 h-5" />
              <span>Profile</span>
            </button>
            <button
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-100 dark:hover:bg-red-500/20 transition text-red-600 dark:text-red-400"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;