import { api } from './api';

export const platformApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getListings: builder.query({
      query: (params = {}) => ({ url: '/platform/listings', params }),
      providesTags: ['Listings'],
    }),
    createListing: builder.mutation({
      query: (body) => ({ url: '/platform/listings', method: 'POST', body }),
      invalidatesTags: ['Listings', 'Feed'],
    }),
    updateListing: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/platform/listings/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Listings'],
    }),
    deleteListing: builder.mutation({
      query: (id) => ({ url: `/platform/listings/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Listings', 'SavedListings', 'Feed'],
    }),
    saveListing: builder.mutation({
      query: (id) => ({ url: `/platform/listings/${id}/save`, method: 'POST' }),
      invalidatesTags: ['SavedListings'],
    }),
    unsaveListing: builder.mutation({
      query: (id) => ({ url: `/platform/listings/${id}/save`, method: 'DELETE' }),
      invalidatesTags: ['SavedListings'],
    }),
    getSavedListings: builder.query({
      query: () => '/platform/saved-listings',
      providesTags: ['SavedListings'],
    }),
    getSwaps: builder.query({
      query: () => '/platform/swaps',
      providesTags: ['Swaps'],
    }),
    createSwap: builder.mutation({
      query: (body) => ({ url: '/platform/swaps', method: 'POST', body }),
      invalidatesTags: ['Swaps', 'Notifications'],
    }),
    counterSwap: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/platform/swaps/${id}/counter`, method: 'PUT', body }),
      invalidatesTags: ['Swaps', 'Notifications'],
    }),
    confirmSwap: builder.mutation({
      query: (id) => ({ url: `/platform/swaps/${id}/confirm`, method: 'PUT' }),
      invalidatesTags: ['Swaps'],
    }),
    completeSwap: builder.mutation({
      query: (id) => ({ url: `/platform/swaps/${id}/complete`, method: 'PUT' }),
      invalidatesTags: ['Swaps', 'Feed'],
    }),
    declineSwap: builder.mutation({
      query: (id) => ({ url: `/platform/swaps/${id}/decline`, method: 'PUT' }),
      invalidatesTags: ['Swaps'],
    }),
    createReview: builder.mutation({
      query: (body) => ({ url: '/platform/reviews', method: 'POST', body }),
      invalidatesTags: ['Reputation'],
    }),
    getReputation: builder.query({
      query: (userId) => `/platform/reputation/${userId}`,
      providesTags: ['Reputation'],
    }),
    getNotifications: builder.query({
      query: () => '/platform/notifications',
      providesTags: ['Notifications'],
    }),
    markNotificationRead: builder.mutation({
      query: (id) => ({ url: `/platform/notifications/${id}/read`, method: 'PUT' }),
      invalidatesTags: ['Notifications'],
    }),
    getFeed: builder.query({
      query: () => '/platform/feed',
      providesTags: ['Feed'],
    }),
    createFeedPost: builder.mutation({
      query: (body) => ({ url: '/platform/feed', method: 'POST', body }),
      invalidatesTags: ['Feed'],
    }),
    getDisputes: builder.query({
      query: () => '/platform/disputes',
      providesTags: ['Disputes'],
    }),
    createDispute: builder.mutation({
      query: (body) => ({ url: '/platform/disputes', method: 'POST', body }),
      invalidatesTags: ['Disputes'],
    }),
    requestVerification: builder.mutation({
      query: (body) => ({ url: '/platform/verification/request', method: 'POST', body }),
      invalidatesTags: ['Profile'],
    }),
    getAdminOverview: builder.query({
      query: () => '/platform/admin/overview',
      providesTags: ['Admin'],
    }),
    moderateListing: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/platform/admin/listings/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Admin', 'Listings'],
    }),
    resolveDispute: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/platform/admin/disputes/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Admin', 'Disputes'],
    }),
    getPendingVerifications: builder.query({
      query: () => '/platform/admin/verifications',
      providesTags: ['Admin'],
    }),
    reviewVerification: builder.mutation({
      query: ({ userId, ...body }) => ({ url: `/platform/admin/verifications/${userId}`, method: 'PUT', body }),
      invalidatesTags: ['Admin'],
    }),
  }),
});

export const {
  useGetListingsQuery,
  useCreateListingMutation,
  useUpdateListingMutation,
  useDeleteListingMutation,
  useSaveListingMutation,
  useUnsaveListingMutation,
  useGetSavedListingsQuery,
  useGetSwapsQuery,
  useCreateSwapMutation,
  useCounterSwapMutation,
  useConfirmSwapMutation,
  useCompleteSwapMutation,
  useDeclineSwapMutation,
  useCreateReviewMutation,
  useGetReputationQuery,
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useGetFeedQuery,
  useCreateFeedPostMutation,
  useGetDisputesQuery,
  useCreateDisputeMutation,
  useRequestVerificationMutation,
  useGetAdminOverviewQuery,
  useModerateListingMutation,
  useResolveDisputeMutation,
  useGetPendingVerificationsQuery,
  useReviewVerificationMutation,
} = platformApi;
