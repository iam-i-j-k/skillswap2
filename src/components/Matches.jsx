import React from "react";
import { useNavigate } from "react-router-dom";
import { Users, Loader2, MessageSquare, Phone, Video } from "lucide-react";
import { useGetMatchesQuery } from "../services/connectionsApi";

const Matches = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useGetMatchesQuery();
  const matches = data?.matches || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-900 dark:text-white font-medium">
            Loading your matches...
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            Finding your connections
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 border border-red-200 dark:border-red-500/20 rounded-lg p-8 text-center max-w-md">
          <Users className="w-8 h-8 text-red-600 dark:text-red-400 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-red-600 dark:text-red-400 mb-2">
            Error Loading Matches
          </h2>
          <p className="text-red-500 dark:text-red-300 text-sm">
            {error?.data?.error || error?.error || "Something went wrong"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12 text-center sm:text-left">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Your Connections
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Connect, collaborate, and learn from amazing people in your network
          </p>
        </div>

        {/* Empty State */}
        {matches.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-10 sm:p-12 text-center max-w-sm mx-auto">
            <Users className="w-10 h-10 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No Connections Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
              Start connecting with people to build your network.
            </p>
            <button
              onClick={() => navigate("/home")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-all font-medium"
            >
              Find People
            </button>
          </div>
        ) : (
          <>
            {/* Stats Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-12">
              <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-6">
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">
                  Total Connections
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {matches.length}
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-6">
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">
                  Combined Skills
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {matches.reduce((acc, m) => acc + (m.user?.skills?.length || 0), 0)}
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-6">
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">
                  Unique Skills
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {new Set(matches.flatMap((m) => m.user?.skills || [])).size}
                </p>
              </div>
            </div>

            {/* Match Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.map(({ connectionId, user }) => (
                <div
                  key={connectionId}
                  className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 hover:shadow-md transition-shadow duration-200"
                >
                  {/* Header (Avatar + Info) */}
                  <div className="flex items-start gap-3 mb-4">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.username}
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-gray-200 dark:border-slate-700"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg flex-shrink-0 bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                        {user.username?.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                        {user.username}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 text-xs truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {/* Bio */}
                  {user.bio && (
                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                      {user.bio}
                    </p>
                  )}

                  {/* Skills */}
                  {user.skills && user.skills.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                      {user.skills.slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/chat/${user._id}`)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-sm rounded-lg transition-all"
                    >
                      <MessageSquare className="w-4 h-4" /> Chat
                    </button>

                    <button className="p-2.5 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors">
                      <Phone className="w-4 h-4" />
                    </button>

                    <button className="p-2.5 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors">
                      <Video className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Matches;
