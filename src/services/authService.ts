import axios from "axios";

const BASE_URL = 'http://localhost:8080';

export interface UserLogin {
    username: string;
    password: string;
}

export interface User {
    username: string;
    password: string;
}

export const logoutUser = async () => {
    const headers = {withCredentials: true};

    const response = await axios.post(`${BASE_URL}/users/logout`, {}, headers);
    return response.data;
};

export const loginUser = async (formData: FormData) => {
    const headers = {withCredentials: true};

    const response = await axios.post(`${BASE_URL}/users/login`, formData, headers);
    console.log(response);
    return response.data;
};

export const registerUser = async (user: UserLogin | undefined) => {
    const query = {
        "username": user?.username,
        "password": user?.password,
    };

    const headers = { headers: {
            'Content-Type': 'application/json'
        },
        withCredentials: true};

    const response = await axios.post(`${BASE_URL}/users/registration`, query, headers);
    return response.data;
};

export const checkSession = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/users/check-session`, {
            withCredentials: true,
        });
        console.log(response.status === 200);
        return response.status === 200;
    } catch (error) {
        if (error.response) {
            console.log('Error status:', error.response.status);
        } else {
            console.log('Error message:', error.message);
        }
        return false;
    }
};

export const apiRequest = async (response: axios.AxiosResponse<any>) => {
    if (response.status === 401) {
        const isAuthenticated = await checkSession();
        if (!isAuthenticated) {
            window.location.href = '/login';
        }
        throw new Error('Unauthorized');
    }
    return response;
};