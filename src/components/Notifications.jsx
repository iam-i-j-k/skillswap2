import React from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Bell,
  BellOff,
  CheckCheck,
} from 'lucide-react';
import {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
} from '../services/platformApi';

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
  const { data, isLoading, refetch } = useGetNotificationsQuery();
  const [markRead] = useMarkNotificationReadMutation();

  const notifications = data?.notifications || [];
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMark = async (id) => {
    try {
      await markRead(id).unwrap();
      refetch();
    } catch {
      toast.error('Could not mark as read');
    }
  };

  const handleMarkAll = async () => {
    const unread = notifications.filter((n) => !n.read);
    await Promise.all(unread.map((n) => markRead(n._id).unwrap().catch(() => null)));
    refetch();
    toast.success('All notifications marked as read');
  };

  const handleClick = (n) => {
    if (!n.read) handleMark(n._id);
    if (n.link) navigate(n.link);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Bell className="w-7 h-7 text-purple-500" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold">
                  {unreadCount}
                </span>
              )}
            </h1>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAll}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
            >
              <CheckCheck className="w-4 h-4" /> Mark all read
            </button>
          )}
        </div>

        {isLoading ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">Loading notifications...</p>
        ) : notifications.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-12 text-center">
            <BellOff className="w-12 h-12 text-gray-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">You're all caught up. No notifications yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((n) => {
              const colorClass = TYPE_COLORS[n.type] || TYPE_COLORS.default;
              return (
                <div
                  key={n._id}
                  onClick={() => handleClick(n)}
                  className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition
                    ${n.read
                      ? 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 opacity-70 hover:opacity-100'
                      : 'bg-purple-50 dark:bg-purple-500/5 border-purple-200 dark:border-purple-500/30 hover:bg-purple-100 dark:hover:bg-purple-500/10'
                    }`}
                >
                  {/* Type dot */}
                  <span className={`mt-0.5 flex-shrink-0 w-2.5 h-2.5 rounded-full ${n.read ? 'bg-gray-300 dark:bg-slate-600' : 'bg-purple-500'}`} />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm font-semibold ${n.read ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white'}`}>
                        {n.title}
                      </p>
                      <span className="text-xs text-gray-400 flex-shrink-0">
                        {new Date(n.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {n.message && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{n.message}</p>
                    )}
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colorClass}`}>
                        {n.type.replace(/_/g, ' ')}
                      </span>
                      {n.link && (
                        <span className="inline-flex items-center gap-0.5 text-xs text-purple-600 dark:text-purple-400">
                          View <ArrowRight className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Mark read button (visible only if unread) */}
                  {!n.read && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleMark(n._id); }}
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
        )}
      </div>
    </div>
  );
}
