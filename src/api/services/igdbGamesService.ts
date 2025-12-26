import { AggregatedRelease } from "../../types/igdb.game.types";
import {igdbClient} from "../client";

const GAME_ENDPOINTS = {
    SEARCH: "/igdb/games",
    RELEASE_DATES: "/igdb/games/release-dates",
    GET_BY_ID: (id: string) => `/igdb/games/${id}`,
    GET_SERIES: (seriesSlug: string) => `/igdb/series/${seriesSlug}`,
    GET_COMPANY: (companySlug: string) => `/igdb/game-company/${companySlug}`,
} as const;

export const igdbGamesService = {
    getIdgbGames: async (gameName: string) => {
        try {
            const response = await igdbClient.post(GAME_ENDPOINTS.SEARCH, gameName);
            return await response.data;
        } catch (error) {
            console.error('Request error:', error);
        }
    },

    getIdgbGame: async (gameId: string | undefined) => {
        if (!gameId) {
            throw new Error('Game ID is required');
        }

        try {
            const response = await igdbClient.get(GAME_ENDPOINTS.GET_BY_ID(gameId));
            return response.data;
        } catch (error) {
            console.error('Request error:', error);
        }
    },

    getGameSeries: async (seriesSlug: string | undefined) => {
        try {
            const response = await igdbClient.get(GAME_ENDPOINTS.GET_SERIES(seriesSlug ?? ""));
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error('Request error:', error);
        }
    },

    getGameCompany: async (companySlug: string | undefined) => {
        try {
            const response = await igdbClient.get(GAME_ENDPOINTS.GET_COMPANY(companySlug ?? ""));
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error('Request error:', error);
        }
    },

    getComingSoonGames: async () => {
        try {
            const response = await igdbClient.get(GAME_ENDPOINTS.RELEASE_DATES);
            return await aggregateReleasesByGame(response.data);
        } catch (error) {
            console.error('Request error:', error);
        }
    }
}

const aggregateReleasesByGame = async (releaseDates: any[]): Promise<AggregatedRelease[]> => {
    const gameMap = new Map<number, AggregatedRelease>();

    for (const release of releaseDates) {
        console.log(release.game.game_type);
        const gameInfo = release.game;
        const gameId = gameInfo.id;

        if (!gameMap.has(gameId)) {
            gameMap.set(gameId, {
                gameId: gameId,
                gameName: gameInfo.name,
                gameType: gameInfo.game_type,
                coverUrl: gameInfo.cover?.url,
                platforms: [],
                earliestRelease: {
                    date: release.date,
                    human: release.human,
                    platform: release.platform
                }
            });
        }

        const existingRecord = gameMap.get(gameId)!;

        if (release.platform) {
            const platformExists = existingRecord.platforms.some(
                p => p.id === release.platform.id
            );

            if (!platformExists) {
                if (release.platform) {
                    existingRecord.platforms.push(release.platform);
                }
            }
        }

        if (release.date < existingRecord.earliestRelease!.date) {
            existingRecord.earliestRelease = {
                date: release.date,
                human: release.human,
                platform: release.platform
            };
        }
    }

    return Array.from(gameMap.values());
}


