import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import {
  AlertTriangle,
  BarChart3,
  BadgeCheck,
  CheckCircle2,
  Flag,
  ListFilter,
  Shield,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import {
  useGetAdminOverviewQuery,
  useGetPendingVerificationsQuery,
  useModerateListingMutation,
  useResolveDisputeMutation,
  useReviewVerificationMutation,
} from '../services/platformApi';

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ icon, label, value, color }) {
  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>{icon}</div>
      <div>
        <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{value ?? '—'}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      </div>
    </div>
  );
}

// ─── Verifications Tab ────────────────────────────────────────────────────────

function VerificationsTab() {
  const { data, isLoading, refetch } = useGetPendingVerificationsQuery();
  const [reviewVerification] = useReviewVerificationMutation();
  const [notes, setNotes] = useState({}); // { [userId]: string }

  const pending = data?.users || [];

  const handleReview = async (userId, status) => {
    try {
      await reviewVerification({ userId, status, adminNote: notes[userId] || '' }).unwrap();
      toast.success(status === 'verified' ? 'User verified ✅' : 'Request rejected');
      refetch();
    } catch (err) {
      toast.error(err?.data?.error || 'Action failed');
    }
  };

  if (isLoading) return <p className="text-sm text-gray-500 dark:text-gray-400">Loading requests...</p>;

  if (pending.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-10 text-center">
        <BadgeCheck className="w-12 h-12 text-green-400 mx-auto mb-3" />
        <p className="text-gray-500 dark:text-gray-400">No pending verification requests.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {pending.length} pending request{pending.length !== 1 ? 's' : ''} — oldest first
      </p>

      {pending.map((user) => (
        <div
          key={user._id}
          className="bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-500/30 rounded-xl p-5"
        >
          {/* User info row */}
          <div className="flex items-start gap-4 mb-4">
            {user.avatar ? (
              <img src={user.avatar} alt={user.username} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {user.username?.charAt(0)?.toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-gray-900 dark:text-white">{user.username}</p>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300">
                  Pending Verification
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
              {user.bio && (
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 line-clamp-2">{user.bio}</p>
              )}
              {/* Skills */}
              {user.skills?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {user.skills.slice(0, 6).map((s) => (
                    <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300">
                      {s}
                    </span>
                  ))}
                  {user.skills.length > 6 && (
                    <span className="text-xs text-gray-400">+{user.skills.length - 6} more</span>
                  )}
                </div>
              )}
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">
              Joined {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* User's verification note */}
          {user.verificationNote && (
            <div className="mb-4 px-4 py-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg border border-gray-200 dark:border-slate-600">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                User's note
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{user.verificationNote}</p>
            </div>
          )}

          {/* Admin note input */}
          <div className="mb-3">
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
              Admin note (optional — sent to user as notification)
            </label>
            <input
              value={notes[user._id] || ''}
              onChange={(e) => setNotes((prev) => ({ ...prev, [user._id]: e.target.value }))}
              placeholder="e.g. Verified via LinkedIn profile"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white text-sm"
            />
          </div>

          {/* Approve / Reject buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => handleReview(user._id, 'verified')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition"
            >
              <BadgeCheck className="w-4 h-4" /> Approve
            </button>
            <button
              onClick={() => handleReview(user._id, 'rejected')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-100 hover:bg-red-200 dark:bg-red-500/20 dark:hover:bg-red-500/30 text-red-700 dark:text-red-400 text-sm font-medium transition border border-red-200 dark:border-red-500/30"
            >
              <X className="w-4 h-4" /> Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Disputes Tab ─────────────────────────────────────────────────────────────

function AdminDisputes() {
  const { data } = useGetAdminOverviewQuery();
  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-orange-500" />
          <h3 className="font-bold text-gray-900 dark:text-white">
            Open Disputes: {data?.stats?.disputes ?? '—'}
          </h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Resolve disputes via{' '}
          <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-slate-700 text-xs font-mono">
            PUT /api/platform/admin/disputes/:id
          </code>{' '}
          with <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-slate-700 text-xs font-mono">status: "resolved"</code> or{' '}
          <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-slate-700 text-xs font-mono">"dismissed"</code>.
        </p>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const currentUser = useSelector((s) => s.auth.user);
  const { data, isLoading, refetch } = useGetAdminOverviewQuery();
  const { data: verifData } = useGetPendingVerificationsQuery();
  const [moderateListing] = useModerateListingMutation();
  const [activeTab, setActiveTab] = useState('overview');

  if (currentUser?.role !== 'admin') return <Navigate to="/dashboard" replace />;

  const stats = data?.stats || {};
  const flaggedListings = data?.flaggedListings || [];
  const popularCategories = data?.popularCategories || [];
  const pendingVerifCount = verifData?.users?.length ?? 0;

  const handleRemoveListing = async (id) => {
    try {
      await moderateListing({ id, status: 'removed', flagged: false }).unwrap();
      toast.success('Listing removed');
      refetch();
    } catch { toast.error('Failed to remove listing'); }
  };

  const handleUnflagListing = async (id) => {
    try {
      await moderateListing({ id, flagged: false }).unwrap();
      toast.success('Listing unflagged');
      refetch();
    } catch { toast.error('Failed to unflag'); }
  };

  const TABS = [
    { id: 'overview',      label: 'Overview',      icon: <BarChart3   className="w-4 h-4" /> },
    { id: 'moderation',    label: 'Moderation',     icon: <Flag        className="w-4 h-4" />, badge: flaggedListings.length },
    { id: 'verifications', label: 'Verifications',  icon: <BadgeCheck  className="w-4 h-4" />, badge: pendingVerifCount },
    { id: 'disputes',      label: 'Disputes',       icon: <AlertTriangle className="w-4 h-4" />, badge: stats.disputes },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-7 h-7 text-purple-500" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-700'
              }`}
            >
              {tab.icon} {tab.label}
              {tab.badge > 0 && (
                <span className={`ml-1 min-w-[18px] h-[18px] px-1 rounded-full text-xs font-bold flex items-center justify-center ${
                  activeTab === tab.id ? 'bg-white/30 text-white' : 'bg-red-500 text-white'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {isLoading ? (
          <p className="text-gray-500 dark:text-gray-400">Loading admin data...</p>
        ) : (
          <>
            {/* Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                  <StatCard icon={<Users         className="w-6 h-6 text-white" />} label="Total Users"    value={stats.users}          color="bg-blue-500"   />
                  <StatCard icon={<ListFilter    className="w-6 h-6 text-white" />} label="Listings"       value={stats.listings}        color="bg-purple-500" />
                  <StatCard icon={<BarChart3     className="w-6 h-6 text-white" />} label="Total Swaps"    value={stats.swaps}           color="bg-pink-500"   />
                  <StatCard icon={<CheckCircle2  className="w-6 h-6 text-white" />} label="Completed"      value={stats.completedSwaps}  color="bg-green-500"  />
                  <StatCard icon={<AlertTriangle className="w-6 h-6 text-white" />} label="Open Disputes"  value={stats.disputes}        color="bg-orange-500" />
                </div>

                {popularCategories.length > 0 && (
                  <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-5">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4">Top Skill Categories</h3>
                    <div className="space-y-3">
                      {popularCategories.map((cat) => {
                        const pct = Math.round((cat.count / (popularCategories[0]?.count || 1)) * 100);
                        return (
                          <div key={cat._id}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-700 dark:text-gray-300">{cat._id || 'Uncategorized'}</span>
                              <span className="text-gray-500 dark:text-gray-400">{cat.count}</span>
                            </div>
                            <div className="h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                              <div className="h-full bg-purple-500 rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Moderation */}
            {activeTab === 'moderation' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {flaggedListings.length} flagged listing{flaggedListings.length !== 1 ? 's' : ''}
                </p>
                {flaggedListings.length === 0 ? (
                  <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-10 text-center">
                    <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">No flagged listings. All clear.</p>
                  </div>
                ) : (
                  flaggedListings.map((listing) => (
                    <div key={listing._id} className="bg-white dark:bg-slate-800 border border-orange-200 dark:border-orange-500/30 rounded-xl p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Flag className="w-4 h-4 text-orange-500" />
                            <span className="font-semibold text-gray-900 dark:text-white">{listing.title}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300">Flagged</span>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                            Owner: {listing.owner?.username} · {listing.owner?.email}
                          </p>
                          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{listing.description}</p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <button onClick={() => handleUnflagListing(listing._id)} className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-green-100 hover:bg-green-200 dark:bg-green-500/20 dark:hover:bg-green-500/30 text-green-700 dark:text-green-300 text-sm">
                            <CheckCircle2 className="w-4 h-4" /> Unflag
                          </button>
                          <button onClick={() => handleRemoveListing(listing._id)} className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-red-100 hover:bg-red-200 dark:bg-red-500/20 dark:hover:bg-red-500/30 text-red-700 dark:text-red-300 text-sm">
                            <Trash2 className="w-4 h-4" /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Verifications */}
            {activeTab === 'verifications' && <VerificationsTab />}

            {/* Disputes */}
            {activeTab === 'disputes' && <AdminDisputes />}
          </>
        )}
      </div>
    </div>
  );
}
