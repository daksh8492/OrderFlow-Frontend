import type { User } from "@/features/users/types/user";
import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    accessToken: string | null;
    loading: boolean;
}

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    accessToken: null,
    loading: true
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.isAuthenticated = true
            state.accessToken = action.payload;
            state.loading = false
        },

        setLoading: (state, action) => {
            state.loading = action.payload;
        },

        setUser: (state, action) => {
            state.user = action.payload;
        },

        logoutSuccess: (state) => {
            state.isAuthenticated = false
            state.accessToken = null
            state.user = null
        }
    }
})

export const {loginSuccess, logoutSuccess, setLoading, setUser} = authSlice.actions

export default authSlice.reducer