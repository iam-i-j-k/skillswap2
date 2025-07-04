import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Menu, X, Users, Layout, Bell, Check, XIcon as XMark } from "lucide-react";
import { io } from 'socket.io-client';

export function Header({ connectionRequests, handleAccept, handleDecline }) {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [socket, setSocket] = useState(null);

  const menuItems = [
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
  ];

  React.useEffect(() => {
    const newSocket = io(import.meta.env.VITE_REACT_APP_BACKEND_BASEURL || 'http://localhost:8000', {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      auth: {
        token: localStorage.getItem('token')
      }
    });

    setSocket(newSocket);

    // Join user-specific rooms
    // if (user?._id) {
    //   newSocket.emit('join-connection-rooms', user._id);
    // }

    // Listen for new connection requests
    newSocket.on('new-connection-request', (request) => {
      setConnectionRequests(prev => [...prev, request]);
    });

    // Listen for connection request updates
    newSocket.on('connection-request-sent', (request) => {
      setConnectionRequests(prev => [...prev, request]);
    });

    newSocket.on('request-accepted', (request) => {
      setConnectionRequests(prev => 
        prev.map(r => r._id === request._id ? request : r)
      );
    });

    newSocket.on('request-rejected', (request) => {
      setConnectionRequests(prev => 
        prev.map(r => r._id === request._id ? request : r)
      );
    });

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  return (
    <header className="relative bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <a href="/dashboard" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute -inset-3 bg-white/20 rounded-lg blur-lg transition-all group-hover:bg-white/30" />
              <Sparkles className="h-8 w-8 relative" />
            </div>
            <div className="relative">
              <h1 className="text-2xl font-bold tracking-tight">
                Skill<span className="text-purple-200">Swap</span>
              </h1>
              <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-purple-300 scale-x-0 group-hover:scale-x-100 transition-transform" />
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors group"
              >
                <div className="relative">
                  <Bell className="w-5 h-5 opacity-70 group-hover:opacity-100" />
                  {connectionRequests.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">
                      {connectionRequests.length}
                    </span>
                  )}
                </div>
                <span>Notifications</span>
              </button>

              {/* Notifications Dropdown */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-900">Connection Requests</h3>
                  </div>

                  {connectionRequests.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-gray-500">No new notifications</div>
                  ) : (
                    <div className="max-h-96 overflow-y-auto">
                      {connectionRequests
                        .filter((req) => req.requester && (req.requester.username || req.requester.email))
                        .map((request) => (
                          <div
                            key={request._id}
                            className="px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                          >
                            <div className="flex items-start gap-3">
                              {/* User Avatar */}
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                                {request.requester?.username?.charAt(0) || request.requester?.email?.charAt(0) || "?"}
                              </div>

                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-900 font-medium">{request.requester.username}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{request.requester.email}</p>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-2 mt-2">
                                  <button
                                    onClick={() => handleAccept(request._id)}
                                    className="flex items-center gap-1 px-3 py-1 bg-purple-600 text-white text-xs font-medium rounded-full hover:bg-purple-700 transition-colors"
                                  >
                                    <Check className="w-3 h-3" />
                                    Accept
                                  </button>
                                  <button
                                    onClick={() => handleDecline(request._id)}
                                    className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full hover:bg-gray-200 transition-colors"
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

            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={item.onClick}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors group cursor-pointer"
              >
                <item.icon className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden py-4 px-2 space-y-2">
            {/* Mobile Notifications */}
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 opacity-70" />
                <span>Notifications</span>
              </div>
              {connectionRequests.length > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{connectionRequests.length}</span>
              )}
            </button>

            {menuItems.map((item) =>
              item.href ? (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center space-x-2 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <item.icon className="w-5 h-5 opacity-70" />
                  <span>{item.label}</span>
                </a>
              ) : (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className="w-full flex items-center space-x-2 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-left"
                >
                  <item.icon className="w-5 h-5 opacity-70" />
                  <span>{item.label}</span>
                </button>
              ),
            )}
          </nav>
        )}

        {/* Mobile Notifications Panel */}
        {isMobileMenuOpen && isNotificationsOpen && (
          <div className="md:hidden bg-white rounded-lg shadow-lg mt-2 mb-4">
            <div className="px-4 py-2 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900">Connection Requests</h3>
            </div>

            {connectionRequests.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500">No new notifications</div>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                {connectionRequests
                  .filter((req) => req.requester && (req.requester.username || req.requester.email))
                  .map((request) => (
                    <div
                      key={request._id}
                      className="px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                          {request.requester?.username?.charAt(0) || request.requester?.email?.charAt(0) || "?"}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 font-medium">{request.requester.username}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{request.requester.email}</p>

                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => handleAccept(request._id)}
                              className="flex items-center gap-1 px-3 py-1 bg-purple-600 text-white text-xs font-medium rounded-full hover:bg-purple-700 transition-colors"
                            >
                              <Check className="w-3 h-3" />
                              Accept
                            </button>
                            <button
                              onClick={() => handleDecline(request._id)}
                              className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full hover:bg-gray-200 transition-colors"
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

      {/* Decorative bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-300 via-white/20 to-purple-300" />
    </header>
  );
}
