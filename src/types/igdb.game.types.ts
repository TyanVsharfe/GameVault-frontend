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
    slug: string;
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
    gameType: number;
    coverUrl?: string;
    platforms: PlatformInfo[];
    earliestRelease?: {
        date: number;
        human: string;
        platform: number;
    };
}