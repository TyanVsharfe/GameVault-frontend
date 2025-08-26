import axios from "axios";
import {Note} from "./noteService";
import {apiRequest, BASE_URL} from "./authService";
import {IgdbGame} from "./igdbGamesService";

const SERVICE_URL = `${BASE_URL}/users/games`;

export interface UserGame {
    game: Game;
    status: string;
    userRating: number;
    coverUrl: string;
    review: string;
    notes: Note[];
}

export interface GameDTO {
    igdbId: number;
    title: string;
    coverUrl: string;
}

export interface Game {
    igdbId: number;
    title: string;
    coverUrl: string;
    description: string;
    pageCount: number;
    publisher: string;
    publishedDate: string;
    genres: string[];
    authors: string[];
}

export const getUserGames = async (status: string) => {
    const headers = {withCredentials: true};
    console.log(`${SERVICE_URL}/all?=${status}`);
    const response = await axios.get(`${SERVICE_URL}?status=${status}`, headers);

    await apiRequest(response)

    console.log(response.data);
    return response.data;
};

export const getUserGame = async (igdbId: string | undefined) => {
    const headers = {withCredentials: true};

    const response = await axios.get(`${SERVICE_URL}/${igdbId}`, headers);

    await apiRequest(response)

    console.log(response.data);
    return response.data;
};

export const getGameReviews = async (igdbId: string | undefined) => {
    const headers = {withCredentials: true};

    const response = await axios.get(`${SERVICE_URL}/${igdbId}/reviews`, headers);

    await apiRequest(response)

    return response.data;
};

export const deleteUserGame = async (igdbId: string | undefined) => {
    const headers = {withCredentials: true};

    const response = await axios.delete(`${SERVICE_URL}/${igdbId}`, headers);

    await apiRequest(response)

    return response.data;
};

export const addUserGame = async (igdbId: string | undefined) => {
    const headers = {withCredentials: true};

    const response = await axios.post(`${SERVICE_URL}/${igdbId}`, {}, headers);

    await apiRequest(response)

    return response.data;
};

export const updateGameStatus = async (igdbId: string | undefined, status: number) => {
    const query = {
        "status": status,
    };

    const headers = {
        headers: {
            'Content-Type': 'application/json'
        },
        withCredentials: true
    };

    const response = await axios.put(`${SERVICE_URL}/${igdbId}`, query, headers);

    await apiRequest(response)

    return response.data;
};


export const updateGameRating = async (igdbId: string | undefined, graphics: number, story: number, gameplay: number) => {
    let rating = getRating(graphics, story, gameplay);

    const query = {
        "userRating": rating,
    };

    console.log(query);

    const headers = {
        headers: {
            'Content-Type': 'application/json'
        },
        withCredentials: true
    };

    const response = await axios.put(`${SERVICE_URL}/${igdbId}`, query, headers);

    await apiRequest(response)

    return rating;
};

function getRating(graphics: number, story: number, gameplay: number) {
    return graphics * 2 + story * 3.5 + gameplay * 4.5
}

export const updateGameReview = async (igdbId: string | undefined, review: string) => {
    const query = {
        "review": review,
    };

    const headers = {
        headers: {
            'Content-Type': 'application/json'
        },
        withCredentials: true
    };

    const response = await axios.put(`${SERVICE_URL}/${igdbId}`, query, headers);

    await apiRequest(response)

    return review;
};

export const deleteGameReview = async (igdbId: string | undefined, review: string) => {
    const query = {
        "review": "",
    };

    const headers = {
        headers: {
            'Content-Type': 'application/json'
        },
        withCredentials: true
    };

    const response = await axios.put(`${SERVICE_URL}/${igdbId}`, query, headers);

    await apiRequest(response)

    return review;
};

export const checkEntity = async (gbId: string | undefined) => {
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
};