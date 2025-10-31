import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import employeeReducer from "../slices/employeeSlice";
import hrEmployeesReducer from "../slices/hrEmployeesSlice";
import hrHistoryReducer from "../slices/hrHistorySlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    employee: employeeReducer,
    hrEmployees: hrEmployeesReducer,
    hrHistory: hrHistoryReducer,
  },
});

export default store;
