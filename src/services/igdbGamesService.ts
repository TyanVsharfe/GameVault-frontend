import axios from "axios";
import {Note} from "./noteService";
import {CategoryIGDB} from "../utils/Enums";

const BASE_URL = 'http://localhost:8080/api/igdb';

export interface IgdbGame {
    id: number;
    category: number;
    cover: Cover;
    first_release_date: number;
    franchises: string;
    genres: Genre[];
    name: string;
    game_status: string;
    game_type: number;
    involved_companies: InvolvedCompany[];
    release_dates: ReleaseDate[];
    platforms: Platform[];
    summary: string;
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

export const getIdgbGames= async (gameName: string) => {
    try {
        const response = await fetch('http://localhost:8080/api/igdb/games', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: gameName
        });
        console.log(response);
        return await response.json();
    } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
    }
}

export const getIdgbGame= async (gameId: string | undefined) => {
    try {
        const response = await axios.get(`${BASE_URL}/games/${gameId}`);
        return response.data;
    } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
    }
}

export const getComingSoonGames= async () => {
    try {
        const response = await axios.get(`${BASE_URL}/games/release-dates`);
        return response.data;
    } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
    }
}