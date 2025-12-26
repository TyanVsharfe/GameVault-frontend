import React, { useState } from 'react';
import {Container, Row} from 'react-bootstrap';
import "../../../assets/styles/style.css"
import "../../../assets/styles/game-card.css"
import {UserGame} from "../../../api/services/userGamesService";
import {statusColors} from "../../../utils/Utils";
import {useTranslation} from "react-i18next";
import UserGameCard from "../card/UserGameCard";
import PaginationComponent from "../../ui/PaginationComponent";

export interface UserGamesListProps {
    games: UserGame[];
    gamesPerPage?: number;
}

const UserGameList: React.FC<UserGamesListProps> = ({ games, gamesPerPage = 10 }) => {
    const { t } = useTranslation();

    const [currentPage, setCurrentPage] = useState<number>(1);

    const gamesWithCovers = games.filter(game => game?.coverUrl != null);

    const totalPages = Math.ceil(gamesWithCovers.length / gamesPerPage);

    return (
        <>
            <Container className="justify-content-start align-items-center game-list">
                <Row>
                    {games.map((game: UserGame, index: number) => (
                        <UserGameCard
                            key={game.game.igdbId || index}
                            game={game}
                            statusColors={statusColors}
                            t={t}
                        />
                    ))}
                </Row>
            </Container>

            <PaginationComponent
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </>
    );
};

export default UserGameList;

