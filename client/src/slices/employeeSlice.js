// user info --  employee use / or hr use to store selected employee info
import { createSlice } from '@reduxjs/toolkit';

const employeeSlice = createSlice({
  name: 'employee',
  initialState: {
    employee: [], // 员工资料对象
    loading: false,
    error: null,
  },
  reducers: {
    storeInfo: (state, action) => { state.employee = action.payload },
  }
});


export const { storeInfo } = employeeSlice.actions;
export default employeeSlice.reducer;