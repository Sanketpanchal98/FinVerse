import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { allExpenses } from "../API/Expense.api";


export const fetchExpenses = createAsyncThunk('expense/fetch', async (_, rejectWithValue) => {

    try {

        const res = await allExpenses();
        
        return res.data.data;

    } catch (error) {
        console.log(error);

        return rejectWithValue(error.message)
    }

});

const initialState = {
    expenses: [],
    isLoading: false,
    isFulfilled: false,
    isRejected: false
}

const ExpenseSlice = createSlice({
    name: 'Expenses',
    initialState,
    reducers: {
        addExpenses: (state, action) => {
            state.expenses.push(action.payload)
        },
        removeExpenses: (state, action) => {
            state.expenses = state.expenses.filter((expense) => expense._id !== action.payload)
        },
    },

    extraReducers: (builder) =>
        builder
            .addCase(fetchExpenses.fulfilled, (state, action) => {
                state.expenses = action.payload
                state.isLoading = false
                state.isCompleted = true,
                state.isError = false
            })
            .addCase(fetchExpenses.rejected, (state) => {
                state.isLoading = false
                state.isCompleted = false,
                state.isError = true
            })
            .addCase(fetchExpenses.pending, (state) => {
                state.isLoading = true
            state.isCompleted = false,
            state.isError = false
            })
})

export const { addExpenses, removeExpenses } = ExpenseSlice.actions

export default ExpenseSlice.reducer