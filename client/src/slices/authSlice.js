//authslice -- current user auth status and role
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userID: null, 
    role: null, // employee | hr
    isLoggedIn: false,
    loading: false,
    error: null,
  },
  reducers: {
    login: (state, action ) => { 
        state.userID = action.payload.userID;
        state.role = action.payload.role;
        state.isLoggedIn = true;
    },
    logout: (state) => {
      state.user = null; 
      state.role = null;
      state.isLoggedIn = false
    },
  },
    
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;