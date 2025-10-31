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
    updateDoc: (state, action) => {
        const newDocument = action.payload;
        const nextStep = newDocument.nextStep;
        const documentWithoutNextStep = { ...newDocument, nextStep: undefined };
        const documentsExist = state.documents && Array.isArray(state.documents);
        const updatedDocuments = documentsExist
            ? 
            state.documents.map((doc) => {
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
            state.documents.some((doc) => doc.tag === documentWithoutNextStep.tag);

        if (!tagExists) {
            updatedDocuments.push(documentWithoutNextStep);
        }
        return {
            ...state,
            documents: updatedDocuments,
            nextStep: nextStep,
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


export const { storeInfo, updateDoc } = employeeSlice.actions;
export default employeeSlice.reducer;
