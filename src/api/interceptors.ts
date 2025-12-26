import { apiClient } from "./client";
import {authService} from "./services/authService";

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            const isAuthenticated = await authService.checkSession();
            if (!isAuthenticated) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);