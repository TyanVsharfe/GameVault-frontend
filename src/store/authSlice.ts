import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {checkSession, logoutUser} from '../services/authService';

interface AuthState {
    isLogin: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    isLogin: false,
    loading: false,
    error: null,
};

export const verifySession = createAsyncThunk('auth/verifySession', async () => {
    return await checkSession();
});

export const logout = createAsyncThunk('auth/logout', async () => {
    await logoutUser();
    return false;
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(verifySession.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifySession.fulfilled, (state, action) => {
                state.loading = false;
                state.isLogin = action.payload;
            })
            .addCase(verifySession.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Ошибка проверки сессии';
            })
            .addCase(logout.fulfilled, (state) => {
                state.isLogin = false;
            });
    },
});

export default authSlice.reducer;