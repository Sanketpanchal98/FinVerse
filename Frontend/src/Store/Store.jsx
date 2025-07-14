import { configureStore } from "@reduxjs/toolkit";
import ThemeSlice from "../Slices/ThemeSlice";
import UserSlice from '../Slices/AuthSlice';
import ExpenseSlice from '../Slices/ExpenseSlice'

export const store = configureStore({
    reducer : {
        theme : ThemeSlice,
        user : UserSlice,
        expense : ExpenseSlice
    }
});