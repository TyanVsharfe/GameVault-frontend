import React, { useState } from 'react';
import {Container, Col, Card, Pagination, Row} from 'react-bootstrap';
import "../../../assets/styles/style.css"
import "../../../assets/styles/game-card.css"
import {UserGame} from "../../../services/userGamesService";
import {getRatingColor, statusColors} from "../../../utils/Utils";
import {useTranslation} from "react-i18next";
import Tooltip from '@mui/joy/Tooltip';
import { Button, Link } from '@mui/joy';

export interface UserGamesListProps {
    games: UserGame[];
    gamesPerPage?: number;
}

const UserGameList: React.FC<UserGamesListProps> = ({ games, gamesPerPage = 15 }) => {
    const { t } = useTranslation();

    const [currentPage, setCurrentPage] = useState<number>(1);

    const totalPages = Math.ceil(games.length / gamesPerPage);

    const indexOfLastGame = currentPage * gamesPerPage;
    const indexOfFirstGame = indexOfLastGame - gamesPerPage;
    const currentGames = games.slice(indexOfFirstGame, indexOfLastGame);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const renderPaginationItems = () => {
        let items = [];

        items.push(
            <Pagination.Prev
                key="prev"
                onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
            />
        );

        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages && startPage > 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        if (startPage > 1) {
            items.push(
                <Pagination.Item key={1} onClick={() => handlePageChange(1)}>
                    1
                </Pagination.Item>
            );
            if (startPage > 2) {
                items.push(<Pagination.Ellipsis key="ellipsis-start" />);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            items.push(
                <Pagination.Item
                    key={i}
                    active={i === currentPage}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </Pagination.Item>
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                items.push(<Pagination.Ellipsis key="ellipsis-end" />);
            }
            items.push(
                <Pagination.Item
                    key={totalPages}
                    onClick={() => handlePageChange(totalPages)}
                >
                    {totalPages}
                </Pagination.Item>
            );
        }

        items.push(
            <Pagination.Next
                key="next"
                onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            />
        );

        return items;
    };

    return (
        <>
            <Container className="justify-content-start align-items-center game-list">
                <Row>
                    {currentGames.map((game: UserGame, index: number) => (
                        <Col
                            key={index}
                            xs={6} sm={4} md={3} lg={2}
                            className="mb-4 d-flex justify-content-center"
                            style={{width:'12rem'}}
                        >
                            <Card className="user-game-list-game-card position-relative text-white bg-dark">
                                {game.userRating != null ? (
                                    <div className="user-game-list__rating-badge"
                                         style={{backgroundColor: getRatingColor(game.userRating)}}>
                                    {game.userRating ? Math.round(game.userRating) : null}</div>) : (<></>)}
                                <Card.Img
                                    variant="top"
                                    className="game-card__img"
                                    src={game.game.coverUrl.replace('t_thumb', 't_cover_big')}
                                    alt={game.game.title}
                                />
                                <Card.Body className="d-flex flex-column align-items-center justify-content-between">

                                    <Tooltip title={game.game.title} arrow variant="plain" placement="top">
                                        <Card.Title className="user-game-list-game-card__title text-center">
                                            {game.game.title}
                                        </Card.Title>
                                    </Tooltip>

                                    {(game.status && game.status !== 'None') ? (
                                        <div style={{backgroundColor: statusColors[game.status], display: "flex", justifyContent: "center",
                                             width:"80%", borderRadius: "1rem", fontSize: "0.9rem"}} className="mb-2 text-uppercase">
                                            {t(`status_${game.status.toLowerCase()}`)}
                                        </div>
                                    ) : (
                                        <div style={{backgroundColor: statusColors[game.status], display: "flex", justifyContent: "center",
                                            width:"80%", borderRadius: "1rem", fontSize: "0.9rem"}} className="mb-2 text-uppercase">{t('new_badge')}</div>
                                    )}

                                    <Link
                                        overlay
                                        href={`/games/${game.game.igdbId}`}
                                        underline="none"
                                        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}
                                    >
                                    </Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>

            {totalPages > 1 && (
                <Container className="d-flex justify-content-center mt-4 mb-5">
                    <Pagination>{renderPaginationItems()}</Pagination>
                </Container>
            )}
        </>
    );
};

export default UserGameList;

