import axios from "axios";
import {Note} from "./noteService";
import {apiRequest, BASE_URL} from "./authService";
import {Cover, GameType} from "./igdbGamesService";

const SERVICE_URL = `${BASE_URL}/users/games`;

export interface UserGame {
    game: Game;
    status: string;
    overallRatingManual: boolean;
    overallStatusManual: boolean;
    userRating: number;
    coverUrl: string;
    review: string;
    notes: Note[];
    dlcs: DLC[];
    expansions: DLC[];
    userModes: UserMode[];
}

export interface UserMode {
    id: number;
    mode: string;
    status: string;
    userRating: number;
}

export interface DLC {
    id: number;
    name: string;
    cover: Cover;
    status: string;
    userRating: number;
}

export interface Game {
    igdbId: number ;
    title: string;
    category: string;
    coverUrl: string;
    description: string;
    pageCount: number;
    publisher: string;
    publishedDate: string;
    genres: string[];
    authors: string[];
}

interface UpdateGameRatingParams {
    igdbId?: string;
    graphics?: number;
    story?: number;
    gameplay?: number;
    resetUserRating?: boolean;
}

export interface PageResponse<T> {
    content: UserGame[];
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
    first: boolean;
    last: boolean;
}

// SWR
export const fetchUserGames = async (url: string): Promise<PageResponse<UserGame>> => {
    const headers = {withCredentials: true};
    const response = await axios.get(url, headers);
    return response.data;
};

export const buildUserGamesUrl = (page: number, size: number, status?: string): string => {
    let url = `${SERVICE_URL}?page=${page}&size=${size}`;
    if (status) {
        url += `&status=${status}`;
    }
    return url;
};

// Others
export const getUserGames = async (status: string, page: number = 0, size: number = 20) => {
    const headers = {withCredentials: true};
    console.log(`${SERVICE_URL}/all?=${status}`);
    const response = await axios.get(`${SERVICE_URL}?status=${status}&page=${page}&size=${size}`, headers);

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

export const updateUserGameModeStatus = async (igdbId: string | undefined,
                                               mode: string | undefined, status: string) => {
    const query = {
        "status": status,
    };

    const headers = {
        headers: {
            'Content-Type': 'application/json'
        },
        withCredentials: true
    };

    const response = await axios.put(`${SERVICE_URL}/${igdbId}/modes/${mode}`, query, headers);

    await apiRequest(response)

    return response.data;
};

export const updateUserGameModeRating = async (mode: string | undefined, overallRating :boolean, params: UpdateGameRatingParams) => {
    const { igdbId, graphics = 0, story = 0, gameplay = 0, resetUserRating = false } = params;

    let rating: number | undefined;

    if (!resetUserRating) {
        rating = getRating(graphics, story, gameplay);
    }

    const query = {
        ...(rating !== undefined && { userRating: rating }),
        "isOverallRatingManual": overallRating,
    };

    const headers = {
        headers: {
            'Content-Type': 'application/json'
        },
        withCredentials: true
    };

    const response = await axios.put(`${SERVICE_URL}/${igdbId}/modes/${mode}`, query, headers);

    await apiRequest(response)

    return rating;
};

export const updateGameStatus = async (igdbId: string | undefined, status: string) => {
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


export const updateGameRating = async (params: UpdateGameRatingParams) => {
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

    const headers = {
        headers: {
            'Content-Type': 'application/json'
        },
        withCredentials: true
    };

    const response = await axios.put(`${SERVICE_URL}/${igdbId}`, query, headers);

    await apiRequest(response)

    return rating ?? 0;
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