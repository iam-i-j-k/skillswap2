import { createSlice } from '@reduxjs/toolkit';

const saved = JSON.parse(localStorage.getItem('auth')) || null;

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: saved?.user || null,
    token: saved?.token || null,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('auth', JSON.stringify(action.payload));
    },
    updateAvatar: (state, action) => {
      state.user.avatar = action.payload;
    },
    updateCover: (state, action) => {
      state.user.coverPhoto = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('auth');
    }
  }
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
