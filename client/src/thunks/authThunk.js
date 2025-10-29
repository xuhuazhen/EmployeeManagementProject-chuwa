import { createAsyncThunk } from '@reduxjs/toolkit'; 
import api from '../api/axiosConfig';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await api.post('user/login', credentials, { withCredentials: true });
      return res.data.data.user; // 只返回 user 基本信息
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);