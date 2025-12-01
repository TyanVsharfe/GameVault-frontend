import React, { useState } from 'react';
import {Container, Row} from 'react-bootstrap';
import "../../../assets/styles/style.css"
import "../../../assets/styles/game-card.css"
import {IgdbGame} from "../../../services/igdbGamesService";
import {useTranslation} from "react-i18next";
import IgdbGameCard from "../card/IgdbGameCard";
import PaginationComponent from "../../PaginationComponent";

export interface IgdbGamesListProps {
    games: IgdbGame[];
    gamesPerPage?: number;
}

const IgdbGameList: React.FC<IgdbGamesListProps> = ({ games, gamesPerPage = 10 }) => {
    const { t } = useTranslation();

    const [currentPage, setCurrentPage] = useState<number>(1);

    const gamesWithCovers = games.filter(game => game.cover?.url != null);

    const totalPages = Math.ceil(gamesWithCovers.length / gamesPerPage);
    const indexOfLastGame = currentPage * gamesPerPage;
    const indexOfFirstGame = indexOfLastGame - gamesPerPage;
    const currentGames = gamesWithCovers.slice(indexOfFirstGame, indexOfLastGame);

    return (
        <>
            <Container className="justify-content-start align-items-center game-list">
                <Row>
                    {currentGames.map((game, index: number) => (
                        <IgdbGameCard
                            key={game.id || index}
                            game={game}
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

export default IgdbGameList;

