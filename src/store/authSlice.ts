import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {authService} from '../api/services/authService';

interface AuthState {
    isLogin: boolean;
    loading: boolean;
    error: string | null;
    lastCheckTime: number;
    initialized: boolean;
}

const initialState: AuthState = {
    isLogin: false,
    loading: false,
    error: null,
    lastCheckTime: 0,
    initialized: false
};

const SESSION_CACHE_DURATION = 60000;

export const verifySession = createAsyncThunk(
    'auth/verifySession',
    async (_, { getState, rejectWithValue }) => {
        const state = getState() as { auth: AuthState };
        const now = Date.now();

        if (
            state.auth.isLogin &&
            now - state.auth.lastCheckTime < SESSION_CACHE_DURATION
        ) {
            return state.auth.isLogin;
        }

        try {
            return await authService.checkSession();
        } catch (error) {
            return rejectWithValue(
                error instanceof Error ? error.message : 'Session verification failed'
            );
        }
    }
);

export const logout = createAsyncThunk('auth/logout', async () => {
    await authService.logoutUser();
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
                state.lastCheckTime = Date.now();
                state.initialized = true;
            })
            .addCase(verifySession.rejected, (state, action) => {
                state.loading = false;
                state.isLogin = false;
                state.error = action.payload as string;
                state.lastCheckTime = Date.now();
                state.initialized = true;
            })
            .addCase(logout.pending, (state) => {
                state.loading = true;
            })
            .addCase(logout.fulfilled, (state) => {
                state.isLogin = false;
                state.loading = false;
                state.lastCheckTime = Date.now();
                state.error = null;
            })
            .addCase(logout.rejected, (state) => {
                state.isLogin = false;
                state.loading = false;
            });
    },
});

export default authSlice.reducer;