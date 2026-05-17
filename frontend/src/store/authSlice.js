import { createSlice } from '@reduxjs/toolkit';

const initialToken = localStorage.getItem('token') || null;
const initialUser = JSON.parse(localStorage.getItem('user')) || null;

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: initialUser,
        token: initialToken
    },
    reducers: {
        loginSuccess: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('user', JSON.stringify(action.payload.user));
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }
});
export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
