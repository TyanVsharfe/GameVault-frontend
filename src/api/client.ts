import axios from "axios";
import { getBaseUrl } from "../config/api.config";

export const apiClient = axios.create({
    baseURL: getBaseUrl(),
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
})

export const igdbClient = axios.create({
    baseURL: getBaseUrl(),
    headers: {
        'Content-Type': 'text/plain',
        'Accept': 'application/json',
    },
    transformRequest: [(data) => data],
});