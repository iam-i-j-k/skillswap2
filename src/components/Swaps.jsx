import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import {
  ArrowLeftRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Flag,
  RefreshCw,
  Star,
  Video,
  XCircle,
} from 'lucide-react';
import {
  useCompleteSwapMutation,
  useConfirmSwapMutation,
  useCounterSwapMutation,
  useCreateDisputeMutation,
  useCreateReviewMutation,
  useDeclineSwapMutation,
  useGetSwapsQuery,
} from '../services/platformApi';

const STATUS_COLORS = {
  proposed: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300',
  countered: 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300',
  confirmed: 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300',
  scheduled: 'bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300',
  completed: 'bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-300',
  declined: 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300',
  disputed: 'bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-300',
};

const StarRating = ({ value, onChange }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((n) => (
      <button key={n} type="button" onClick={() => onChange(n)}>
        <Star className={`w-5 h-5 ${n <= value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-slate-600'}`} />
      </button>
    ))}
  </div>
);

const emptyReview = { skillQuality: 5, punctuality: 5, communication: 5, comment: '' };
const emptyCounter = { offeredSkill: '', requestedSkill: '', sessionFormat: 'Online', durationMinutes: 60, videoLink: '', notes: '' };
const emptyDispute = { reason: '', details: '' };

export default function Swaps() {
  const { data, isLoading, refetch } = useGetSwapsQuery();
  const currentUser = useSelector((s) => s.auth.user);
  const [confirmSwap] = useConfirmSwapMutation();
  const [declineSwap] = useDeclineSwapMutation();
  const [completeSwap] = useCompleteSwapMutation();
  const [counterSwap] = useCounterSwapMutation();
  const [createReview] = useCreateReviewMutation();
  const [createDispute] = useCreateDisputeMutation();

  const [activeTab, setActiveTab] = useState('active');
  const [expandedId, setExpandedId] = useState(null);
  const [reviewModal, setReviewModal] = useState(null); // swap object
  const [reviewForm, setReviewForm] = useState(emptyReview);
  const [counterModal, setCounterModal] = useState(null); // swap object
  const [counterForm, setCounterForm] = useState(emptyCounter);
  const [disputeModal, setDisputeModal] = useState(null); // swap object
  const [disputeForm, setDisputeForm] = useState(emptyDispute);

  const swaps = data?.swaps || [];
  const active = swaps.filter((s) => !['completed', 'declined', 'cancelled', 'disputed'].includes(s.status));
  const history = swaps.filter((s) => ['completed', 'declined', 'cancelled', 'disputed'].includes(s.status));
  const shown = activeTab === 'active' ? active : history;

  const isRequester = (swap) => String(swap.requester?._id) === String(currentUser?._id);
  const other = (swap) => isRequester(swap) ? swap.recipient : swap.requester;

  const action = async (fn, successMsg) => {
    try { await fn(); toast.success(successMsg); refetch(); }
    catch (err) { toast.error(err?.data?.error || 'Action failed'); }
  };

  const submitCounter = async (e) => {
    e.preventDefault();
    await action(() => counterSwap({ id: counterModal._id, ...counterForm }).unwrap(), 'Counter-offer sent');
    setCounterModal(null);
    setCounterForm(emptyCounter);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    await action(() => createReview({ swap: reviewModal._id, ...reviewForm }).unwrap(), 'Review submitted');
    setReviewModal(null);
    setReviewForm(emptyReview);
  };

  const submitDispute = async (e) => {
    e.preventDefault();
    const against = other(disputeModal)?._id;
    await action(() => createDispute({ swap: disputeModal._id, against, ...disputeForm }).unwrap(), 'Dispute filed');
    setDisputeModal(null);
    setDisputeForm(emptyDispute);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-3 mb-6">
          <ArrowLeftRight className="w-7 h-7 text-purple-500" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Swaps</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {['active', 'history'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium capitalize transition ${activeTab === tab ? 'bg-purple-600 text-white' : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-700'}`}
            >
              {tab} ({tab === 'active' ? active.length : history.length})
            </button>
          ))}
        </div>

        {isLoading ? (
          <p className="text-gray-500 dark:text-gray-400">Loading swaps...</p>
        ) : shown.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-10 text-center">
            <ArrowLeftRight className="w-12 h-12 text-gray-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No {activeTab} swaps yet. Propose one from the Marketplace.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {shown.map((swap) => {
              const partner = other(swap);
              const iAmRequester = isRequester(swap);
              const myConfirmed = iAmRequester ? swap.requesterConfirmed : swap.recipientConfirmed;
              const expanded = expandedId === swap._id;

              return (
                <div key={swap._id} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden">
                  {/* Header row */}
                  <div
                    className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700/50"
                    onClick={() => setExpandedId(expanded ? null : swap._id)}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                      {partner?.username?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {swap.offeredSkill} <span className="text-gray-400">↔</span> {swap.requestedSkill}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">with {partner?.username}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_COLORS[swap.status]}`}>{swap.status}</span>
                    {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </div>

                  {/* Expanded detail */}
                  {expanded && (
                    <div className="border-t border-gray-100 dark:border-slate-700 p-4 space-y-4">
                      {/* Details grid */}
                      <div className="grid sm:grid-cols-2 gap-3 text-sm">
                        <div><span className="text-gray-500 dark:text-gray-400">Format:</span> <span className="text-gray-900 dark:text-white ml-1">{swap.sessionFormat}</span></div>
                        <div><span className="text-gray-500 dark:text-gray-400">Duration:</span> <span className="text-gray-900 dark:text-white ml-1">{swap.durationMinutes} min</span></div>
                        {swap.location && <div><span className="text-gray-500 dark:text-gray-400">Location:</span> <span className="text-gray-900 dark:text-white ml-1">{swap.location}</span></div>}
                        {swap.videoLink && (
                          <div>
                            <a href={swap.videoLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-purple-600 dark:text-purple-400 hover:underline">
                              <Video className="w-4 h-4" /> Join Session
                            </a>
                          </div>
                        )}
                        {swap.notes && <div className="sm:col-span-2"><span className="text-gray-500 dark:text-gray-400">Notes:</span> <span className="text-gray-900 dark:text-white ml-1">{swap.notes}</span></div>}
                      </div>

                      {/* Confirmation status */}
                      {['proposed', 'countered', 'confirmed'].includes(swap.status) && (
                        <div className="flex gap-4 text-sm">
                          <span className={`flex items-center gap-1 ${swap.requesterConfirmed ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
                            <CheckCircle2 className="w-4 h-4" /> Requester {swap.requesterConfirmed ? 'confirmed' : 'pending'}
                          </span>
                          <span className={`flex items-center gap-1 ${swap.recipientConfirmed ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
                            <CheckCircle2 className="w-4 h-4" /> Recipient {swap.recipientConfirmed ? 'confirmed' : 'pending'}
                          </span>
                        </div>
                      )}

                      {/* Counter history */}
                      {swap.counterHistory?.length > 0 && (
                        <details className="text-sm">
                          <summary className="cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                            Counter history ({swap.counterHistory.length})
                          </summary>
                          <div className="mt-2 space-y-2 pl-3 border-l-2 border-gray-200 dark:border-slate-600">
                            {swap.counterHistory.map((h, i) => (
                              <div key={i} className="text-gray-700 dark:text-gray-300">
                                <span className="font-medium">{h.offeredSkill} ↔ {h.requestedSkill}</span>
                                {h.notes && <span className="text-gray-500 dark:text-gray-400"> — {h.notes}</span>}
                              </div>
                            ))}
                          </div>
                        </details>
                      )}

                      {/* Action buttons */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {/* Confirm */}
                        {['proposed', 'countered'].includes(swap.status) && !myConfirmed && (
                          <button onClick={() => action(() => confirmSwap(swap._id).unwrap(), 'Confirmed')} className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm">
                            <CheckCircle2 className="w-4 h-4" /> Confirm
                          </button>
                        )}
                        {/* Counter */}
                        {['proposed', 'countered'].includes(swap.status) && (
                          <button onClick={() => { setCounterModal(swap); setCounterForm({ offeredSkill: swap.offeredSkill, requestedSkill: swap.requestedSkill, sessionFormat: swap.sessionFormat, durationMinutes: swap.durationMinutes, videoLink: swap.videoLink, notes: swap.notes }); }} className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm">
                            <RefreshCw className="w-4 h-4" /> Counter
                          </button>
                        )}
                        {/* Decline */}
                        {['proposed', 'countered'].includes(swap.status) && (
                          <button onClick={() => action(() => declineSwap(swap._id).unwrap(), 'Declined')} className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-red-100 hover:bg-red-200 dark:bg-red-500/20 dark:hover:bg-red-500/30 text-red-700 dark:text-red-300 text-sm">
                            <XCircle className="w-4 h-4" /> Decline
                          </button>
                        )}
                        {/* Complete */}
                        {swap.status === 'confirmed' && (
                          <button onClick={() => action(() => completeSwap(swap._id).unwrap(), 'Marked complete')} className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm">
                            <Clock className="w-4 h-4" /> Mark Complete
                          </button>
                        )}
                        {/* Review */}
                        {swap.status === 'completed' && (
                          <button onClick={() => { setReviewModal(swap); setReviewForm(emptyReview); }} className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white text-sm">
                            <Star className="w-4 h-4" /> Leave Review
                          </button>
                        )}
                        {/* Dispute */}
                        {['confirmed', 'completed'].includes(swap.status) && (
                          <button onClick={() => { setDisputeModal(swap); setDisputeForm(emptyDispute); }} className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-orange-100 hover:bg-orange-200 dark:bg-orange-500/20 dark:hover:bg-orange-500/30 text-orange-700 dark:text-orange-300 text-sm">
                            <Flag className="w-4 h-4" /> File Dispute
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Counter Modal */}
      {counterModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <form onSubmit={submitCounter} className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Counter Offer</h2>
            <div className="grid gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Your Offered Skill</label>
                  <input required value={counterForm.offeredSkill} onChange={(e) => setCounterForm({ ...counterForm, offeredSkill: e.target.value })} className="w-full px-3 py-2 rounded-lg border dark:border-slate-700 dark:bg-slate-900 dark:text-white text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Requested Skill</label>
                  <input required value={counterForm.requestedSkill} onChange={(e) => setCounterForm({ ...counterForm, requestedSkill: e.target.value })} className="w-full px-3 py-2 rounded-lg border dark:border-slate-700 dark:bg-slate-900 dark:text-white text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Format</label>
                  <select value={counterForm.sessionFormat} onChange={(e) => setCounterForm({ ...counterForm, sessionFormat: e.target.value })} className="w-full px-3 py-2 rounded-lg border dark:border-slate-700 dark:bg-slate-900 dark:text-white text-sm">
                    <option>Online</option><option>In-Person</option><option>Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Duration (min)</label>
                  <input type="number" value={counterForm.durationMinutes} onChange={(e) => setCounterForm({ ...counterForm, durationMinutes: Number(e.target.value) })} className="w-full px-3 py-2 rounded-lg border dark:border-slate-700 dark:bg-slate-900 dark:text-white text-sm" />
                </div>
              </div>
              <input value={counterForm.videoLink} onChange={(e) => setCounterForm({ ...counterForm, videoLink: e.target.value })} placeholder="Video / meeting URL (optional)" className="px-3 py-2 rounded-lg border dark:border-slate-700 dark:bg-slate-900 dark:text-white text-sm" />
              <textarea value={counterForm.notes} onChange={(e) => setCounterForm({ ...counterForm, notes: e.target.value })} placeholder="Notes or terms" rows={3} className="px-3 py-2 rounded-lg border dark:border-slate-700 dark:bg-slate-900 dark:text-white text-sm" />
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setCounterModal(null)} className="px-4 py-2 rounded-lg border dark:border-slate-700 text-gray-700 dark:text-white text-sm">Cancel</button>
                <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm">Send Counter</button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Review Modal */}
      {reviewModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <form onSubmit={submitReview} className="w-full max-w-md bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Review {other(reviewModal)?.username}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Swap: {reviewModal.offeredSkill} ↔ {reviewModal.requestedSkill}</p>
            <div className="grid gap-4">
              {[['skillQuality', 'Skill Quality'], ['punctuality', 'Punctuality'], ['communication', 'Communication']].map(([field, label]) => (
                <div key={field}>
                  <label className="text-sm text-gray-700 dark:text-gray-300 block mb-1">{label}</label>
                  <StarRating value={reviewForm[field]} onChange={(v) => setReviewForm({ ...reviewForm, [field]: v })} />
                </div>
              ))}
              <textarea value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} placeholder="Share your experience (optional)" rows={3} className="px-3 py-2 rounded-lg border dark:border-slate-700 dark:bg-slate-900 dark:text-white text-sm" />
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setReviewModal(null)} className="px-4 py-2 rounded-lg border dark:border-slate-700 text-gray-700 dark:text-white text-sm">Cancel</button>
                <button className="px-4 py-2 rounded-lg bg-yellow-500 text-white text-sm">Submit Review</button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Dispute Modal */}
      {disputeModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <form onSubmit={submitDispute} className="w-full max-w-md bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">File a Dispute</h2>
            <div className="grid gap-3">
              <input required value={disputeForm.reason} onChange={(e) => setDisputeForm({ ...disputeForm, reason: e.target.value })} placeholder="Short reason (e.g. No-show, Misrepresentation)" className="px-3 py-2 rounded-lg border dark:border-slate-700 dark:bg-slate-900 dark:text-white text-sm" />
              <textarea required value={disputeForm.details} onChange={(e) => setDisputeForm({ ...disputeForm, details: e.target.value })} placeholder="Describe what happened in detail" rows={4} className="px-3 py-2 rounded-lg border dark:border-slate-700 dark:bg-slate-900 dark:text-white text-sm" />
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setDisputeModal(null)} className="px-4 py-2 rounded-lg border dark:border-slate-700 text-gray-700 dark:text-white text-sm">Cancel</button>
                <button className="px-4 py-2 rounded-lg bg-orange-600 text-white text-sm">File Dispute</button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
