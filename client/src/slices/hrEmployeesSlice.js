//store all emploee info -- hr
import { createSlice } from '@reduxjs/toolkit';

const hrEmployeesSlice = createSlice({
  name: 'hrEmployees',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
});

export default hrEmployeesSlice.reducer;