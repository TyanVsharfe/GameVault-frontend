import axios from "axios";
import {BASE_URL} from "./authService";

const SERVICE_URL = `${BASE_URL}/users`;

export interface Achievement {
    id: number;
    name: string;
    description: string;
    category: string;
    requiredCount: number;
    experiencePoints: number;
}

export interface UserAchievment {
    id: number;
    achievement: Achievement;
    achievedAt: string;
    currentProgress: number;
    completed: boolean;
}

export const getUserAchievements = async (lang: string) => {
    const headers = {
        withCredentials: true,
        headers: {
            'Accept-Language': lang,
        }
    }

    const response = await axios.get(`${SERVICE_URL}/achievements`, headers);
    return response.data;
};