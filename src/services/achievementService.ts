import axios from "axios";

const BASE_URL = 'http://localhost:8080/users';

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

export const getUserAchievements = async () => {
    const headers = {withCredentials: true};

    const response = await axios.get(`${BASE_URL}/achievements`, headers);
    return response.data;
};