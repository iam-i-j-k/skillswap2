import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import {
  Award,
  BadgeCheck,
  Flame,
  Newspaper,
  Plus,
  Send,
  Shield,
  Star,
  Trophy,
  User,
} from 'lucide-react';
import {
  useCreateFeedPostMutation,
  useGetFeedQuery,
  useGetReputationQuery,
  useRequestVerificationMutation,
} from '../services/platformApi';

// ─── Feed ────────────────────────────────────────────────────────────────────

const POST_TYPE_STYLES = {
  swap_completed: 'bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/30',
  new_member: 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30',
  skill_spotlight: 'bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/30',
  announcement: 'bg-yellow-50 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/30',
};
const POST_TYPE_ICONS = {
  swap_completed: <Flame className="w-4 h-4 text-green-600 dark:text-green-400" />,
  new_member: <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
  skill_spotlight: <Star className="w-4 h-4 text-purple-600 dark:text-purple-400" />,
  announcement: <Newspaper className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />,
};

function CommunityFeed() {
  const { data, isLoading } = useGetFeedQuery();
  const [createPost] = useCreateFeedPostMutation();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: 'skill_spotlight', title: '', body: '', skillCategory: '' });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await createPost(form).unwrap();
      toast.success('Post published');
      setForm({ type: 'skill_spotlight', title: '', body: '', skillCategory: '' });
      setShowForm(false);
    } catch (err) {
      toast.error(err?.data?.error || 'Could not publish post');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-purple-500" /> Community Feed
        </h2>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm"
        >
          <Plus className="w-4 h-4" /> New Post
        </button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4 space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="px-3 py-2 rounded-lg border dark:border-slate-700 dark:bg-slate-900 dark:text-white text-sm"
            >
              <option value="skill_spotlight">Skill Spotlight</option>
              <option value="swap_completed">Swap Completed</option>
              <option value="announcement">Announcement</option>
            </select>
            <input
              value={form.skillCategory}
              onChange={(e) => setForm({ ...form, skillCategory: e.target.value })}
              placeholder="Skill category (optional)"
              className="px-3 py-2 rounded-lg border dark:border-slate-700 dark:bg-slate-900 dark:text-white text-sm"
            />
          </div>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Post title"
            className="w-full px-3 py-2 rounded-lg border dark:border-slate-700 dark:bg-slate-900 dark:text-white text-sm"
          />
          <textarea
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            placeholder="What do you want to share?"
            rows={3}
            className="w-full px-3 py-2 rounded-lg border dark:border-slate-700 dark:bg-slate-900 dark:text-white text-sm"
          />
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border dark:border-slate-700 text-gray-700 dark:text-white text-sm">Cancel</button>
            <button className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-purple-600 text-white text-sm">
              <Send className="w-4 h-4" /> Publish
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm">Loading feed...</p>
      ) : (data?.posts || []).length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm">No posts yet. Be the first to share!</p>
      ) : (
        (data?.posts || []).map((post) => (
          <div
            key={post._id}
            className={`border rounded-xl p-4 ${POST_TYPE_STYLES[post.type] || 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700'}`}
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                {post.author?.username?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-gray-900 dark:text-white text-sm">{post.author?.username}</span>
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-white/60 dark:bg-black/20 text-gray-600 dark:text-gray-300">
                    {POST_TYPE_ICONS[post.type]} {post.type.replace('_', ' ')}
                  </span>
                  {post.skillCategory && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/60 dark:bg-black/20 text-gray-500 dark:text-gray-400">{post.skillCategory}</span>
                  )}
                  <span className="text-xs text-gray-400 ml-auto">{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="font-medium text-gray-900 dark:text-white mt-1">{post.title}</p>
                {post.body && <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{post.body}</p>}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ─── Reputation Panel ─────────────────────────────────────────────────────────

const BADGE_ICONS = {
  'Reviewed Member': <Award className="w-4 h-4" />,
  '10 Swaps Completed': <Trophy className="w-4 h-4" />,
  'Top Rated Teacher': <Star className="w-4 h-4" />,
};

function ReputationPanel({ userId }) {
  const { data, isLoading } = useGetReputationQuery(userId, { skip: !userId });
  const reputation = data?.reputation;
  const reviews = data?.reviews || [];

  if (isLoading) return <p className="text-sm text-gray-500 dark:text-gray-400">Loading reputation...</p>;
  if (!reputation) return null;

  const avg = reputation.reputationScore || 0;

  return (
    <div className="space-y-4">
      {/* Score card */}
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-5">
        <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-400" /> Your Reputation
        </h3>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl font-extrabold text-gray-900 dark:text-white">{avg.toFixed(1)}</span>
          <div>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star key={n} className={`w-5 h-5 ${n <= Math.round(avg) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-slate-600'}`} />
              ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        {/* Badges */}
        {(reputation.badges || []).length > 0 && (
          <div className="flex flex-wrap gap-2">
            {reputation.badges.map((badge) => (
              <span key={badge} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 text-xs font-medium">
                {BADGE_ICONS[badge] || <Award className="w-4 h-4" />} {badge}
              </span>
            ))}
          </div>
        )}
        {/* Verification status */}
        <div className="mt-3 flex items-center gap-2 text-sm">
          <BadgeCheck className={`w-4 h-4 ${reputation.verificationBadge === 'verified' ? 'text-blue-500' : 'text-gray-400'}`} />
          <span className="text-gray-600 dark:text-gray-400">
            Identity: <span className="font-medium text-gray-900 dark:text-white capitalize">{reputation.verificationBadge || 'none'}</span>
          </span>
        </div>
      </div>

      {/* Review list */}
      {reviews.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Reviews Received</h4>
          {reviews.map((review) => {
            const avg3 = ((review.skillQuality + review.punctuality + review.communication) / 3).toFixed(1);
            return (
              <div key={review._id} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                    {review.reviewer?.username?.charAt(0)?.toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{review.reviewer?.username}</span>
                  <div className="flex gap-0.5 ml-auto">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star key={n} className={`w-3.5 h-3.5 ${n <= Math.round(Number(avg3)) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-slate-600'}`} />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">{avg3}</span>
                </div>
                <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400 mb-2">
                  <span>Skill: {review.skillQuality}/5</span>
                  <span>Punctuality: {review.punctuality}/5</span>
                  <span>Comm: {review.communication}/5</span>
                </div>
                {review.comment && <p className="text-sm text-gray-700 dark:text-gray-300">{review.comment}</p>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Verification Request ─────────────────────────────────────────────────────

function VerificationRequest({ currentBadge }) {
  const [requestVerification] = useRequestVerificationMutation();
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await requestVerification({ note }).unwrap();
      toast.success('Verification request submitted');
      setSubmitted(true);
    } catch (err) {
      toast.error(err?.data?.error || 'Request failed');
    }
  };

  if (currentBadge === 'verified') {
    return (
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-5">
        <div className="flex items-center gap-3">
          <BadgeCheck className="w-8 h-8 text-blue-500" />
          <div>
            <p className="font-bold text-gray-900 dark:text-white">Identity Verified</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Your account carries a verified badge.</p>
          </div>
        </div>
      </div>
    );
  }

  if (currentBadge === 'pending' || submitted) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-yellow-300 dark:border-yellow-500/40 rounded-xl p-5">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-yellow-500" />
          <div>
            <p className="font-bold text-gray-900 dark:text-white">Verification Pending</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Our team will review your request.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-5">
      <h3 className="font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
        <Shield className="w-5 h-5 text-blue-500" /> Request Identity Verification
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">A verified badge builds trust with potential swap partners.</p>
      <form onSubmit={submit} className="space-y-3">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Optionally describe how you'd like to verify (e.g. LinkedIn URL, GitHub, portfolio)"
          rows={3}
          className="w-full px-3 py-2 rounded-lg border dark:border-slate-700 dark:bg-slate-900 dark:text-white text-sm"
        />
        <button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm">Submit Request</button>
      </form>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Community() {
  const currentUser = useSelector((s) => s.auth.user);
  const [activeTab, setActiveTab] = useState('feed');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-3 mb-6">
          <Trophy className="w-7 h-7 text-purple-500" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Community</h1>
        </div>

        {/* Tab bar */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { id: 'feed', label: 'Feed', icon: <Newspaper className="w-4 h-4" /> },
            { id: 'reputation', label: 'My Reputation', icon: <Star className="w-4 h-4" /> },
            { id: 'verification', label: 'Verification', icon: <Shield className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-700'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'feed' && <CommunityFeed />}
        {activeTab === 'reputation' && <ReputationPanel userId={currentUser?._id} />}
        {activeTab === 'verification' && (
          <VerificationRequest currentBadge={currentUser?.verificationBadge} />
        )}
      </div>
    </div>
  );
}
