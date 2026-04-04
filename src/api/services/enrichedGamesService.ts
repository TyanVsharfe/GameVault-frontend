import { apiClient } from "../client";
import {Cover, GameType, Platform, ReleaseDate} from "../../types/igdb.game.types";

const GAME_ENDPOINTS = {
    SEARCH_GAMES: `/games/enriched/search`,
    GET_GAME: (id: number) => `/games/enriched/${id}`,
    GET_GAME_LIST: (listId: string) => `/games/enriched/game-lists/${listId}`,
} as const;

export interface EnrichedGameSearch {
    id: number,
    name: string,
    gameType: GameType,
    firstReleaseDate: number,
    cover: Cover,
    releaseDates: ReleaseDate[],
    platforms: Platform[],
    userData: UserGameBatchData
}

export interface UserGameBatchData {
    userGameId: number;
    status: string;
    userRating: number;
    review: string;
    overallRatingManual: boolean;
    overallStatus: boolean;
    coverUrl: string;
    inLists: GameListReference[];
}

export interface GameListReference {
    listId: string;
    listName: string;
    isPublic: boolean;
}

export const enrichedGamesService = {
    searchGames: async (query: string) => {

        const response = await apiClient.get(GAME_ENDPOINTS.SEARCH_GAMES, { params: { query } });

        return response.data;
    },

    getGame: async (listId: number) => {

        const response = await apiClient.get(GAME_ENDPOINTS.GET_GAME(listId), query);

        return response.data;
    },

    getGameList: async (listId: string | undefined) => {

        const response = await apiClient.get(GAME_ENDPOINTS.GET_GAME_LIST(listId ?? ""));

        return response.data;
    }
}




