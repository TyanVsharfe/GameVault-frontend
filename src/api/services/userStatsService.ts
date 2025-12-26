import {apiClient} from "../client";

export interface UserStats  {
    username: string;
    totalGames: number;
    gamesByStatus: Record<string, number>;
    averageRating: number;
    totalNotes: number;
}

const GAME_ENDPOINTS = {
    GET_USER_STATS: (username: string) => `/users/${username}/stats`,
    GET_OWN_USER_STATS: "/users/me/stats",
} as const;

export const userStatsService = {
    getUserStats: async (username: string) => {
        const headers = {withCredentials: true};

        const response = await apiClient.get(GAME_ENDPOINTS.GET_USER_STATS(username), headers);
        return response.data;
    },

    getOwnUserStats: async () => {
        const headers = {withCredentials: true};

        const response = await apiClient.get(GAME_ENDPOINTS.GET_OWN_USER_STATS, headers);
        return response.data;
    }
}

