// user info --  employee use / or hr use to store selected employee info
import { createSlice } from '@reduxjs/toolkit';

const employeeSlice = createSlice({
  name: 'employee',
  initialState: {
    employee: null, // 员工资料对象
    loading: false,
    error: null,
  },
  reducers: {
    updateInfo: (state, payload) => { state.data = payload; },
  }
});


export const { updateInfo } = employeeSlice.actions;
export default employeeSlice.reducer;