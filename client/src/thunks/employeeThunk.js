import { createAsyncThunk } from '@reduxjs/toolkit'; 
import api from '../api/axiosConfig';

export const initUserThunk = createAsyncThunk (
  'employee/initialProfile',
  async (userId, { rejectWithValue }) => {
    try {
      const res = await api.get(`user/profile/${userId}`, { withCredentials: true });
    //   console.log(res.data.data)
      return res.data.data; // 只返回 user 基本信息
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

 
