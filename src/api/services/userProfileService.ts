import { apiClient } from "../client";

export interface UserProfile {
    userId: string;
    steamId: string;
    steamSyncEnabled: boolean;
}

export interface UserProfileUpdate {
    steamId?: string;
    steamSyncEnabled?: boolean;
}

const GAME_ENDPOINTS = {
    GET: '/users/integrations/steam',
    EDIT: '/users/integrations/steam',
    DELETE: '/users/integrations/steam',
    DELETE_SYNC: (noteId: string) => `/games/notes/${noteId}`,
} as const;

export const userProfileService = {
    getProfile: async () => {
        const response = await apiClient.get(GAME_ENDPOINTS.GET);

        return response.data;
    },

    editSteamInfo: async (content: UserProfileUpdate) => {

        const query: UserProfileUpdate = {
            ...(content.steamId !== undefined && { steamId: content.steamId }),
            ...(content.steamSyncEnabled !== undefined && { steamSyncEnabled: content.steamSyncEnabled }),
        };

        const response = await apiClient.put(GAME_ENDPOINTS.EDIT, query);

        return response.data;
    },

    deleteSteamInfo: async (noteId: string | undefined) => {
        const response = await apiClient.delete(GAME_ENDPOINTS.DELETE, headers);

        return response.data;
    }
}