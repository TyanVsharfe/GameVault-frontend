import React, { useState } from 'react';
import {Container, Col, Card, Button, Pagination, Row, Badge} from 'react-bootstrap';
import "../../assets/styles/style.css"
import "../../assets/styles/game-card.css"
import {Game, UserGame} from "../../services/userGamesService";

export interface GamesListProps {
    games: Game[];
    gamesPerPage?: number;
}

const GameList: React.FC<GamesListProps> = ({ games, gamesPerPage = 15 }) => {
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
                    {currentGames.map((game, index: number) => (
                        <Col
                            key={index}
                            xs={6} sm={4} md={3} lg={2}
                            className="mb-4 d-flex justify-content-center"
                            style={{width:'12rem'}}
                        >
                            <Card data-bs-theme='dark' style={{ width: '15rem' }} className='text-center' border='light'>
                                <Card.Img className='game__cover' variant='top' src={game.coverUrl?.replace('t_thumb', 't_cover_big') || ''} />
                                <Card.Body className='game__body'>
                                    <Card.Title className='game__title'>
                                        {game.title}
                                    </Card.Title>
                                    <Card.Text>
                                        <Container style={{padding: "2px"}}>
                                            {game.platforms && (
                                                game.platforms.map((platform) => <Badge>{platform.abbreviation?.replace(' ', '-') || ''}</Badge>)
                                            )}
                                        </Container>
                                    </Card.Text>
                                    <Button   style={{
                                        padding: '8px 16px',
                                        fontSize: '12px',
                                    }}  variant='primary' href={`/games/${game.igdbId}`}>Подробнее</Button>
                                </Card.Body>
                                <Card.Footer className="text-muted">
                                    {game.first_release_date
                                        ? new Date(game.first_release_date * 1000).toLocaleDateString()
                                        : game.release_dates && game.release_dates[0].y}
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

export default GameList;

