import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Thunk to fetch all users (excluding current user)
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { getState, rejectWithValue }) => {
    try {      
      const token = getState().auth.token;

      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.users;
    } catch (error) {
      const message =
        error.response?.data?.error || error.message || 'Something went wrong';
      return rejectWithValue(message);
    }
  }
);

export const fetchProfile = createAsyncThunk(
  "users/fetchProfile",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      console.log("Fetching profile with token:", token);
      const userId = getState().auth.user?._id;
      console.log("Current userId:", userId);
      
      if (!userId) throw new Error("User ID not found");

      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Fetched profile:", response.data.user);
      
      return response.data.user;
    } catch (error) {
      const message =
        error.response?.data?.error || error.message || "Something went wrong";
      return rejectWithValue(message);
    }
  }
);


// Async Thunk to update user profile
export const updateProfile = createAsyncThunk(
  'users/updateProfile',
  async (updatedProfile, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const userId = getState().auth.user?._id;
      if (!userId) throw new Error("User ID not found");
      const response = await axios.put(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/auth/profile/${userId}`,
        updatedProfile,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.user;
    } catch (error) {
      const message = error.response?.data?.error || error.message || 'Something went wrong';
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  users: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  profile: null, // Add profile to state
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearUsers: (state) => {
      state.users = [];
      state.status = 'idle';
      state.error = null;
    },
    addUser: (state, action) => {
      state.users.push(action.payload);
    },
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
      state.profile = action.payload;
      })
  },
});

export const { clearUsers, addUser, setProfile } = userSlice.actions;

export const selectAllUsers = (state) => state.users.users;
export const selectUsersStatus = (state) => state.users.status;
export const selectUsersError = (state) => state.users.error;
export const selectProfile = (state) => state.users.profile;

export default userSlice.reducer;
