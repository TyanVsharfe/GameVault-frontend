import React, { useState } from 'react';
import {Container, Row} from 'react-bootstrap';
import "../../../assets/styles/style.css"
import "../../../assets/styles/game-card.css"
import {UserGame} from "../../../services/userGamesService";
import {statusColors} from "../../../utils/Utils";
import {useTranslation} from "react-i18next";
import UserGameCard from "../card/UserGameCard";
import PaginationComponent from "../../PaginationComponent";

export interface UserGamesListProps {
    games: UserGame[];
}

const UserGameList: React.FC<UserGamesListProps> = ({ games }) => {
    const { t } = useTranslation();

    return (
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
    );
};

export default UserGameList;

