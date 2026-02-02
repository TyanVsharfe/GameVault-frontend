import React, { useState } from 'react';
import "../../../assets/styles/style.css"
import "../../../assets/styles/game-card.css"
import {statusColors} from "../../../utils/Utils";
import {useTranslation} from "react-i18next";
import UserGameCard from "../card/UserGameCard";
import PaginationComponent from "../../ui/PaginationComponent";
import {UserGame} from "../../../types/user.game.types";
import UserGameCardSmall, {UserGameCardProps} from '../card/UserGameCardSmall';
import {Box, Grid, Stack} from '@mui/joy';
import IgdbGameCard, {IgdbGameCardProps} from "../card/IgdbGameCard";
import IgdbGameCardLarge from "../card/IgdbGameCardLarge";
import {IgdbGame} from "../../../types/igdb.game.types";

export interface IgdbGamesListProps {
    games: IgdbGame[];
    gamesPerPage?: number;
    listType: number;
}

type CardComponents = Record<number, React.FC<IgdbGameCardProps>>;

const cardComponents: CardComponents = {
    0: IgdbGameCard,
    1: IgdbGameCardLarge,
};

const IgdbGameEnhancedList: React.FC<IgdbGamesListProps> = ({ games, listType, gamesPerPage = 10 }) => {
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
                {games.map((game: IgdbGame, index: number) => {
                    const CardComponent = cardComponents[listType] || IgdbGameCard;

                    return (
                        <CardComponent
                            key={game.id ?? index}
                            game={game}
                            statusColors={statusColors}
                            t={t}
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

export default IgdbGameEnhancedList;

