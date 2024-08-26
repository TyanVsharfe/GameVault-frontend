import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import {Alert, Badge} from "react-bootstrap";
import {categoryIGDB} from "../utils/Enums";
import {getCategory} from "../utils/GetCategory";
import {useState} from "react";

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
                        }).map((record) => (
                            <Col key={record.id} style={{paddingBottom: '20px'}}>
                                <Card data-bs-theme="dark" style={{ width: '250px', height: '550px'}}  className="text-center" border='light'>
                                    <Card.Header>
                                        <Badge bg="secondary">{getCategory(record.game.category)}</Badge>
                                    </Card.Header>
                                    <Card.Img style={{height: '50%'}} variant="top" src={record.game.cover.url?.replace('t_thumb', 't_cover_big') || ''}/>
                                    <Card.Body style={{ height: '175px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                        <Card.Title>
                                            {record.game.name}<br/>
                                        </Card.Title>
                                        <Card.Text>
                                            {record.game.platforms && (
                                                record.game.platforms.map((platform) => `${platform.abbreviation?.replace(' ', '-') || ''} `)
                                            )}
                                        </Card.Text>
                                        <Button style={{ width: '60%'}} variant="primary" href={`/game/${record.game.id}`}>Get info</Button>
                                    </Card.Body>
                                    <Card.Footer className="text-muted">
                                        {record.human}
                                    </Card.Footer>
                                </Card>
                            </Col>)
                        )}
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