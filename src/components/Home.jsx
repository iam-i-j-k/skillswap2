import React, { useEffect, useMemo, useState } from "react";
import { Users, Loader2, Search, UserPlus, Award, MessageSquare } from "lucide-react";

import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { useGetAllUsersQuery } from "../services/usersApi";
import {
  useListConnectionsQuery,
  useSendConnectionRequestMutation,
  useRemoveConnectionMutation,
  useGetMatchesQuery,
} from "../services/connectionsApi";

import { useSocket } from "../context/SocketContext";


const UserCard = ({ user, onConnect, onRemove, isConnected, isPending }) => {
  const needsMarquee = (text, limit) => text && text.length > limit;

  return (
    <div
      className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 
      rounded-2xl p-6 flex flex-col justify-between hover:shadow-md transition-shadow duration-300 h-52 sm:h-48"
    >
      {/* Top Section */}
      <div className="flex items-start gap-4">
        {/* Avatar */}
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.username}
            className="w-14 h-14 rounded-xl object-cover border border-gray-200 dark:border-slate-700 flex-shrink-0"
          />
        ) : (
          <div
            className="w-14 h-14 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white 
            flex items-center justify-center font-semibold text-lg flex-shrink-0"
          >
            {user.username?.charAt(0)?.toUpperCase()}
          </div>
        )}

        {/* User Info */}
        <div className="flex-1 min-w-0">
          {/* Username */}
          {needsMarquee(user.username, 18) ? (
            <div className="marquee-container h-6">
              <h3 className="marquee-text font-semibold text-gray-900 dark:text-white">
                {user.username}
              </h3>
            </div>
          ) : (
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {user.username}
            </h3>
          )}

          {/* Email */}
          {needsMarquee(user.email, 24) ? (
            <div className="marquee-container h-5 mt-1">
              <p className="marquee-text text-gray-500 dark:text-gray-400 text-sm">
                {user.email}
              </p>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              {user.email}
            </p>
          )}

          {/* Skills — ONE LINE ONLY — max 2 skills */}
          <div className="flex items-center gap-2 mt-3 overflow-hidden whitespace-nowrap">
            {user.skills?.slice(0, 2).map((s) => (
              <span
                key={s}
                className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 
                rounded-lg text-xs font-medium truncate"
              >
                {s}
              </span>
            ))}

            {user.skills?.length > 2 && (
              <span
                className="px-2 py-1 bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-gray-300 
              rounded-lg text-xs font-medium"
              >
                +{user.skills.length - 2} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Button Section */}
      <div className="mt-4">
        {isConnected ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(user);
            }}
            className="w-full py-2 text-sm bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 
            rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
          >
            Remove
          </button>
        ) : isPending ? (
          <button
            disabled
            className="w-full py-2 text-sm bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 
            rounded-lg"
          >
            Pending
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onConnect(user);
            }}
            className="w-full flex items-center justify-center gap-2 py-2 text-sm 
            bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 
            text-white rounded-lg transition-all"
          >
            <UserPlus className="w-4 h-4" /> Connect
          </button>
        )}
      </div>
    </div>
  );
};


