import {Note} from "../api/services/noteService";
import {Cover} from "./igdb.game.types";
import {BaseEntity} from "./types";

export interface UserGame extends BaseEntity{
    game: Game;
    status: string;
    overallRating: boolean;
    overallStatus: boolean;
    userRating: number;
    customCoverUrl: string;
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

export interface UpdateUserGameModeParams {
    status: string | undefined;
    ratingParams: UpdateGameRatingParams;
}

export interface UpdateGameRatingParams {
    resetUserRating?: boolean;
    rating?: number;

    graphics?: number;
    story?: number;
    gameplay?: number;
}