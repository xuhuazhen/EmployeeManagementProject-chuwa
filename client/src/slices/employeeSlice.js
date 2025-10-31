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
  }
});


export const { storeInfo, updateDoc } = employeeSlice.actions;
export default employeeSlice.reducer;