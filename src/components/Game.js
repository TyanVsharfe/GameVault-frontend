import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import {Stack} from "react-bootstrap";
import "../assets/styles/game-page.css"
import CheckGameStatus from "./CheckGameStatus";

function Game() {
    const [gameData, setGameData] = useState(null);
    const [id, setID] = useState(window.location.pathname.split('/')[window.location.pathname.split('/').length - 1]);

    useEffect(() => {
        const getGameId = () => {
            let currentPath = window.location.pathname;
            let pathParts = currentPath.split('/');
            return pathParts[pathParts.length - 1];
        };

        const fetchData = async () => {
            try {
                const gameId = getGameId();
                setID(gameId);

                // const result = await checkEntity(gameId)
                // if (result) {
                //     console.log('Game in DB');
                // }
                // else {
                //     console.log('Game not in DB');
                // }

                const response = await fetch(`/api/igdb/game/${gameId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                const keyStorage = `/game/${gameId}`;
                localStorage.setItem(keyStorage, JSON.stringify(data));
                setGameData(data[0]);

            } catch (error) {
                console.error('Error fetching game data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="game" id="main">
            <Stack className=".d-flex justify-content-center align-items-center" direction="horizontal">
                <Card data-bs-theme="dark" style={{width: '15rem'}} className="text-center" border="light">
                    <Card.Img variant="top" src={gameData?.cover?.url?.replace('t_thumb', 't_cover_big') || ''}/>
                    <Card.Body>
                        <Card.Title>{gameData?.name}</Card.Title>
                        <Card.Text>
                            <Container>
                                {gameData?.platforms && (
                                    gameData.platforms.map((platform) => `${platform.abbreviation?.replace(' ', '-') || ''} `)
                                )}
                            </Container>
                        </Card.Text>
                        <CheckGameStatus id={id}/>
                    </Card.Body>
                    <Card.Footer className="text-muted">
                        {gameData?.first_release_date
                            ? new Date(gameData.first_release_date * 1000).toLocaleDateString()
                            : gameData?.release_dates && gameData.release_dates[0].y}
                    </Card.Footer>
                </Card>
            </Stack>
            <div className={"game-info"}>
                <h2>Game Information</h2>
                <span>{gameData?.summary}</span>
            </div>
        </div>
    );
}

export default Game;
