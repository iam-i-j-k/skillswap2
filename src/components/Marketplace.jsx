import React, { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { Bookmark, CalendarDays, Filter, MapPin, Plus, Search, Send, Tags, Trash2 } from 'lucide-react';
import {
  useCreateListingMutation,
  useCreateSwapMutation,
  useDeleteListingMutation,
  useGetListingsQuery,
  useGetSavedListingsQuery,
  useSaveListingMutation,
  useUnsaveListingMutation,
} from '../services/platformApi';

const emptyListing = {
  type: 'offering',
  title: '',
  description: '',
  category: 'Technology',
  tags: '',
  proficiencyLevel: 'Intermediate',
  sessionFormat: 'Online',
  estimatedMinutes: 60,
  city: '',
  portfolioLinks: '',
};

const Marketplace = () => {
  const currentUser = useSelector((s) => s.auth.user);
  const [filters, setFilters] = useState({ q: '', category: '', city: '', format: '', level: '', type: '' });
  const [form, setForm] = useState(emptyListing);
  const [swapDraft, setSwapDraft] = useState(null);
  const { data, isLoading } = useGetListingsQuery(filters);
  const { data: savedData } = useGetSavedListingsQuery();
  const [createListing, { isLoading: creating }] = useCreateListingMutation();
  const [deleteListing] = useDeleteListingMutation();
  const [saveListing] = useSaveListingMutation();
  const [unsaveListing] = useUnsaveListingMutation();
  const [createSwap] = useCreateSwapMutation();

  const savedIds = useMemo(() => new Set((savedData?.saved || []).map((item) => item.listing?._id)), [savedData]);

  const isOwnListing = (listing) => String(listing.owner?._id) === String(currentUser?._id);

  const submitListing = async (event) => {
    event.preventDefault();
    try {
      await createListing({
        ...form,
        tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
        portfolioLinks: form.portfolioLinks.split(',').map((link) => link.trim()).filter(Boolean),
        estimatedMinutes: Number(form.estimatedMinutes) || 60,
      }).unwrap();
      setForm(emptyListing);
      toast.success('Listing published');
    } catch (error) {
      toast.error(error?.data?.error || 'Could not publish listing');
    }
  };

  const submitSwap = async (event) => {
    event.preventDefault();
    try {
      await createSwap({
        recipient: swapDraft.owner._id,
        offeredSkill: swapDraft.offeredSkill,
        requestedSkill: swapDraft.requestedSkill,
        sessionFormat: swapDraft.sessionFormat,
        durationMinutes: Number(swapDraft.durationMinutes) || 60,
        location: swapDraft.location,
        videoLink: swapDraft.videoLink,
        notes: swapDraft.notes,
      }).unwrap();
      setSwapDraft(null);
      toast.success('Swap proposal sent');
    } catch (error) {
      toast.error(error?.data?.error || 'Could not send swap proposal');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Skill Marketplace</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Create listings, browse skills, save opportunities, and propose swaps.</p>
          </div>
          <div className="grid sm:grid-cols-3 lg:grid-cols-6 gap-2">
            <div className="relative sm:col-span-2">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input value={filters.q} onChange={(e) => setFilters({ ...filters, q: e.target.value })} placeholder="Search skills" className="w-full pl-9 pr-3 py-2 rounded-lg border dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
            </div>
            {['category', 'city'].map((field) => (
              <input key={field} value={filters[field]} onChange={(e) => setFilters({ ...filters, [field]: e.target.value })} placeholder={field} className="px-3 py-2 rounded-lg border dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
            ))}
            <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })} className="px-3 py-2 rounded-lg border dark:border-slate-700 dark:bg-slate-800 dark:text-white">
              <option value="">Any type</option>
              <option value="offering">Offering</option>
              <option value="seeking">Seeking</option>
            </select>
            <select value={filters.format} onChange={(e) => setFilters({ ...filters, format: e.target.value })} className="px-3 py-2 rounded-lg border dark:border-slate-700 dark:bg-slate-800 dark:text-white">
              <option value="">Any format</option>
              <option>Online</option>
              <option>In-Person</option>
              <option>Hybrid</option>
            </select>
          </div>
        </div>

        <div className="grid lg:grid-cols-[360px_1fr] gap-6">
          <form onSubmit={submitListing} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-5 h-fit">
            <div className="flex items-center gap-2 mb-4">
              <Plus className="w-5 h-5 text-purple-500" />
              <h2 className="font-bold text-gray-900 dark:text-white">New Listing</h2>
            </div>
            <div className="grid gap-3">
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="px-3 py-2 rounded-lg border dark:border-slate-700 dark:bg-slate-900 dark:text-white">
                <option value="offering">I can offer</option>
                <option value="seeking">I am seeking</option>
              </select>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Skill title" className="px-3 py-2 rounded-lg border dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={3} className="px-3 py-2 rounded-lg border dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
              <div className="grid grid-cols-2 gap-2">
                <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Category" className="px-3 py-2 rounded-lg border dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
                <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="City" className="px-3 py-2 rounded-lg border dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
                <select value={form.proficiencyLevel} onChange={(e) => setForm({ ...form, proficiencyLevel: e.target.value })} className="px-3 py-2 rounded-lg border dark:border-slate-700 dark:bg-slate-900 dark:text-white">
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Expert</option>
                </select>
                <select value={form.sessionFormat} onChange={(e) => setForm({ ...form, sessionFormat: e.target.value })} className="px-3 py-2 rounded-lg border dark:border-slate-700 dark:bg-slate-900 dark:text-white">
                  <option>Online</option>
                  <option>In-Person</option>
                  <option>Hybrid</option>
                </select>
              </div>
              <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="Tags, comma separated" className="px-3 py-2 rounded-lg border dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
              <input value={form.portfolioLinks} onChange={(e) => setForm({ ...form, portfolioLinks: e.target.value })} placeholder="Portfolio URLs, comma separated" className="px-3 py-2 rounded-lg border dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
              <button disabled={creating} className="py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium">Publish Listing</button>
            </div>
          </form>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {isLoading ? <p className="text-gray-500 dark:text-gray-400">Loading listings...</p> : data?.listings?.map((listing) => (
              <div key={listing._id} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-5 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase">{listing.type}</span>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{listing.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {listing.owner?.username}
                      {isOwnListing(listing) && (
                        <span className="ml-2 text-xs px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300">Your listing</span>
                      )}
                    </p>
                  </div>
                  {!isOwnListing(listing) && (
                    <button onClick={() => savedIds.has(listing._id) ? unsaveListing(listing._id) : saveListing(listing._id)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700">
                      <Bookmark className={`w-5 h-5 ${savedIds.has(listing._id) ? 'fill-purple-500 text-purple-500' : 'text-gray-500'}`} />
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">{listing.description || 'No description provided.'}</p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300"><Filter className="w-3 h-3" />{listing.category}</span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300"><CalendarDays className="w-3 h-3" />{listing.sessionFormat}</span>
                  {listing.city && <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300"><MapPin className="w-3 h-3" />{listing.city}</span>}
                </div>
                <div className="flex flex-wrap gap-1">
                  {(listing.tags || []).slice(0, 4).map((tag) => <span key={tag} className="text-xs px-2 py-1 rounded bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300"><Tags className="inline w-3 h-3 mr-1" />{tag}</span>)}
                </div>
                {!isOwnListing(listing) ? (
                  <button
                    onClick={() => setSwapDraft({ owner: listing.owner, requestedSkill: listing.title, offeredSkill: '', sessionFormat: listing.sessionFormat, durationMinutes: listing.estimatedMinutes, location: listing.city, videoLink: '', notes: '' })}
                    className="mt-auto inline-flex items-center justify-center gap-2 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 text-white font-medium"
                  >
                    <Send className="w-4 h-4" /> Propose Swap
                  </button>
                ) : (
                  <button
                    onClick={async () => {
                      if (!window.confirm('Delete this listing?')) return;
                      try {
                        await deleteListing(listing._id).unwrap();
                        toast.success('Listing deleted');
                      } catch (err) {
                        toast.error(err?.data?.error || 'Could not delete listing');
                      }
                    }}
                    className="mt-auto inline-flex items-center justify-center gap-2 py-2 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30 font-medium transition"
                  >
                    <Trash2 className="w-4 h-4" /> Delete Listing
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {swapDraft && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <form onSubmit={submitSwap} className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-xl p-5 border dark:border-slate-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Swap Proposal for {swapDraft.owner?.username}</h2>
            <div className="grid gap-3">
              <input required value={swapDraft.offeredSkill} onChange={(e) => setSwapDraft({ ...swapDraft, offeredSkill: e.target.value })} placeholder="Skill you will offer" className="px-3 py-2 rounded-lg border dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
              <input required value={swapDraft.requestedSkill} onChange={(e) => setSwapDraft({ ...swapDraft, requestedSkill: e.target.value })} placeholder="Skill requested" className="px-3 py-2 rounded-lg border dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
              <input value={swapDraft.videoLink} onChange={(e) => setSwapDraft({ ...swapDraft, videoLink: e.target.value })} placeholder="Video link or meeting URL" className="px-3 py-2 rounded-lg border dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
              <textarea value={swapDraft.notes} onChange={(e) => setSwapDraft({ ...swapDraft, notes: e.target.value })} placeholder="Session structure, schedule, or terms" rows={3} className="px-3 py-2 rounded-lg border dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setSwapDraft(null)} className="px-4 py-2 rounded-lg border dark:border-slate-700 dark:text-white">Cancel</button>
                <button className="px-4 py-2 rounded-lg bg-purple-600 text-white">Send Proposal</button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
