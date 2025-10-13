import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch connection requests
export const fetchRequests = createAsyncThunk(
  'connections/fetchRequests',
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth?.user?.token || localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/connections`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk to accept a connection request
export const acceptConnectionRequest = createAsyncThunk(
  'connections/acceptConnectionRequest',
  async (requestId, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth?.user?.token || localStorage.getItem('token');
      await axios.put(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/connections/${requestId}/accept`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return requestId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk to reject a connection request
export const rejectConnectionRequest = createAsyncThunk(
  'connections/rejectConnectionRequest',
  async (requestId, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth?.user?.token || localStorage.getItem('token');
      await axios.put(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/connections/${requestId}/decline`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return requestId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const connectionSlice = createSlice({
  name: 'connections',
  initialState: {
    connectedUsers: [],
    requests: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    addRequest: (state, action) => {
      if (!state.requests.some(req => req._id === action.payload._id)) {
        state.requests = [action.payload, ...state.requests];
      }
    },
    setConnectedUsers: (state, action) => {
      state.connectedUsers = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequests.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchRequests.fulfilled, (state, action) => {
           state.status = 'succeeded';
           const connections = Array.isArray(action.payload?.connections)
             ? action.payload.connections
             : Array.isArray(action.payload)
               ? action.payload
               : [];
           state.requests = [...connections];
      })
      .addCase(fetchRequests.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(acceptConnectionRequest.fulfilled, (state, action) => {
        state.requests = state.requests.filter(req => req._id !== action.payload);
      })
      .addCase(rejectConnectionRequest.fulfilled, (state, action) => {
        state.requests = state.requests.filter(req => req._id !== action.payload);
      });
  },
});

export const { addRequest, setConnectedUsers, ConnectedUsers } = connectionSlice.actions;
export default connectionSlice.reducer;
