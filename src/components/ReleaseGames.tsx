import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import {Alert, Badge} from "react-bootstrap";
import {getCategory} from "../utils/Enums";
import React from "react";

function ReleaseGames({releaseGames}) {
    const uniqueGames = new Set();
    const renderUserGames = () => {
        let gamesResultsOut = releaseGames;

        // const gameList = localStorage.getItem('game_list');
        //
        // if (gameList === null) {
        //     console.log('localStorage is empty');
        // } else {
        //     // localStorage не пуст, удаляем game_list
        //     localStorage.removeItem('game_list');
        //     console.log('game_list removed');
        // }

        console.log("Ниже вывод " + JSON.stringify(gamesResultsOut));
        console.log("Это массив? " + Array.isArray(gamesResultsOut));
        console.log("Array length " + gamesResultsOut.length);

        if (Array.isArray(gamesResultsOut)) {
            return (
                <Container className="justify-content-center align-items-center games-list">
                    {
                        gamesResultsOut.filter((record) => {
                            if (uniqueGames.has(record.game.name)) {
                                return false;
                            }
                            uniqueGames.add(record.game.name);
                            return record.game.cover?.url !== undefined;
                        }).map((game, index: number) => (
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
                        ))
                        }
                </Container>
            )
        }
        else {
            return (
                <Container style={{textAlign: "center", maxWidth: "500px"}}>
                    <Alert>Games not found</Alert>
                </Container>
            )
        }
    };

    return (
        renderUserGames()
    );
}

export default ReleaseGames;