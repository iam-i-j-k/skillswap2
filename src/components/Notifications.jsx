import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  ArrowRight,
  Bell,
  BellOff,
  Check,
  CheckCheck,
  UserPlus,
  X as XMark,
  Users,
  Sparkles,
  Loader2,
} from 'lucide-react';
import {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
} from '../services/platformApi';
import {
  useListConnectionsQuery,
  useAcceptConnectionMutation,
  useRejectConnectionMutation,
} from '../services/connectionsApi';

const TYPE_COLORS = {
  swap_request: 'bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300',
  swap_counter: 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300',
  swap_confirmed: 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-300',
  swap_completed: 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300',
  review: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-300',
  dispute: 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-300',
  default: 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300',
};

export default function Notifications() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'requests' | 'activity'

  const authUser = useSelector((state) => state.auth.user);
  const currentUserId = authUser?._id;

  // Platform notifications
  const { data: notifData, isLoading: notifsLoading, refetch: refetchNotifs } = useGetNotificationsQuery();
  const [markRead] = useMarkNotificationReadMutation();

  // Connection requests
  const {
    data: connectionsData,
    isLoading: connectionsLoading,
    refetch: refetchConnections,
  } = useListConnectionsQuery(undefined, { refetchOnMountOrArgChange: true });

  const [acceptConnection, { isLoading: isAccepting }] = useAcceptConnectionMutation();
  const [rejectConnection, { isLoading: isRejecting }] = useRejectConnectionMutation();

  const notifications = notifData?.notifications || [];
  const unreadNotifs = notifications.filter((n) => !n.read);

  const pendingRequests =
    connectionsData?.connections?.filter((c) => {
      const recipientId = c?.recipient?._id || c?.recipient;
      const currentId = currentUserId?._id || currentUserId;
      return c.status === 'pending' && (!recipientId || String(recipientId) === String(currentId));
    }) || [];

  const totalUnread = pendingRequests.length + unreadNotifs.length;

  const handleMark = async (id) => {
    try {
      await markRead(id).unwrap();
      refetchNotifs();
    } catch {
      toast.error('Could not mark as read');
    }
  };

  const handleMarkAll = async () => {
    try {
      await Promise.all(unreadNotifs.map((n) => markRead(n._id).unwrap().catch(() => null)));
      refetchNotifs();
      toast.success('All activity notifications marked as read');
    } catch {
      toast.error('Failed to mark all as read');
    }
  };

  const handleAcceptRequest = async (id) => {
    try {
      await acceptConnection(id).unwrap();
      toast.success('Connection request accepted!');
      refetchConnections();
    } catch (err) {
      toast.error(err?.data?.message || 'Could not accept connection');
    }
  };

  const handleDeclineRequest = async (id) => {
    try {
      await rejectConnection(id).unwrap();
      toast.success('Connection request declined');
      refetchConnections();
    } catch (err) {
      toast.error(err?.data?.message || 'Could not decline connection');
    }
  };

  const handleClickNotif = (n) => {
    if (!n.read) handleMark(n._id);
    if (n.link) navigate(n.link);
  };

  const isLoading = notifsLoading || connectionsLoading;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                Notifications
                {totalUnread > 0 && (
                  <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 rounded-full bg-red-500 text-white text-xs font-bold">
                    {totalUnread}
                  </span>
                )}
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Stay updated on your connections, swaps, and activity
              </p>
            </div>
          </div>

          {unreadNotifs.length > 0 && (
            <button
              onClick={handleMarkAll}
              className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition shadow-sm"
            >
              <CheckCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              Mark all activity read
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-gray-200 dark:border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
              activeTab === 'all'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
            }`}
          >
            All ({pendingRequests.length + notifications.length})
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
              activeTab === 'requests'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Requests ({pendingRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
              activeTab === 'activity'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
            }`}
          >
            Activity ({notifications.length})
          </button>
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading your notifications...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* CONNECTION REQUESTS SECTION */}
            {(activeTab === 'all' || activeTab === 'requests') && pendingRequests.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    Pending Connection Requests ({pendingRequests.length})
                  </h2>
                </div>

                <div className="space-y-3">
                  {pendingRequests.map((request) => {
                    const requester = request.requester;
                    const displayName = requester?.username || requester?.email || 'SkillSwap Member';
                    const initial = displayName.charAt(0).toUpperCase();

                    return (
                      <div
                        key={request._id}
                        className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800 border border-purple-200/80 dark:border-purple-500/20 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-base font-bold flex-shrink-0 shadow-md">
                            {initial}
                          </div>
                          <div className="min-w-0">
                            <p className="text-base font-semibold text-gray-900 dark:text-white truncate">
                              {displayName}
                            </p>
                            {requester?.email && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {requester.email}
                              </p>
                            )}
                            {requester?.skills?.length > 0 ? (
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {requester.skills.slice(0, 3).map((skill, i) => (
                                  <span
                                    key={i}
                                    className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            ) : requester?.bio ? (
                              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-1">
                                {requester.bio}
                              </p>
                            ) : (
                              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                                Wants to connect with you
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                          <button
                            onClick={() => handleAcceptRequest(request._id)}
                            disabled={isAccepting}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition shadow-sm disabled:opacity-50"
                          >
                            <Check className="w-4 h-4" />
                            Accept
                          </button>
                          <button
                            onClick={() => handleDeclineRequest(request._id)}
                            disabled={isRejecting}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 text-xs font-semibold transition disabled:opacity-50"
                          >
                            <XMark className="w-4 h-4" />
                            Decline
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* PLATFORM ACTIVITY SECTION */}
            {(activeTab === 'all' || activeTab === 'activity') && notifications.length > 0 && (
              <div className="space-y-3">
                {activeTab === 'all' && pendingRequests.length > 0 && (
                  <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2 pt-2">
                    <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    Activity & Updates
                  </h2>
                )}

                <div className="space-y-2">
                  {notifications.map((n) => {
                    const colorClass = TYPE_COLORS[n.type] || TYPE_COLORS.default;
                    return (
                      <div
                        key={n._id}
                        onClick={() => handleClickNotif(n)}
                        className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition ${
                          n.read
                            ? 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 opacity-70 hover:opacity-100'
                            : 'bg-purple-50/50 dark:bg-purple-500/5 border-purple-200 dark:border-purple-500/30 hover:bg-purple-100/50 dark:hover:bg-purple-500/10'
                        }`}
                      >
                        {/* Type indicator dot */}
                        <span
                          className={`mt-1.5 flex-shrink-0 w-2.5 h-2.5 rounded-full ${
                            n.read ? 'bg-gray-300 dark:bg-slate-600' : 'bg-purple-500'
                          }`}
                        />

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p
                              className={`text-sm font-semibold ${
                                n.read ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white'
                              }`}
                            >
                              {n.title}
                            </p>
                            <span className="text-xs text-gray-400 flex-shrink-0">
                              {new Date(n.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          {n.message && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                              {n.message}
                            </p>
                          )}
                          <div className="flex items-center gap-3 mt-2 flex-wrap">
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${colorClass}`}>
                              {n.type?.replace(/_/g, ' ')}
                            </span>
                            {n.link && (
                              <span className="inline-flex items-center gap-0.5 text-xs text-purple-600 dark:text-purple-400 hover:underline">
                                View details <ArrowRight className="w-3 h-3" />
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Mark read button */}
                        {!n.read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMark(n._id);
                            }}
                            title="Mark as read"
                            className="flex-shrink-0 p-1.5 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-500/20 text-purple-600 dark:text-purple-400"
                          >
                            <CheckCheck className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* EMPTY STATE */}
            {((activeTab === 'all' && pendingRequests.length === 0 && notifications.length === 0) ||
              (activeTab === 'requests' && pendingRequests.length === 0) ||
              (activeTab === 'activity' && notifications.length === 0)) && (
              <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-12 text-center space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-slate-500 flex items-center justify-center">
                  <BellOff className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {activeTab === 'requests'
                    ? 'No pending connection requests'
                    : activeTab === 'activity'
                    ? 'No activity updates'
                    : "You're all caught up!"}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                  {activeTab === 'requests'
                    ? 'When other users ask to connect or swap skills with you, their requests will appear here.'
                    : activeTab === 'activity'
                    ? 'Updates on your swaps, reviews, and platform messages will be displayed here.'
                    : 'No pending connection requests or activity updates at this moment.'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
