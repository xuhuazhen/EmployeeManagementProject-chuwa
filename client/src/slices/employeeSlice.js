// user info --  employee use / or hr use to store selected employee info
import { createSlice } from '@reduxjs/toolkit';
import { initUserThunk } from '../thunks/employeeThunk';

const employeeSlice = createSlice({
  name: "employee",
  initialState: {
    employee: [], // 员工资料对象
    loading: false,
    error: null,
  },
  reducers: {
    storeInfo: (state, action) => { state.employee = action.payload },
    updateInfo: (state, action) => { 
        state.employee.nextStep = action.payload.nextStep
        state.employee.application.status = action.payload.newApplicationStatus;
    },
    updateDoc: (state, action) => {
        const newDocument = action.payload;
        const nextStep = newDocument.nextStep;
        const documentWithoutNextStep = { ...newDocument, nextStep: undefined };
        const documentsExist = state.employee.documents && Array.isArray(state.documents);
        const updatedDocuments = documentsExist
            ? 
            state.employee.documents.map((doc) => {
                // Replace the document with the same tag, if it exists
                if (doc.tag === documentWithoutNextStep.tag) {
                return documentWithoutNextStep;
                } else {
                return doc;
                }
            })
            : []; 
        const tagExists =
            documentsExist &&
            state.employee.documents.some((doc) => doc.tag === documentWithoutNextStep.tag);

        if (!tagExists) {
            updatedDocuments.push(documentWithoutNextStep);
        }
        return {
            ...state,
            employee: {
                ...state.employee,
                documents: updatedDocuments,
                nextStep: nextStep,
            },
        };
    }
  }, extraReducers: (builder) => {
        builder
        .addCase(initUserThunk.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(initUserThunk.fulfilled, (state, action) => {
            state.loading = false;
            state.employee = action.payload || [];
        })
        .addCase(initUserThunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        
  }
});


export const { storeInfo, updateDoc, updateInfo } = employeeSlice.actions;
export default employeeSlice.reducer;
