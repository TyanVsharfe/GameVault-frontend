import axios from "axios";
import { PageResponse, UpdateGameRatingParams, UserGame } from "../../types/user.game.types";
import { apiClient } from "../client";

export const API_PREFIX = "/api/v1"
export const BASE_ADDRESS = "http://localhost:8080"

export const BASE_URL = BASE_ADDRESS + API_PREFIX;

const SERVICE_URL = `${BASE_URL}/users/games`;

const GAME_ENDPOINTS = {
    GET_USER_GAME: (igdbId: string) => `/users/games/${igdbId}`,
    GET_USER_GAMES: (status: string, page: number = 0, size: number = 20) => `/users/games?status=${status}&page=${page}&size=${size}`,
    GET_GAME_REVIEWS: (igdbId: string) => `/users/games/${igdbId}/reviews`,
    ADD_USER_GAME: (igdbId: string) => `/users/games/${igdbId}`,
    UPDATE_USER_GAME: (igdbId: string) => `/users/games/${igdbId}`,
    UPDATE_USER_GAME_MODE: (igdbId: string, mode: string) => `/users/games/${igdbId}/mode/${mode}`,
    DELETE_USER_GAME: (igdbId: string) => `/users/games/${igdbId}`,
} as const;

export const userGameService = {
    // SWR
    fetchUserGames: async (url: string): Promise<PageResponse<UserGame>> => {
        const headers = {withCredentials: true};
        const response = await axios.get(url, headers);
        return response.data;
    },

    buildUserGamesUrl: (page: number, size: number, status?: string): string => {
        let url = `${SERVICE_URL}?page=${page}&size=${size}`;
        if (status) {
            url += `&status=${status}`;
        }
        return url;
    },

    // Others
    getUserGames: async (status: string, page: number = 0, size: number = 20) => {
        console.log(`${SERVICE_URL}/all?=${status}`);
        const response = await apiClient.get(GAME_ENDPOINTS.GET_USER_GAMES(status, page, size));

        //await apiRequest(response)

        console.log(response.data);
        return response.data;
    },

    getUserGame: async (igdbId: string | undefined) => {

        const response = await apiClient.get(GAME_ENDPOINTS.GET_USER_GAME(igdbId ?? ""));

        //await apiRequest(response)

        console.log(response.data);
        return response.data;
    },

    getGameReviews: async (igdbId: string | undefined) => {

        const response = await apiClient.get(GAME_ENDPOINTS.GET_GAME_REVIEWS(igdbId ?? ""));

        //await apiRequest(response)

        return response.data;
    },

    deleteUserGame: async (igdbId: string | undefined) => {

        const response = await apiClient.delete(GAME_ENDPOINTS.DELETE_USER_GAME(igdbId ?? ""));

        //await apiRequest(response)

        return response.data;
    },

    addUserGame: async (igdbId: string | undefined) => {

        const response = await apiClient.post(GAME_ENDPOINTS.ADD_USER_GAME(igdbId ?? ""), {});

        //await apiRequest(response)

        return response.data;
    },

    updateUserGameModeStatus: async (igdbId: string | undefined,
                                                   mode: string | undefined, status: string) => {
        const query = {
            "status": status,
        };

        const response = await apiClient.put(GAME_ENDPOINTS.UPDATE_USER_GAME_MODE(igdbId ?? "", mode ?? ""), query);

        //await apiRequest(response)

        return response.data;
    },

    updateUserGameModeRating: async (mode: string | undefined, overallRating :boolean, params: UpdateGameRatingParams) => {
        const { igdbId, graphics = 0, story = 0, gameplay = 0, resetUserRating = false } = params;

        let rating: number | undefined;

        if (!resetUserRating) {
            rating = getRating(graphics, story, gameplay);
        }

        const query = {
            ...(rating !== undefined && { userRating: rating }),
            "isOverallRatingManual": overallRating,
        };

        const response = await apiClient.put(GAME_ENDPOINTS.UPDATE_USER_GAME_MODE(igdbId ?? "", mode ?? ""), query);

        //await apiRequest(response)

        return rating;
    },

    updateGameStatus: async (igdbId: string | undefined, status: string) => {
        const query = {
            "status": status,
        };

        const headers = {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        };

        const response = await apiClient.put(`${SERVICE_URL}/${igdbId}`, query, headers);

        //await apiRequest(response)

        return response.data;
    },


    updateGameRating: async (params: UpdateGameRatingParams) => {
        const { igdbId, graphics = 0, story = 0, gameplay = 0, resetUserRating = false } = params;

        let rating: number | undefined;

        if (!resetUserRating) {
            rating = getRating(graphics, story, gameplay);
        }

        const query = {
            ...(rating !== undefined && { userRating: rating }),
            resetUserRating
        };

        console.log(query);

        const response = await apiClient.put(GAME_ENDPOINTS.UPDATE_USER_GAME(igdbId ?? ""), query);

        //await apiRequest(response)

        return rating ?? 0;
    },

    updateGameReview: async (igdbId: string | undefined, review: string) => {
        const query = {
            "review": review,
        };

        const response = await apiClient.put(GAME_ENDPOINTS.UPDATE_USER_GAME(igdbId ?? ""), query);

        //await apiRequest(response)
        return review;
    },

    deleteGameReview: async (igdbId: string | undefined, review: string) => {
        const query = {
            "review": "",
        };

        const response = await apiClient.put(GAME_ENDPOINTS.UPDATE_USER_GAME(igdbId ?? ""), query);

        //await apiRequest(response)

        return review;
    },

    checkEntity: async (gbId: string | undefined) => {
        try {
            const response = await fetch(`${SERVICE_URL}/exists/${gbId}`, {
                method: 'GET',
                credentials: 'include',
            });

            if (response.status == 200) {
                return true;
            } else {
                // console.error('entity validation error:', response.status);
                return false;
            }
        } catch (error) {
            console.error('an error occurred:', error);
            return false;
        }
    }
}

const getRating = (graphics: number, story: number, gameplay: number) => {
    return graphics * 2 + story * 3.5 + gameplay * 4.5
}

