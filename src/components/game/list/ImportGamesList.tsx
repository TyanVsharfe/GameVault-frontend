import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import {Alert} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import React, {useState} from "react";
import {ImportedSteamGame} from "../../../services/steamGamesService";
import "../../../assets/styles/style.css"
import "../../../assets/styles/game-card.css"
import {useTranslation} from "react-i18next";
import {Chip, Link} from "@mui/joy";
import {CategoryIGDB} from "../../../utils/Enums";
import Tooltip from "@mui/joy/Tooltip";

interface ImportGamesListProps {
    importGames: ImportedSteamGame[];
    onSwitchChange: (event: number[]) => void;
}

function ImportGamesList({importGames, onSwitchChange}: ImportGamesListProps) {
    const { t } = useTranslation();

    const [gameStates, setGameStates] = useState(
        Array.isArray(importGames) ? importGames.map(game => ({ ...game, isChecked: false })) : []
    );

    const handleSwitchChange = (gameId) => {
        const updatedStates = gameStates.map(game =>
            game.id === gameId ? { ...game, isChecked: !game.isChecked } : game
        );
        setGameStates(updatedStates);
        onSwitchChange(updatedStates.filter(game => game.isChecked).map(game => game.id));
    };

    const getCheckedGameIds = () => {
        return gameStates.filter(game => game.isChecked).map(game => game.id);
    };

    const renderUserGames = () => {
        console.log(importGames);
        console.log("Array " + Array.isArray(importGames));

        if (Array.isArray(importGames)) {
            return (
                <Container className="justify-content-center align-items-center import-games-list">
                    {
                        importGames.map((game) => (
                            <Col key={game.id} style={{paddingBottom: '20px'}}>
                                <Card data-bs-theme="dark" style={{width: '9.5rem', height: '21rem'}} className="text-center"
                                      border='secondary'>
                                    <Card.Img variant="top"
                                              className="game-card__img"
                                              src={game.cover?.replace('t_thumb', 't_cover_big') || ''}/>
                                    <Card.Body style={{
                                        height: '10rem',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        // justifyContent: 'center',
                                    }}>
                                        {/*<Card.Title style={{fontSize: '105%', height: "3rem", width: "7rem"}}>*/}
                                        {/*    <OverlayTrigger*/}
                                        {/*        placement="bottom"*/}
                                        {/*        overlay={<Tooltip id={`tooltip-${game.id}`}>{game.name}</Tooltip>}*/}
                                        {/*        container={document.body}*/}
                                        {/*    >*/}
                                        {/*        <span style={{ cursor: 'pointer' }} className="import-game-list__title">{game.name}</span>*/}
                                        {/*    </OverlayTrigger>*/}
                                        {/*</Card.Title>*/}

                                        <Tooltip title={game.name} arrow size="lg" variant="plain" placement="top">
                                            <Card.Title className="user-game-list-game-card__title text-center"
                                                        style={{ cursor: 'pointer' }}>
                                                <a style={{textDecoration: 'none', color: 'white'}} href={`/games/${game.id}`}>
                                                    {game.name}
                                                </a>
                                            </Card.Title>
                                        </Tooltip>
                                        {/*<Card.Text style={{fontSize: '95%'}}>*/}
                                        {/*    <Container>*/}
                                        {/*        {game.platforms && (*/}
                                        {/*            game.platforms.map((platform) => `${platform.abbreviation?.replace(' ', '-') || ''} `)*/}
                                        {/*        )}*/}
                                        {/*    </Container>*/}
                                        {/*</Card.Text>*/}
                                        {/*<Button style={{width: '100%', height: '2rem', fontSize: '75%'}} variant="primary"*/}
                                        {/*        href={`/game/${game.id}`}>*/}
                                        {/*    {t('read_more')}*/}
                                        {/*</Button>*/}
                                        <br/>
                                        <Form.Check
                                            style={{fontSize: '1.1rem'}}
                                            type="switch"
                                            label={t('add')}
                                            checked={game.isChecked}
                                            onChange={() => handleSwitchChange(game.id)}
                                        />
                                    </Card.Body>
                                    {/*<Card.Footer className="text-muted">*/}
                                    {/*    {game.first_release_date*/}
                                    {/*        ? new Date(game.first_release_date * 1000).toLocaleDateString()*/}
                                    {/*        : game.release_dates && game.release_dates[0].y}*/}
                                    {/*</Card.Footer>*/}
                                </Card>
                            </Col>)
                        )
                    }
                    {/*<div>*/}
                    {/*    <h3>Checked Game IDs:</h3>*/}
                    {/*    <ul>*/}
                    {/*        {getCheckedGameIds().map(id => (*/}
                    {/*            <li key={id}>{id}</li>*/}
                    {/*        ))}*/}
                    {/*    </ul>*/}
                    {/*</div>*/}
                </Container>
            )
        } else {
            return (
                <Container style={{textAlign: "center", maxWidth: "30rem", padding: "2rem"}}>
                    <Alert>Games not found</Alert>
                </Container>
            )
        }
    };

    return (
        renderUserGames()
    );
}

export default ImportGamesList;