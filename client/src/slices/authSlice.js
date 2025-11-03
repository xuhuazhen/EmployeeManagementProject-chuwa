//authslice -- current user auth status and role
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userID: null, 
    username: null,
    role: null, // employee | hr
    nextStep: null,
    isLoggedIn: false,
    loading: false,
    error: null,
  },
  reducers: {
    login: (state, action ) => { 
      console.log(action.payload);
        state.userID = action.payload.userID;
        state.username = action.payload.username;
        state.role = action.payload.role;
        state.nextStep = action.payload.nextStep;
        state.isLoggedIn = true;
    },
    logout: (state) => {
      state.user = null; 
      state.role = null;
      state.nextStep = null;
      state.isLoggedIn = false
    },
    updateStep: (state, action ) => { 
      state.nextStep = action.payload;
    }
  },
    
});

export const { login, logout, updateStep } = authSlice.actions;
export default authSlice.reducer;