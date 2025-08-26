import React, { useState } from 'react';
import {Container, Col, Card, Button, Pagination, Row, Badge} from 'react-bootstrap';
import "../../../assets/styles/style.css"
import "../../../assets/styles/game-card.css"
import {IgdbGame} from "../../../services/igdbGamesService";
import {Chip, Link, Skeleton} from "@mui/joy";
import {useTranslation} from "react-i18next";
import {PlatformBadge} from "../../PlatformBadge";
import {CategoryIGDB} from "../../../utils/Enums";

export interface IgdbGamesListProps {
    games: IgdbGame[];
    gamesPerPage?: number;
}

const IgdbGameList: React.FC<IgdbGamesListProps> = ({ games, gamesPerPage = 15 }) => {
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
                    {currentGames.filter(game => game.cover?.url != null).map((game, index: number) => (
                        <Col
                            key={index}
                            xs={6} sm={4} md={3} lg={2}
                            className="mb-4 d-flex justify-content-center"
                            style={{width:'12rem'}}
                        >
                            <Card data-bs-theme='dark' style={{ width: '15rem' }} className='user-game-list-game-card text-center' border='light'>
                                <Card.Img className='game__cover' variant='top' src={game.cover?.url?.replace('t_thumb', 't_cover_big') || ''} />
                                <Card.Body className='game__body'>
                                    <Card.Title className="user-game-list-game-card__title text-center">
                                        {game.name}
                                    </Card.Title>
                                    <Chip style={{width:'200%'}}
                                          onClick={() => ""}
                                    >
                                        {game.game_type != null ? t(CategoryIGDB[game.game_type]) : null}
                                    </Chip>
                                    <Link
                                        overlay
                                        href={`/games/${game.id}`}
                                        underline="none"
                                        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}
                                    >
                                    </Link>

                                    {/*<Button*/}
                                    {/*    style={{width: "80%"}}*/}
                                    {/*    variant="primary"*/}
                                    {/*    size="sm"*/}
                                    {/*    href={`/games/${game.id}`}*/}
                                    {/*    className="mt-2"*/}
                                    {/*>*/}
                                    {/*    {t('read_more')}*/}
                                    {/*</Button>*/}
                                </Card.Body>
                                <Card.Footer style={{flexDirection: 'column', height: '2.1rem'}} className="text-muted">
                                    <span>
                                        {game.first_release_date
                                            ? new Date(game.first_release_date * 1000).toLocaleDateString()
                                            : game.release_dates && game.release_dates[0].y}
                                    </span>
                                </Card.Footer>
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

export default IgdbGameList;

