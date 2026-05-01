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

export interface UserGamesListProps {
    games: UserGame[];
    gamesPerPage?: number;
    listType: number;
}

type CardComponents = Record<number, React.FC<UserGameCardProps>>;

const cardComponents: CardComponents = {
    0: UserGameCard,
    1: UserGameCardSmall,
};

const UserGameList: React.FC<UserGamesListProps> = ({ games, listType, gamesPerPage = 10 }) => {
    const { t } = useTranslation();

    const [currentPage, setCurrentPage] = useState<number>(1);

    const gamesWithCovers = games.filter(game => game?.customCoverUrl != null);

    const totalPages = Math.ceil(gamesWithCovers.length / gamesPerPage);

    return (
        <>
            <Box
                 sx={{
                     display: 'grid',
                     gridTemplateColumns: {
                         xs: listType == 0
                             ? 'repeat(auto-fill, minmax(12rem, 1fr))'
                             : 'repeat(auto-fill, minmax(6rem, 1fr))',
                         sm: listType == 0
                             ? 'repeat(auto-fill, minmax(11.25rem, 1fr))'
                             : 'repeat(auto-fill, minmax(7.5rem, 1fr))',
                         md: listType == 0
                             ? 'repeat(auto-fill, minmax(11.5rem, 1fr))'
                             : 'repeat(auto-fill, minmax(7.5rem, 1fr))',
                     },
                     width: '100%',
                     mx: 'auto',
                     pb: '0.75rem',
                     gap: { xs: 1, sm: 1.5, md: 2 },
                     justifyItems: 'center'
                 }}
            >
                {games.map((game: UserGame, index: number) => {
                    const CardComponent = cardComponents[listType] || UserGameCard;

                    return (
                        <CardComponent
                            key={game.id}
                            game={game}
                            statusColors={statusColors}
                            t={t}
                        />
                    )}
                )}
            </Box>

            {/*<PaginationComponent*/}
            {/*    currentPage={currentPage}*/}
            {/*    totalPages={totalPages}*/}
            {/*    onPageChange={setCurrentPage}*/}
            {/*/>*/}
        </>
    );
};

export default UserGameList;

