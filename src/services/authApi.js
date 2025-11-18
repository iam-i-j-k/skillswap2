import { api } from './api';

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({

    register: builder.mutation({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
    }),

    login: builder.mutation({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),

    updateProfile: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/auth/profile/${id}`,
        method: "PUT",
        body,
      }),
    }),

    verifyEmail: builder.mutation({
      query: (body) => ({
        url: "/auth/verify-email",
        method: "POST",
        body,
      }),
    }),

    forgotPassword: builder.mutation({
      query: (body) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body,
      }),
    }),

    resetPassword: builder.mutation({
      query: (body) => ({
        url: "/auth/reset-password",
        method: "POST",
        body,
      }),
    }),

  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useUpdateProfileMutation,
  useVerifyEmailMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
