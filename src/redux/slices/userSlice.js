import { createSlice } from '@reduxjs/toolkit'
import Cookies from 'js-cookie';

let token = Cookies.get("accessToken") || ""
let user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : undefined


const slice = createSlice({
    name: 'user',
    initialState: {
        user: user || [],
        accessToken: token || ""
    },
    reducers: {
        getUser: (state, action) => {
            let data = JSON.stringify(action.payload)
            console.log("STRINGIFY", data);
            Cookies.set("user", data, {expires: 1})
            state.user = action.payload;
        },
        getUserAccessToken: (state, action) => {
            Cookies.set("accessToken", action.payload, {expires: 1})
            state.accessToken = action.payload;
        },
    },
});

export const { getUser, getUserAccessToken } = slice.actions

export default slice.reducer