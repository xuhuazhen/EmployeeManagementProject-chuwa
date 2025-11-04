import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchAllEmployeesAPI,
  sendNotificationAPI,
  updateDocumentStatusAPI,
} from "../api/hrAPIs";
import { formatProfile } from "../utils/formatProfile";

// Fetch all employees
export const fetchAllEmployees = createAsyncThunk(
  "employees/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await fetchAllEmployeesAPI(params);
      return data.map(formatProfile);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

//Fetch in progress employees
export const fetchInProgressEmployees = createAsyncThunk(
  "employees/fetchInProgress",
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await fetchAllEmployeesAPI({
        visa: "F1",
        inProgressIncomplete: true,
        params,
      });
      return data.map(formatProfile);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

//Fetch visa employees
export const fetchVisaEmployees = createAsyncThunk(
  "employees/fetchVisa",
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await fetchAllEmployeesAPI({ visa: "F1", ...params });
      return data.map(formatProfile);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Approve/reject document
export const updateDocumentStatus = createAsyncThunk(
  "hrEmployees/updateDocumentStatus",
  async ({ userId, docId, status, feedback }, { rejectWithValue }) => {
    try {
      const res = await updateDocumentStatusAPI({ userId, docId, status, feedback });
      return res; // { doc, nextStep }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update document status"
      );
    }
  }
);
export const sendNotification = createAsyncThunk(
  "employees/sendNotification",
  async (employeeId, { rejectWithValue }) => {
    try { 
      return await sendNotificationAPI({employeeId});
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchEmployeesByStatus = createAsyncThunk(
  "employees/fetchByStatus",
  async (status, { rejectWithValue }) => {
    try {
      const data = await fetchAllEmployeesAPI({ status });
      return { status, data };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// export const fetchEmailHistory = createAsyncThunk(
//   "notifications/fetchHistory",
//   async (_, { rejectWithValue }) => {
//     try {
//       const data = await getEmailHistoryAPI();
//       return data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );
