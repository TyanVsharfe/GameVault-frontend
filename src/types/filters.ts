export interface FilterState {
    status: string | null;
    dlcOnly: boolean | null;
    minRating: number | null;
    maxRating: number | null;
    hasReview: boolean | null;
    isFullyCompleted: boolean | null;
    title: string;
    createdAfter: Date | null;
    createdBefore: Date | null;
    sort: {sortBy: string, direction: 'asc' | 'desc'};
}

export const DEFAULT_FILTERS: FilterState = {
    status: null,
    dlcOnly: null,
    minRating: null,
    maxRating: null,
    hasReview: null,
    isFullyCompleted: null,
    title: '',
    createdAfter: null,
    createdBefore: null,
    sort: {sortBy: "createdAt", direction: 'asc'}
}

export const FILTERS_STORAGE_KEY = 'user_games_filters';

export interface SearchFilterState {
    minRating: number | null;
    maxRating: number | null;
    releasedAfter: Date | null;
    releasedBefore: Date | null;
    sort: {sortBy: string, direction: 'asc' | 'desc'};
}