// chatApi.js
import { api } from "./api";

export const chatApi = api.injectEndpoints({
  endpoints: (builder) => ({

    // GET CHAT HISTORY
    getChatHistory: builder.query({
      query: (chatUserId) => `/chat/history/${chatUserId}`,
      providesTags: (result, error, chatUserId) => [
        { type: "Chat", id: chatUserId }
      ],
    }),

    // CLEAR CHAT
    clearChat: builder.mutation({
      query: (chatUserId) => ({
        url: `/chat/clear/${chatUserId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, chatUserId) => [
        { type: "Chat", id: chatUserId }
      ],
    }),

    // FILE UPLOAD
    uploadResource: builder.mutation({
      query: (formData) => ({
        url: "/chat/upload",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const {
  useGetChatHistoryQuery,
  useClearChatMutation,
  useUploadResourceMutation,
} = chatApi;
