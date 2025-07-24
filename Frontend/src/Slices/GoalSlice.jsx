import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllGoal } from "../API/Goal.api";

export const fetchAllGoals = createAsyncThunk('goal/fetch' , async () => {

    try {
        
        const res = await getAllGoal();
        return res.data.data

    } catch (error) {
        console.log(error); 
        return error       
    }

})

const initialState = {
    goals : [],
    isError : false,
    isLoading : false,
    isCompleted : false
}

const GoalSlice = createSlice({
    name : 'Goal',
    initialState,
    reducers : {
        addGoalReducer : (state, action) => {
            state.goals.push(action.payload)
        },
        removeGoalReducer : (state, action) => {
            state.goals = state.goals.filter((goal) => goal._id !== action.payload)
        },
        updateGoalReducer : (state, action) => {
            state.goals = state.goals.map((auto) => {                
                if(auto._id === action.payload._id){
                    auto = action.payload;
                }
                return auto;
            })             
        }        
    },
    extraReducers : (builder) => {
        builder
        .addCase(fetchAllGoals.fulfilled, (state, action) => {
            state.goals = action.payload,
            state.isCompleted = true
        })
        .addCase(fetchAllGoals.rejected, (state) => {
            state.isError = true
        })
        .addCase(fetchAllGoals.pending, (state) => {
            state.isLoading = true
        })
    }
})

export const { addGoalReducer, removeGoalReducer, updateGoalReducer } = GoalSlice.actions

export default GoalSlice.reducer