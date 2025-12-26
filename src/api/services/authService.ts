import {UserLogin} from "../../types/auth.types";
import {apiClient} from "../client";

const AUTH_ENDPOINTS = {
    LOGIN: "/users/login",
    LOGOUT: "/users/logout",
    REGISTER: "/users/registration",
    CHECK_SESSION: "/users/check-session",
} as const;

export const authService = {
    logoutUser: async () => {
        const response = await apiClient.post(AUTH_ENDPOINTS.LOGOUT);
        return response.data;
    },

    loginUser: async (formData: FormData) => {
        console.log(formData);
        const response = await apiClient.post(AUTH_ENDPOINTS.LOGIN,
            {
                username: formData.get("username"),
                password: formData.get("password"),
                "remember-me": formData.get("remember-me"),
            });
        return response.data;
    },

    registerUser: async (user: UserLogin | undefined) => {
        const query = {
            "username": user?.username,
            "password": user?.password,
        };

        const response = await apiClient.post(AUTH_ENDPOINTS.REGISTER, query);
        return response.data;
    },

    checkSession: async () => {
        try {
            const response = await apiClient.get(AUTH_ENDPOINTS.CHECK_SESSION);
            console.log(response.status === 200);
            return response.status === 200;
        } catch (error: any) {
            if (error.response) {
                console.log('Error status:', error.response.status);
            } else {
                console.log('Error message:', error.message);
            }
            return false;
        }
    }
}
