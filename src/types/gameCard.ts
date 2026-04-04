import {EnrichedGameSearch} from "../api/services/enrichedGamesService";

export interface EnrichedGameCardProps {
    game: EnrichedGameSearch;
    t: (key: string) => string;
    onStatusChange: (gameId: number, status: string) => void;
}