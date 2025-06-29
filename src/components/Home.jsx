import React, { useEffect, useState } from "react";
import { Header } from "./Header";
import Footer from "./Footer";
import { Users, Mail, Video, MessageSquare, Loader2, Search, UserPlus } from "lucide-react";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, selectAllUsers, selectUsersStatus, selectUsersError, addUser } from "../features/users/userSlice";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext";

const notify = () => toast.success('Request Sent!');
const showError = (err) => toast.error(err.response?.data?.error || err.message);

const UserCard = ({ user, onConnect, isConnected, isPending, onRemoveConnection }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div className="flex gap-4">
        {/* User Avatar */}
        <div className="w-12 h-12 min-w-[48px] min-h-[48px] rounded-full bg-gradient-to-br from-pink-500 to-indigo-500 flex items-center justify-center text-white text-lg font-semibold shrink-0">
          {user.username?.charAt(0) || user.email?.charAt(0)}
        </div>

        {/* User Info */}
        <div>
          <h3 className="font-semibold text-gray-900">{user.username}</h3>
          {/* Skills */}
          {user.skills && user.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {user.skills.slice(0, 3).map((skill, index) => (
                <span key={index} className="px-2 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-medium">
                  {skill}
                </span>
              ))}
              {user.skills.length > 3 && (
                <span className="px-2 py-1 bg-gray-50 text-gray-600 rounded-full text-xs font-medium">
                  +{user.skills.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        {isConnected ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemoveConnection(user);
            }}
            className="flex cursor-pointer items-center justify-center space-x-2 px-3 py-2 bg-red-500 text-white hover:bg-red-600 rounded-lg transition-colors"
            title="Remove Connection"
          >
            <p className="text-lg font-medium">Remove</p>
          </button>
        ) : isPending ? (
          <button
            disabled
            className="flex items-center justify-center space-x-2 px-3 py-2 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed"
            title="Request Sent"
          >
            <p className="text-lg font-medium">Request sent...</p>
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onConnect(user);
            }}
            className="flex cursor-pointer items-center justify-center space-x-2 px-3 py-2 bg-purple-600 text-white hover:bg-purple-500 rounded-lg transition-colors"
            title="Connect"
          >
            <p className="text-lg font-medium">Connect</p>
            <UserPlus className="w-5 h-5 text-lg" />
          </button>
        )}
        <Toaster />
      </div>
    </div>

    {/* Bio */}
    {user.bio && <p className="mt-4 text-sm text-gray-600 line-clamp-2">{user.bio}</p>}
  </div>
);

