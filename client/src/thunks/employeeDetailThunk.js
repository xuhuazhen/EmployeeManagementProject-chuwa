import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchEmployeeById = createAsyncThunk(
  "employees/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/hr/profiles/${id}`
      );
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch employee"
      );
    }
  }
);
