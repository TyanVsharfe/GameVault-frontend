import { useTranslation } from "react-i18next";
import { EnrichedGameCard } from "../card/EnrichedGameCard"
import {Box} from "@mui/joy";
import React, {useState} from "react";
import PaginationComponent from "../../ui/PaginationComponent";
import EnrichedGameCardLarge from "../card/EnrichedGameCardLarge";
import {EnrichedGameSearch} from "../../../api/services/enrichedGamesService";

export interface EnrichedIgdbGameListProps {
    games: EnrichedGameSearch[];
    gamesPerPage?: number;
    listType: number;
    onStatusChange: (gameId: number, status: string) => void;
}

// TODO вынести проспсы в отдельный файл хз
interface EnrichedGameCardProps {
    game: EnrichedGameSearch;
    t: (key: string) => string;
}

type CardComponents = Record<number, React.FC<EnrichedGameCardProps>>;

const cardComponents: CardComponents = {
    0: EnrichedGameCard,
    1: EnrichedGameCardLarge,
};

export const EnrichedIgdbGameList: React.FC<EnrichedIgdbGameListProps> = ({ games, listType, onStatusChange, gamesPerPage = 10 }) => {
    const { t } = useTranslation();

    const [currentPage, setCurrentPage] = useState<number>(1);

    const gamesWithCovers = games.filter(game => game?.coverUrl != null);

    const totalPages = Math.ceil(gamesWithCovers.length / gamesPerPage);

    return (
        <>
            <Box className="game-list"
                 sx={{
                     display: 'grid',
                     gridTemplateColumns: () =>
                         listType == 0
                             ? 'repeat(auto-fill, minmax(12rem, 3fr))'
                             : 'repeat(auto-fill, minmax(20rem, 1fr))',
                     maxWidth: '85rem',
                     width: '100%',
                     mx: 'auto',
                     pb: '0.75rem',
                     gap: 2,
                     justifyItems: 'center'
                 }}
            >
                {games.map((game: EnrichedGameSearch, index: number) => {
                    const CardComponent = cardComponents[listType] || EnrichedGameCard;

                    return (
                        <CardComponent
                            key={game.id ?? index}
                            game={game}
                            t={t}
                            onStatusChange={onStatusChange}
                        />
                    )}
                )}
            </Box>

            <PaginationComponent
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </>
    );
};