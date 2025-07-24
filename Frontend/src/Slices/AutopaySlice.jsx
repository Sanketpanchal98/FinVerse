import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addAutopay, editAutopay, fetchAll, removeAutopay } from "../API/Autopay.api";
import { useErrorBoundary } from "react-error-boundary";

export const autopayAll = createAsyncThunk('autoay/fetch' , async () => {
    
    try {        
        const response = await fetchAll();
        return response.data.data

    } catch (error) {
        console.log(error);
    }

})

const initialState = {
    autopays : [],
    isLoading : false,
    isError : false,
    isCompleted : false
}

const AutopaySlice = createSlice({
    name : 'Autopay',
    initialState,
    reducers : {
        addAutopayReducer : (state, action) => {
            state.autopays.push(action.payload)
        },
        updateAutopayReducer : (state, action) => {
            state.autopays = state.autopays.map((auto) => {                
                if(auto._id === action.payload._id){
                    auto = action.payload;
                }
                return auto;
            })
        },
        deleteAutopayReducer : (state, action) => {
            state.autopays = state.autopays.filter((autopay) => autopay._id != action.payload)
        }
    },
    extraReducers : (builder) => {
        builder
        .addCase(autopayAll.fulfilled, (state, action) => {            
            state.autopays = action.payload
            state.isLoading = false
            state.isCompleted = true,
            state.isError = false
        })
        .addCase(autopayAll.rejected, (state) => {
            state.isLoading = false
            state.isCompleted = false,
            state.isError = true
        })
        .addCase(autopayAll.pending, (state) => {
            state.isLoading = true
            state.isCompleted = false,
            state.isError = false
        })
    }

})

export const { getAllAutopay, deleteAutopayReducer, addAutopayReducer, updateAutopayReducer } = AutopaySlice.actions

export default AutopaySlice.reducer