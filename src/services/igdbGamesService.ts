import axios from "axios";
import {Note} from "./noteService";
import {CategoryIGDB} from "../utils/Enums";
import {BASE_URL} from "./authService";

const SERVICE_URL = `${BASE_URL}/igdb`;

export interface IgdbGame {
    id: number;
    cover?: Cover;
    first_release_date: number;
    game_modes: GameMode[];
    franchises?: string;
    collections?: Series[];
    genres: Genre[];
    name: string;
    game_status: string;
    game_type: GameType;
    involved_companies: InvolvedCompany[];
    dlcs?: IgdbGame[];
    expansions?: IgdbGame[];
    release_dates: ReleaseDate[];
    platforms: Platform[];
    summary: string;
    parent_game?: ParentGame;
}

export interface GameMode {
    id: number;
    name: string;
    slug: string;
}

export interface GameType {
    id: number;
    type: string;
}

export interface ParentGame {
    id: number;
    name: string;
}

export interface Series {
    id: number;
    name: string;
    slug: string;
    games: IgdbGame[];
}

export interface InvolvedCompany {
    id: number;
    company: Company;
    developer: boolean;
    publisher: boolean;
}

export interface Company {
    id: number;
    name: string;
}

export interface Genre {
    id: number;
    name: string;
}

export interface Cover {
    id: number;
    url: string;
}

export interface Platform {
    id: number;
    abbreviation: string;
}

export interface ReleaseDate {
    id: number;
    y: string;
}

export interface ReleaseGame {
    id: number;
    game: IgdbGame;
    human: string;
}

interface PlatformInfo {
    id: number;
    abbreviation: string;
}

export interface AggregatedRelease {
    gameId: number;
    gameName: string;
    coverUrl?: string;
    platforms: PlatformInfo[];
    earliestRelease?: {
        date: number;
        human: string;
        platform: number;
    };
}

function aggregateReleasesByGame(releaseDates: any[]): AggregatedRelease[] {
    const gameMap = new Map<number, AggregatedRelease>();

    for (const release of releaseDates) {
        const gameInfo = release.game;
        const gameId = gameInfo.id;

        if (!gameMap.has(gameId)) {
            gameMap.set(gameId, {
                gameId: gameId,
                gameName: gameInfo.name,
                coverUrl: gameInfo.cover?.url,
                platforms: [...gameInfo.platforms],
                earliestRelease: {
                    date: release.date,
                    human: release.human,
                    platform: release.platform
                }
            });
        } else {
            const existingRecord = gameMap.get(gameId)!;
            const existingPlatformIds = new Set(existingRecord.platforms.map(p => p.id));

            for (const platform of gameInfo.platforms) {
                if (!existingPlatformIds.has(platform.id)) {
                    existingRecord.platforms.push(platform);
                    existingPlatformIds.add(platform.id);
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
    }

    return Array.from(gameMap.values());
}

export const getIdgbGames= async (gameName: string) => {
    try {
        const response = await fetch(`${BASE_URL}/igdb/games`, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: gameName
        });
        return await response.json();
    } catch (error) {
        console.error('Request error:', error);
    }
}

export const getIdgbGame= async (gameId: string | undefined) => {
    try {
        const response = await axios.get(`${SERVICE_URL}/games/${gameId}`);
        return response.data;
    } catch (error) {
        console.error('Request error:', error);
    }
}

export const getGameSeries= async (seriesSlug: string | undefined) => {
    try {
        const response = await axios.get(`${SERVICE_URL}/series/${seriesSlug}`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Request error:', error);
    }
}

export const getComingSoonGames= async () => {
    try {
        const response = await axios.get(`${SERVICE_URL}/games/release-dates`);
        return aggregateReleasesByGame(response.data);
    } catch (error) {
        console.error('Request error:', error);
    }
}