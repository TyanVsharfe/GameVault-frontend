import "../../assets/styles/game-page.css"

import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import {Button, Stack} from "react-bootstrap";
import UserGameInfo from "./UserGameInfo";
import {getGameId} from "../../utils/GetGameId";
import {checkEntity} from "../../api/CheckEntity";
import UpdateGame from "./UpdateGame";
import {addGame} from "../../api/Game/AddGame";
import Notes from "../Notes";
import {GameProvider} from "../GameContext";

function Game() {
    const [gameData, setGameData] = useState(null);
    const [gameStatus, setGameStatus] = useState(false);
    const [id, setID] = useState(getGameId);

    useEffect(() => {
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

                const status = await checkEntity(id)

                if (status != null) {
                    setGameStatus(status);
                }

                const response = await fetch(`/api/igdb/game/${gameId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const data = await response.json();
                const keyStorage = `/game/${gameId}`;
                localStorage.setItem(keyStorage, JSON.stringify(data));
                setGameData(data[0]);

            } catch (error) {
                console.error('Error fetching game data:', error);
            }
        };

        fetchData();
    }, [gameData, id]);

    return (
        <GameProvider>
            <Stack className=".d-flex justify-content-center align-items-center" direction="horizontal" style={{paddingTop: "20px"}} gap={5}>
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
                        {gameStatus ? (
                            <UpdateGame/>
                        ) : (
                            <Button type={"button"} onClick={() => {addGame().then(r => setGameStatus(true))}}>Add game</Button>
                        )}
                    </Card.Body>
                    <Card.Footer className="text-muted">
                        {gameData?.first_release_date
                            ? new Date(gameData.first_release_date * 1000).toLocaleDateString()
                            : gameData?.release_dates && gameData.release_dates[0].y}
                    </Card.Footer>
                </Card>

                <div className={"game-info"}>
                    <h2>Game Information</h2>
                    <span>{gameData?.summary}</span>
                </div>

                {gameStatus ? (<UserGameInfo/>): <></>}
            </Stack>
            {gameStatus ? (<Notes/>) : <></>}
            {/*<Container style={{display: "flex", justifyContent: "center", textAlign: "center"}}>*/}
            {/*    <Form.Group controlId="formFile" className="mb-3" style={{width: "290px"}}>*/}
            {/*        <Form.Label>Upload screenshots</Form.Label>*/}
            {/*        <Form.Control type="file" style={{ width: "auto", maxWidth: "290px" }}/>*/}
            {/*        <Button variant="primary" type="submit">*/}
            {/*            Save*/}
            {/*        </Button>*/}
            {/*    </Form.Group>*/}
            {/*</Container>*/}
        </GameProvider>
    );
}

export default Game;