const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { socket, isConnected: socketConnected } = useSocket(); // Rename here
  const currentUserId = useSelector((s) => s.auth.user?._id);
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  // Check socket connection
  useEffect(() => {
    if (socket) {
      setIsSocketConnected(socket.connected);
      
      const handleConnect = () => {
        console.log("✅ Socket connected");
        setIsSocketConnected(true);
      };
      
      const handleDisconnect = () => {
        console.log("❌ Socket disconnected");
        setIsSocketConnected(false);
      };
      
      socket.on('connect', handleConnect);
      socket.on('disconnect', handleDisconnect);
      
      return () => {
        socket.off('connect', handleConnect);
        socket.off('disconnect', handleDisconnect);
      };
    }
  }, [socket]);

  // API Calls
  const { data: usersData, isLoading: usersLoading } = useGetAllUsersQuery();
  const users = usersData?.users || [];

  const { data: connectionsData } = useListConnectionsQuery();
  const { data: matchesData } = useGetMatchesQuery();

  const [sendConnect] = useSendConnectionRequestMutation();
  const [removeConnect] = useRemoveConnectionMutation();

  // Outgoing requests
  const outgoingRequests = useMemo(() => {
    return (
      connectionsData?.pendingConnections
        ?.filter((c) => c.requester?._id === currentUserId)
        ?.map((c) => c.recipient?._id) || []
    );
  }, [connectionsData, currentUserId]);

  // Connected users
  const connectedUsers = useMemo(() => {
    return (
      matchesData?.matches?.map((m) => ({
        user: m.user,
        connectionId: m.connectionId,
      })) || []
    );
  }, [matchesData]);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter(
      (u) =>
        u._id !== currentUserId && ( // Exclude current user
        u.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.skills?.some((s) =>
          s.toLowerCase().includes(searchQuery.toLowerCase())
        ))
    );
  }, [users, searchQuery, currentUserId]);

  // Rename this function to avoid conflict
  const isUserConnected = (id) => connectedUsers.some((u) => u.user?._id === id);
  const isPending = (id) => outgoingRequests.includes(id);

  const onConnect = async (user) => {
    try {
      // Use the renamed socketConnected variable
      if (!socket || !socketConnected || !currentUserId) {
        toast.error("Please wait for connection...");
        return;
      }
      
      // First, make the API call to create the connection
      console.log("📨 Sending connection request to:", user.username);
      const result = await sendConnect(user._id).unwrap();
      
      toast.success("Request Sent!");

      // Then emit socket event for real-time updates
      console.log("📤 Emitting send-connection-request socket event");
      socket.emit("send-connection-request", {
        requesterId: currentUserId,
        recipientId: user._id,
      }, (ack) => {
        if (ack?.error) {
          console.error("Socket emission failed:", ack.error);
          toast.error("Real-time update failed, but request was sent");
        } else {
          console.log("✅ Socket event delivered successfully");
        }
      });

    } catch (err) {
      console.error("Connection request failed:", err);
      toast.error(err?.data?.error || "Failed to send connection request");
    }
  };

  const onRemove = async (user) => {
    const match = connectedUsers.find((c) => c.user?._id === user._id);
    if (!match) {
      toast.error("Connection not found");
      return;
    }

    try {
      // First, make the API call to remove the connection
      console.log("🗑️ Removing connection with:", user.username);
      await removeConnect(match.connectionId).unwrap();
      toast.success("Connection Removed!");

      // Then emit socket event for real-time updates
      console.log("📤 Emitting remove-connection socket event");
      socket.emit("remove-connection", {
        connectionId: match.connectionId,
        userId1: currentUserId,
        userId2: user._id,
      }, (ack) => {
        if (ack?.error) {
          console.error("Socket emission failed:", ack.error);
          toast.error("Real-time update failed, but connection was removed");
        } else {
          console.log("✅ Socket event delivered successfully");
        }
      });

    } catch (err) {
      console.error("Remove connection failed:", err);
      toast.error(err?.data?.error || "Failed to remove connection");
    }
  };

  // Stats
  const statsData = [
    {
      icon: Users,
      title: "People Available",
      value: filteredUsers.length,
    },
    {
      icon: MessageSquare,
      title: "Your Connections",
      value: connectedUsers.length,
    },
    {
      icon: Award,
      title: "Skills Available",
      value: new Set(filteredUsers.flatMap((u) => u.skills || [])).size,
    },
  ];

  return (
    <div className="bg-gray-50 dark:bg-slate-900 min-h-screen">
      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-100%); }
          }

          .marquee-text {
            display: inline-block;
            white-space: nowrap;
            padding-right: 20px;
            animation: marquee 8s linear infinite;
            animation-play-state: paused;
          }

          .marquee-container:hover .marquee-text {
            animation-play-state: running;
          }

          .marquee-container {
            overflow: hidden;
            width: 100%;
          }
        `}
      </style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Discover People
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Find and connect with professionals in your network
          </p>

          {/* Search */}
          <div className="relative max-w-lg">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-slate-900 
                border border-gray-200 dark:border-slate-700 rounded-lg 
                text-gray-900 dark:text-white placeholder-gray-500 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                transition-colors duration-200"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {statsData.map((stat, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 
                rounded-lg p-6 flex items-center justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
              <stat.icon className={`w-6 h-6 ${
                i === 0 ? 'text-blue-400' : i === 1 ? 'text-green-400' : 'text-purple-400'
              }`} />
            </div>
          ))}
        </div>

        {/* User Grid */}
        {usersLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No users found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery ? 'Try adjusting your search terms' : 'No users available to connect with'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((u) => (
              <div
                key={u._id}
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => navigate(`/profile/${u._id}`)}
              >
                <UserCard
                  user={u}
                  onConnect={onConnect}
                  onRemove={onRemove}
                  isConnected={isUserConnected(u._id)} // Use renamed function
                  isPending={isPending(u._id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;