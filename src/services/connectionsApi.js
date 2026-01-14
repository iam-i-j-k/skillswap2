import { api } from "./api";

export const connectionsApi = api.injectEndpoints({
  endpoints: (builder) => ({

    // GET all pending + outgoing connection requests
    listConnections: builder.query({
      query: () => "/connections",
      providesTags: ["Connections"],
    }),

    // SEND a connection request
    sendConnectionRequest: builder.mutation({
      query: (userId) => ({
        url: "/connections",
        method: "POST",
        body: { userId },
      }),
      invalidatesTags: ["Connections", "Users"],
    }),

    // ACCEPT connection request
    acceptConnection: builder.mutation({
      query: (id) => ({
        url: `/connections/${id}/accept`,
        method: "PUT",
      }),
      invalidatesTags: ["Connections"],
    }),

    // DECLINE connection request
    rejectConnection: builder.mutation({
      query: (id) => ({
        url: `/connections/${id}/decline`,
        method: "PUT",
      }),
      invalidatesTags: ["Connections"],
    }),

    // REMOVE an accepted connection
    removeConnection: builder.mutation({
      query: (id) => ({
        url: `/connections/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Connections", "Users"],
    }),

    // GET matched accepted connections
    getMatches: builder.query({
      query: () => "/connections/matches",
      providesTags: ["Connections"],
    }),

    // GET connection status with a user
    getConnectionStatus: builder.query({
      query: (userId) => `/connections/status/${userId}`,
      providesTags: ["Connections"],
    }),

  }),
});

export const {
  useListConnectionsQuery,
  useSendConnectionRequestMutation,
  useAcceptConnectionMutation,
  useRejectConnectionMutation,
  useRemoveConnectionMutation,
  useGetMatchesQuery,
  useGetConnectionStatusQuery,
} = connectionsApi;
