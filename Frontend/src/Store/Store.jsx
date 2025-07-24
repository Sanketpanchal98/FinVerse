import { configureStore } from "@reduxjs/toolkit";
import ThemeSlice from "../Slices/ThemeSlice";
import UserSlice from '../Slices/AuthSlice';
import ExpenseSlice from '../Slices/ExpenseSlice';
import AutopaySlice from '../Slices/AutopaySlice'
import GoalSlice from '../Slices/GoalSlice'

export const store = configureStore({
    reducer : {
        theme : ThemeSlice,
        user : UserSlice,
        expense : ExpenseSlice,
        autopay : AutopaySlice,
        goal : GoalSlice
    }
});