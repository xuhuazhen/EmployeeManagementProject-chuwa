import { createSlice } from '@reduxjs/toolkit';

const hrHistorySlice = createSlice({
  name: 'hrHistory',
  initialState: {
    history: [],
    loading: false,
    error: null,
  },
  reducers: {},
});

export default hrHistorySlice.reducer;