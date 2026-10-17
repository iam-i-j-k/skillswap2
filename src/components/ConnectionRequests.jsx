import React from "react";
import { Check, X as XMark } from "lucide-react";
import { useSelector } from "react-redux";

import {
  useAcceptConnectionMutation,
  useRejectConnectionMutation,
} from "../services/connectionsApi";

const ConnectionRequests = ({ 
  open = true, 
  requests = [], 
  loading = false, 
  onUpdate,
  inline = false,
}) => {
  const currentUserId = useSelector((state) => state.auth.user?._id);

  const [acceptRequest] = useAcceptConnectionMutation();
  const [rejectRequest] = useRejectConnectionMutation();

  const handleAccept = async (id) => {
    try {
      console.log("✅ Accepting connection request:", id);
      await acceptRequest(id).unwrap();
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error("Accept error:", err);
    }
  };

  const handleDecline = async (id) => {
    try {
      console.log("❌ Declining connection request:", id);
      await rejectRequest(id).unwrap();
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error("Decline error:", err);
    }
  };

  if (!open) return null;

  const content = (
    <div className="w-full">
      {loading ? (
        <div className="px-4 py-4 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">Loading requests...</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="px-4 py-4 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">No new connection requests</p>
        </div>
      ) : (
        <div className="max-h-64 overflow-y-auto divide-y divide-gray-100 dark:divide-slate-700/60">
          {requests.map((request) => {
            const requester = request.requester;
            const displayName = requester?.username || requester?.email || "SkillSwap User";
            const initial = displayName.charAt(0).toUpperCase();

            return (
              <div
                key={request._id}
                className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-700/40 transition flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">
                    {initial}
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {displayName}
                    </p>
                    {requester?.skills?.length > 0 ? (
                      <p className="text-xs text-purple-600 dark:text-purple-400 truncate">
                        {requester.skills.slice(0, 2).join(", ")}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        Wants to connect
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => handleAccept(request._id)}
                    title="Accept connection"
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Accept</span>
                  </button>

                  <button
                    onClick={() => handleDecline(request._id)}
                    title="Decline request"
                    className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 text-xs font-medium transition"
                  >
                    <XMark className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Decline</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  if (inline) {
    return content;
  }

  return (
    <div className="relative">
      <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 py-2 z-50">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-white/10">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Connection Requests
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Manage your pending connections
          </p>
        </div>
        {content}
      </div>
    </div>
  );
};

export default ConnectionRequests;