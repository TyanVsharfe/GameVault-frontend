import {Game} from "../api/services/userGamesService";

export interface UserGameList {
    uuid: string,
    name: string,
    description: string,
    authorUsername: string,
    items: UserGameListItem[],
    isPublic: boolean,
    isOwned: boolean,
}

export interface UserGameListItem {
    uuid: string;
    game: Game;
    order: number;
    note: string;
}

export interface UserGameListForm {
    title?: string;
    description?: string;
    isPublic?: boolean;
    games?: number[];
}

export interface PageResponseList<T> {
    content: UserGameList[];
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
    first: boolean;
    last: boolean;
}
