import { createAsyncThunk,  createSlice} from "@reduxjs/toolkit";
import { allExpenses } from "../API/Expense.api";


export const fetchExpenses = createAsyncThunk('expense/fetch' ,async ( _, rejectWithValue) => {

    try {
        
        const res = await allExpenses();        
        return res.data.data;

    } catch (error) {
        return rejectWithValue(error.message)
    }

});

const initialState = {
    expenses : [],
    isLoading : false,
    isFulfilled : false,
    isRejected : false
}

const ExpenseSlice = createSlice({
    name : 'Expenses',
    initialState,
    reducers : {
        addExpenses : (state, action) => {
            state.expenses.push(action.payload)
        },
        removeExpenses : (state) => {
            state.expenses = []
        }
    },

    extraReducers : (builder) => 
        builder
    .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.expenses = state.expenses.concat(action.payload)        
        state.isFulfilled = true
    })
    .addCase(fetchExpenses.rejected, (state) => {
        state.isRejected = true
    })
    .addCase(fetchExpenses.pending , (state) => {
        state.isLoading = true
    })
})

export const { addExpenses } = ExpenseSlice.actions

export default ExpenseSlice.reducer