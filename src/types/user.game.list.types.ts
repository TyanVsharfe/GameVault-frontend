import {Game} from "./user.game.types";

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
    name?: string;
    description?: string;
    isPublic?: boolean;
    games?: number[];
}
