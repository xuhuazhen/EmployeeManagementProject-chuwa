import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAllEmployees,
  fetchInProgressEmployees,
  fetchVisaEmployees,
  fetchEmployeesByStatus,
  updateDocumentStatus,
} from "../thunks/hrEmployeesThunk";
import { fetchEmployeeById } from "../thunks/employeeDetailThunk";

const hrEmployeesSlice = createSlice({
  name: "employees",
  initialState: {
    all: [],
    inProgress: [],
    visa: [],
    loading: false,
    error: null,
    search: "",
    // currentEmployee: null,
    // detailLoading: false,
  },
  reducers: {
    setSearch(state, action) {
      state.search = action.payload;
    },
    // clearCurrentEmployee(state) {
    //   state.currentEmployee = null;
    // },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all employees
      .addCase(fetchAllEmployees.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.all = action.payload;
      })
      .addCase(fetchAllEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch one employee
      .addCase(fetchEmployeeById.pending, (state) => {
        state.detailLoading = true;
      })
      .addCase(fetchEmployeeById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.currentEmployee = action.payload;
      })
      .addCase(fetchEmployeeById.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload;
      })

      //Fetch in progress employees
      .addCase(fetchInProgressEmployees.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInProgressEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.inProgress = action.payload.filter(e => e.application !== "application-waiting");
      })
      .addCase(fetchInProgressEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateDocumentStatus.fulfilled, (state, action) => {
        state.loading = false;
        const { doc, nextStep } = action.payload;

        // Update inProgress and remove completed
        state.inProgress = state.inProgress
          .map((emp) => {
            if (emp.documents?.some((d) => d._id === doc._id)) {
              return {
                ...emp,
                documents: emp.documents.map((d) =>
                  d._id === doc._id ? { ...d, ...doc } : d
                ),
                nextStep,
              };
            }
            return emp;
          })
          .filter((emp) => emp.nextStep !== "all-done");

        // Update visa list without filtering
        state.visa = state.visa.map((emp) => {
          if (emp.documents?.some((d) => d._id === doc._id)) {
            return {
              ...emp,
              documents: emp.documents.map((d) =>
                d._id === doc._id ? { ...d, ...doc } : d
              ),
              nextStep,
            };
          }
          return emp;
        });
      })
      // Visa
      .addCase(fetchVisaEmployees.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchVisaEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.visa = action.payload;
      })
      .addCase(fetchVisaEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Status lists (Pending, Rejected, Approved) Hiring Management
      .addCase(fetchEmployeesByStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEmployeesByStatus.fulfilled, (state, action) => {
        const { status, data } = action.payload;
        state.loading = false;
        state.statusLists[status] = data;
      })
      .addCase(fetchEmployeesByStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSearch, clearCurrentEmployee } = hrEmployeesSlice.actions;

export default hrEmployeesSlice.reducer;
