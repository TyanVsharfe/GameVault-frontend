import {Note} from "../api/services/noteService";
import {Cover} from "./igdb.game.types";

export interface UserGame {
    game: Game;
    status: string;
    overallRatingManual: boolean;
    overallStatus: boolean;
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

export interface UpdateGameRatingParams {
    igdbId?: string;
    graphics?: number;
    story?: number;
    gameplay?: number;
    resetUserRating?: boolean;
}