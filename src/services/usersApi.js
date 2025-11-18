import { api } from "./api";

export const usersApi = api.injectEndpoints({
  endpoints: (builder) => ({

    // GET all users
    getAllUsers: builder.query({
      query: () => "/users",
      providesTags: ["Users"],
    }),

    // GET a user by ID
    getUser: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: ["Users"],
    }),

    // GET logged-in user profile
    getProfile: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: ["Profile"],
    }),

    // UPDATE profile
    updateProfile: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/auth/profile/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Profile", "Users"],
    }),

    // GET user stats
    getStats: builder.query({
      query: () => "/users/stats",
      providesTags: ["Stats"],
    }),
    
    uploadAvatar: builder.mutation({
      query: ({ file, userId }) => {
        const formData = new FormData();
        formData.append("avatar", file);

        return {
          url: `/users/${userId}/avatar`,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: ["Profile"],
    }),

    uploadCover: builder.mutation({
      query: ({ file, userId }) => {
        const formData = new FormData();
        formData.append("cover", file);

        return {
          url: `/users/${userId}/cover`,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: ["Profile"],
    }),

  }),
});

export const {
  useGetAllUsersQuery,
  useGetUserQuery,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetStatsQuery,
  useUploadAvatarMutation,
  useUploadCoverMutation
} = usersApi;
