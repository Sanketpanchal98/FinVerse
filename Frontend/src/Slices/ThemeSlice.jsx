import { createSlice } from "@reduxjs/toolkit";



const ThemeSlice = createSlice({
    name : 'theme',
    initialState : {
        theme : false
    },
    reducers : {
        toogleTheme : (state) => {
            state.theme = !state.theme
        }
    }
})

export const { toogleTheme } = ThemeSlice.actions

export default ThemeSlice.reducer;