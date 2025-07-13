import React, { useEffect } from 'react';
import { Check, X as XMark } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchRequests, acceptConnectionRequest, rejectConnectionRequest } from '../features/connectionsSlice.js/connectionSlice';
import { useSocket } from '../context/SocketContext'

const ConnectionRequests = ({ open }) => {
  const dispatch = useDispatch();
  const { requests: connectionRequests, status } = useSelector((state) => state.connections);
  const socket = useSocket()
  const currentUserId = useSelector((state) => state.auth.user?._id)

  const safeRequests = Array.isArray(connectionRequests) ? connectionRequests : [];

  useEffect(() => {
    if (open && status === 'idle') {
      dispatch(fetchRequests());
    }
  }, [open, status, dispatch]);

  const handleAccept = (id) => {
    dispatch(acceptConnectionRequest(id));
    // Optionally, make API call here to update backend
  };

  const handleDecline = (id) => {
    dispatch(rejectConnectionRequest(id));
    // Optionally, make API call here to update backend
  };

    useEffect(() => {
      if (!socket || !currentUserId) return;
  
      socket.on("newConnectionRequest", (connection) => {
        dispatch(addRequest(connection));
      });
  
      socket.on("connectionAccepted", () => {
        dispatch(fetchRequests());
      });
  
      socket.on("connectionDeclined", () => {
        dispatch(fetchRequests());
      });
  
      socket.on("connectionRemoved", ({ connectionId }) => {
        setConnectedUsers((prev) => prev.filter((match) => match.connectionId !== connectionId));
      });
  
      return () => {
        socket.off("newConnectionRequest");
        socket.off("connectionRequestSent");
        socket.off("connectionAccepted");
        socket.off("connectionDeclined");
        socket.off("connectionRemoved");
      };
    }, [socket, currentUserId, dispatch]);

  return (
    <div className="relative">
      {/* Dropdown only if open */}
      {open && (
        <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 py-2 z-50 backdrop-blur-xl">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Connection Requests</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage your pending connections</p>
          </div>
          {status === 'loading' ? (
            <div className="px-6 py-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">Loading...</p>
            </div>
          ) : safeRequests.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">No new notifications</p>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {safeRequests
                .filter((req) => req.requester && (req.requester.username || req.requester.email))
                .map((request) => (
                  <div key={request._id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-100 dark:border-white/5 last:border-0">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold flex-shrink-0 shadow-lg">
                        {request.requester?.username?.charAt(0) || request.requester?.email?.charAt(0) || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{request.requester.username}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{request.requester.email}</p>
                        <div className="flex items-center gap-2 mt-3">
                          <button
                            onClick={() => handleAccept(request._id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-medium rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg"
                          >
                            <Check className="w-3 h-3" /> Accept
                          </button>
                          <button
                            onClick={() => handleDecline(request._id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full hover:bg-gray-200 dark:hover:bg-white/20 transition-all duration-200"
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