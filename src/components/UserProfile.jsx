import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Share2,
  Mail,
  Star,
  Clock,
  Loader2,
  UserPlus,
  UserCheck,
  Award,
  Users,
  MessageSquare,
} from "lucide-react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

import { useGetUserQuery } from "../services/usersApi";
import {
  useGetConnectionStatusQuery,
  useSendConnectionRequestMutation,
  useListConnectionsQuery,
} from "../services/connectionsApi";

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const currentUserId = useSelector((s) => s.auth.user?._id);

  const { data: userData, isLoading, isError, error } = useGetUserQuery(userId, {
    skip: !userId,
  });
  const profile = userData?.user;

  const { data: statusData, refetch: refetchStatus } =
    useGetConnectionStatusQuery(userId);
  const connectionStatus = statusData?.status || "none";

  const { data: connectionsList } = useListConnectionsQuery();
  const outgoingRequests =
    connectionsList?.pendingConnections
      ?.filter((req) => req?.requester?._id === currentUserId)
      ?.map((req) => req?.recipient?._id) || [];

  const [sendConnectionRequest, { isLoading: isSending }] =
    useSendConnectionRequestMutation();

  const handleConnect = async () => {
    try {
      await sendConnectionRequest(userId).unwrap();
      toast.success("Connection request sent!");
      refetchStatus();
    } catch (err) {
      toast.error(err?.data?.error || "Failed to send request");
    }
  };

  const handleMessage = () => {
    if (connectionStatus !== "connected") return;
    navigate(`/chat/${userId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex justify-center items-center">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex justify-center items-center p-4">
        <div className="bg-red-50 dark:bg-red-500/10 p-8 rounded-2xl text-center max-w-md border border-red-200 dark:border-red-500/20">
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400">
            Error Loading Profile
          </h2>
          <p className="text-red-500 dark:text-red-300 mt-2">
            {error?.data?.error || "User not found"}
          </p>
        </div>
      </div>
    );
  }

  const mockStats = {
    connections: profile.totalConnections || 0,
    skillsShared: profile.skills?.length || 0,
    rating: (4.0 + Math.random()).toFixed(1),
    responseTime: Math.floor(Math.random() * 60) + 5,
  };

  const renderPrimaryAction = () => {
    if (connectionStatus === "connected") {
      return (
        <span className="px-4 py-2 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 rounded-lg flex items-center gap-2 border border-green-200 dark:border-green-500/20 font-medium">
          <UserCheck className="w-4 h-4" /> Connected
        </span>
      );
    }
    if (connectionStatus === "pending" || outgoingRequests.includes(userId)) {
      return (
        <span className="px-4 py-2 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 rounded-lg flex items-center gap-2 border border-amber-200 dark:border-amber-500/20 font-medium">
          <Clock className="w-4 h-4" /> Pending
        </span>
      );
    }
    return (
      <button
        onClick={handleConnect}
        disabled={isSending}
        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg flex items-center gap-2 disabled:opacity-50 font-medium transition-all duration-200 shadow-md hover:shadow-lg"
      >
        {isSending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <UserPlus className="w-4 h-4" />
        )}
        {isSending ? "Sending..." : "Connect"}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 px-4 py-2 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors font-medium text-gray-700 dark:text-gray-300"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Profile Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md overflow-hidden mb-8 border border-gray-100 dark:border-white/5">
          {/* ✅ Banner Section */}
          <div className="h-36 sm:h-44 relative">
            {profile.coverPhoto ? (
              <img
                src={profile.coverPhoto}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-purple-500 to-pink-500" />
            )}
          </div>

          {/* Profile Info Section */}
          <div className="p-6 sm:p-8 -mt-12 sm:-mt-14 flex flex-col sm:flex-row gap-6 items-center sm:items-end relative z-10">
            {/* ✅ Avatar */}
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.username}
                className="w-28 h-28 rounded-2xl object-cover border-4 border-white dark:border-slate-800 shadow-md flex-shrink-0"
              />
            ) : (
              <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold shadow-md flex-shrink-0 border-4 border-white dark:border-slate-800">
                {profile.username?.charAt(0)?.toUpperCase()}
              </div>
            )}

            {/* Info */}
            <div className="flex-1 min-w-0 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white truncate">
                {profile.username}
              </h1>
              <p className="flex items-center justify-center sm:justify-start gap-2 text-gray-600 dark:text-gray-400 mt-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{profile.email}</span>
              </p>
            </div>

            {/* ✅ Actions */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-end flex-wrap">
              {renderPrimaryAction()}

              {connectionStatus === "connected" && (
                <button
                  onClick={handleMessage}
                  className="px-4 py-2 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 rounded-lg flex items-center gap-2 font-medium text-gray-800 dark:text-gray-200 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" /> Start Chat
                </button>
              )}

              <button className="p-2 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 rounded-lg transition-colors text-gray-700 dark:text-gray-300">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Users} label="Connections" value={mockStats.connections} />
          <StatCard icon={Award} label="Skills" value={mockStats.skillsShared} />
          <StatCard icon={Star} label="Rating" value={mockStats.rating} />
          <StatCard icon={Clock} label="Response" value={`${mockStats.responseTime}m`} />
        </div>

        {/* About Section */}
        <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-md mb-8 border border-gray-100 dark:border-white/5">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            About
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
            {profile.bio || "This user hasn't added a bio yet."}
          </p>
        </div>

        {/* Skills Section */}
        <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-md border border-gray-100 dark:border-white/5">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Skills
            </h2>
            <span className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-500/20 dark:to-pink-500/20 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
              {profile.skills?.length || 0} skills
            </span>
          </div>

          {profile.skills?.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {profile.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium border border-gray-200 dark:border-gray-600"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 italic">No skills listed.</p>
          )}
        </div>
      </div>
    </div>
  );
};

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-white/5 text-center hover:shadow-md transition-shadow">
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-500/20 dark:to-pink-500/20 flex items-center justify-center mx-auto mb-3">
        <Icon className="w-5 h-5 text-purple-600 dark:text-purple-300" />
      </div>
      <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">
        {value}
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">{label}</div>
    </div>
  );
}

export default UserProfile;
