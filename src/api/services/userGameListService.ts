import axios from "axios";
import {PageResponseList, UserGameList, UserGameListForm} from "../../types/user.game.list.types";
import { apiClient } from "../client";

export const API_PREFIX = "/api/v1"
export const BASE_ADDRESS = "http://localhost:8080"

export const BASE_URL = BASE_ADDRESS + API_PREFIX;

const SERVICE_URL = `${BASE_URL}/users/game-lists`;

const GAME_ENDPOINTS = {
    GET_GAME_LISTS: "/users/game-lists",
    CREATE_GAME_LIST: "/users/game-lists",
    BY_ID: (id: string) => `/users/game-lists/${id}`,
    COPY_BY_ID: (id: string) => `/users/game-lists/${id}`,
    DELETE_GAME_BY_ID: (listId: string, id: number) => `/users/game-lists/${listId}/games/${id}`,
} as const;

export const userGameListService = {
    // SWR
    fetchUserGameLists: async (url: string): Promise<PageResponseList<UserGameList>> => {
        try {
            const headers = { withCredentials: true };
            const response = await axios.get(url, headers);
            return response.data;
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    return {
                        content: [],
                        totalPages: 0,
                        totalElements: 0,
                        number: 0,
                        size: 20,
                        first: true,
                        last: true,
                    };
                } else {
                    console.error('Fetch error:', error.message);
                }
            } else {
                console.error('Unexpected error:', error);
            }
            return {
                content: [],
                totalPages: 0,
                totalElements: 0,
                number: 0,
                size: 20,
                first: true,
                last: true,
            };
        }
    },

    buildUserGameListsUrl: (page: number, size: number, status?: string): string => {
        let url = `${SERVICE_URL}?page=${page}&size=${size}`;
        if (status) {
            url += `&status=${status}`;
        }
        return url;
    },

    // Others
    createUserGameList: async ({name, description, isPublic}: UserGameListForm) => {
        const query = {
            "name": name,
            "description": description,
            "isPublic": isPublic,
        };

        const response = await apiClient.post(GAME_ENDPOINTS.CREATE_GAME_LIST, query);

        //await apiRequest(response)

        return response.data;
    },

    updateUserGameList: async (query: UserGameListForm, listId: string) => {

        const response = await apiClient.put(GAME_ENDPOINTS.BY_ID(listId), query);

        //await apiRequest(response)

        return response.data;
    },

    getUserGameList: async (listId: string | undefined) => {

        const response = await apiClient.get(GAME_ENDPOINTS.BY_ID(listId ?? ""));

        //await apiRequest(response)

        return response.data;
    },

    copyUserGameList: async (listId: string | undefined) => {

        const response = await apiClient.post(GAME_ENDPOINTS.COPY_BY_ID(listId ?? ""), {});

        //await apiRequest(response)

        return response.data;
    },

    deleteUserGameList: async (listId: string | undefined) => {

        const response = await apiClient.delete(GAME_ENDPOINTS.BY_ID(listId ?? ""));

        //await apiRequest(response)

        return response.data;
    },

    deleteUserGameFromList: async (listId: string | undefined,
                                                 igdbId: number | undefined) => {

        const response = await apiClient.delete(GAME_ENDPOINTS.DELETE_GAME_BY_ID(listId ?? "", igdbId));

        //await apiRequest(response)

        return response.data;
    }
}




