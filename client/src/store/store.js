import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import employeeReducer from "../slices/employeeSlice";
import hrEmployeesReducer from "../slices/hrEmployeesSlice"; 

const store = configureStore({
  reducer: {
    auth: authReducer,
    employee: employeeReducer,
    hrEmployees: hrEmployeesReducer,
  },
});

export default store;
