// userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userRootReq } from '../API/User.api';

export const fetchUser = createAsyncThunk('user/fetchUser', async (_, { rejectWithValue }) => {
  try {
      const res = await userRootReq();
      return res.data;
    } catch (err) {
      // If 401 or refresh token failed, return rejectWithValue
      if (err.response?.status === 401) {
        return rejectWithValue('Unauthorized');
      }
      return rejectWithValue(err.message);
    }
});

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    isAuthenticated: false,
    isLoading: false,
  },
  reducers: {
    addUser: (state, action) => {
      state.user = action.payload,
        state.isAuthenticated = true
    },
    removeUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    updateUser: (state, action) => {      
      state.user = action.payload,
      state.isAuthenticated = true;
    },
    updateEmail: (state, action) => {
      state.user.email = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        if (action.payload === "Unauthorized") {
          state.user = null;
          state.isAuthenticated = false;
        }
        state.isLoading = false;
      })
  },
});

export const { addUser, removeUser, updateUser, updateEmail } = userSlice.actions;
export default userSlice.reducer;