const Home = () => {
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [connectionRequests, setConnectionRequests] = useState([]);
  const [connectedUsers, setConnectedUsers] = useState([]);

  // Add a state for outgoing pending requests
  const [outgoingRequests, setOutgoingRequests] = useState([]);

  const dispatch = useDispatch();
  const users = useSelector(selectAllUsers);
  const usersStatus = useSelector(selectUsersStatus);
  const usersError = useSelector(selectUsersError);
  const socket = useSocket();
  const currentUserId = useSelector(state => state.auth.user?._id);
  const navigate = useNavigate();

  // Fetch users on mount
  useEffect(() => {
    if (usersStatus === 'idle') {
      dispatch(fetchUsers());
    }
  }, [usersStatus, dispatch]);

  useEffect(() => {
    const fetchConnectionRequests = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve the token from localStorage
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/connections`, {
          headers: {
            'Authorization': `Bearer ${token}` // Include the token in the Authorization header
          }
        });
        setConnectionRequests(Array.isArray(response.data.connections) ? response.data.connections : []);
      } catch (err) {
        showError(err);
      }
    };

    fetchConnectionRequests();
  }, []);

  // Fetch connections
  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/connections/matches`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setConnectedUsers(res.data.matches || []);
      } catch (err) {
        showError(err);
      }
    };
    fetchConnections();
  }, []);

  // Handle search
  useEffect(() => {
    const filtered = (Array.isArray(users) ? users : []).filter(
      (user) =>
        user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.skills?.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase())),
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  // When user clicks connect
  const handleConnect = async (user) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/connections`,
        { userId: user._id },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Optimistically add to outgoing requests
      setOutgoingRequests(prev => [...prev, user._id]);
      notify();
    } catch (err) {
      showError(err);
    }
  };

  const handleAccept = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/connections/${requestId}/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Connection accepted');
      refetchConnections();
    } catch (err) {
      showError(err);
    }
  };

  const handleDecline = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/connections/${requestId}/decline`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Update the connection requests state
      setConnectionRequests((prevRequests) =>
        prevRequests.filter((request) => request._id !== requestId)
      );
      toast.success('Connection declined');
    } catch (err) {
      showError(err);
    }
  };

  const handleRemoveConnection = async (connectionId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/connections/${connectionId}/decline`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Connection removed");
      refetchConnections();
    } catch (err) {
      showError(err);
    }
  };

  const refetchConnections = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/connections/matches`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setConnectedUsers(res.data.matches || []);
    } catch (err) {
      showError(err);
    }
  };

  // Real-time socket handlers
  useEffect(() => {
    if (!socket) return;

    socket.emit("join", currentUserId);

    socket.on('userRegistered', (user) => {
      dispatch(addUser(user));
    });

    // When you receive a new connection request (incoming)
    socket.on('connectionRequestSent', (connection) => {
      if (connection.recipient === currentUserId) {
        setConnectionRequests(prev => [...prev, connection]);
      }
      // If you are the requester, remove from outgoingRequests (in case of race condition)
      if (connection.requester._id === currentUserId) {
        setOutgoingRequests(prev => prev.filter(id => id !== connection.recipient._id));
      }
    });

    // When a connection is accepted
    socket.on('connectionAccepted', (connection) => {
      // Remove from pending requests for both users
      setConnectionRequests(prev => prev.filter(req => req._id !== connection._id));
      setOutgoingRequests(prev => prev.filter(id =>
        id !== (connection.requester._id === currentUserId ? connection.recipient._id : connection.requester._id)
      ));
      // Refetch connections for both users
      if (connection.requester._id === currentUserId || connection.recipient._id === currentUserId) {
        refetchConnections();
      }
    });

    // When a connection is declined or removed
    socket.on('connectionDeclined', ({ connectionId, remover }) => {
      setConnectionRequests(prev => prev.filter(req => req._id !== connectionId));
      setConnectedUsers(prev => prev.filter(match => match.connectionId !== connectionId));
    });

    return () => {
      socket.off('userRegistered');
      socket.off('connectionRequestSent');
      socket.off('connectionAccepted');
      socket.off('connectionDeclined');
    };
  }, [socket, currentUserId, dispatch]);

  const isPendingRequest = (userId) =>
    outgoingRequests.includes(userId) ||
    connectionRequests.some(
      (req) => req.requester && req.requester._id === userId
    );

  const isConnected = (userId) =>
    connectedUsers.some(
      (conn) => conn.user && conn.user._id === userId
    );

  // Update UserCard usage:
  // (inside your users grid)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header connectionRequests={connectionRequests} handleAccept={handleAccept} handleDecline={handleDecline} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Find People</h1>
              <p className="mt-1 text-gray-500">Connect with other people in the community</p>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>
        </div>


        {/* Error State */}
        {error && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-500">{error}</div>}

        {/* Loading State */}
        {usersStatus === 'loading' ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
          </div>
        ) : usersStatus === 'failed' ? (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-500">{usersError}</div>
        ) : filteredUsers.length === 0 ? (
          // Empty State
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No users found</h3>
            <p className="mt-1 text-gray-500">
              {searchQuery ? "Try adjusting your search terms" : "Users will appear here when they join"}
            </p>
          </div>
        ) : (
          // Users Grid
          <div className="grid grid-cols-1 gap-6">
            {Array.isArray(filteredUsers) && filteredUsers.map(user => (
              <div
                key={user._id}
                className="cursor-pointer hover:bg-gray-100 p-4 rounded"
                onClick={() => navigate(`/profile/${user._id}`)}
              >
                <UserCard
                  user={user}
                  onConnect={handleConnect}
                  isConnected={isConnected(user._id)}
                  isPending={isPendingRequest(user._id)}
                  onRemoveConnection={() => {
                    const match = connectedUsers.find(conn => conn.user && conn.user._id === user._id);
                    if (match) handleRemoveConnection(match.connectionId);
                  }}
                />
              </div>
            ))}
          </div>
        )}


      </main>

      <Footer />
    </div>
  );
};

export default Home;

