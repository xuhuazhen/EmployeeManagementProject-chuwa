import { createSlice } from "@reduxjs/toolkit";
import { fetchEmailHistory } from "../thunks/notificationsThunk";

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: {
    emailHistory: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmailHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEmailHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.emailHistory = action.payload;
      })
      .addCase(fetchEmailHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default notificationsSlice.reducer;
