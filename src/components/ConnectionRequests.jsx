import React, { useEffect } from "react";
import { Check, X as XMark } from "lucide-react";
import { useSelector } from "react-redux";
import { useSocket } from "../context/SocketContext";

import {
  useListConnectionsQuery,
  useAcceptConnectionMutation,
  useRejectConnectionMutation,
} from "../services/connectionsApi";

const ConnectionRequests = ({ open }) => {
  const socket = useSocket();
  const currentUserId = useSelector((state) => state.auth.user?._id);

const { data: connectionsData, isLoading, refetch: refetchRequests } = useListConnectionsQuery();


  // SAFE pending incoming requests
const safeRequests =
  connectionsData?.connections?.filter(
    (c) =>
      c.status === "pending" &&
      c.recipient === currentUserId   // pending incoming requests
  ) || [];

  const [acceptRequest] = useAcceptConnectionMutation();
  const [rejectRequest] = useRejectConnectionMutation();

  const handleAccept = async (id) => {
    try {
      await acceptRequest(id).unwrap();
      refetchRequests();
    } catch (err) {
      console.error("Accept error:", err);
    }
  };

  const handleDecline = async (id) => {
    try {
      await rejectRequest(id).unwrap();
      refetchRequests();
    } catch (err) {
      console.error("Decline error:", err);
    }
  };

  // SOCKET real-time updates
  useEffect(() => {
    if (!socket || !currentUserId) return;

    socket.on("newConnectionRequest", refetchRequests);
    socket.on("connectionAccepted", refetchRequests);
    socket.on("connectionDeclined", refetchRequests);

    return () => {
      socket.off("newConnectionRequest");
      socket.off("connectionAccepted");
      socket.off("connectionDeclined");
    };
  }, [socket, currentUserId, refetchRequests]);

  return (
    <div className="relative">
      {open && (
        <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 py-2 z-50">
          
          <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Connection Requests
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage your pending connections
            </p>
          </div>

          {isLoading ? (
            <div className="px-6 py-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">Loading...</p>
            </div>
          ) : safeRequests.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                No new notifications
              </p>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {safeRequests.map((request) => (
                <div
                  key={request._id}
                  className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-white/5 border-b dark:border-white/5"
                >
                  <div className="flex items-start gap-4">

                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                      {request.requester?.username?.charAt(0) ||
                        request.requester?.email?.charAt(0)}
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {request.requester.username}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {request.requester.email}
                      </p>

                      <div className="flex items-center gap-2 mt-3">
                        <button
                          onClick={() => handleAccept(request._id)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full"
                        >
                          <Check className="w-3 h-3" /> Accept
                        </button>

                        <button
                          onClick={() => handleDecline(request._id)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-white/10 text-xs rounded-full"
                        >
                          <XMark className="w-3 h-3" /> Decline
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
  );
};

export default ConnectionRequests;
