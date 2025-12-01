import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import {Alert, Pagination, Row} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import React, {useState} from "react";
import {ImportedSteamGame} from "../../../services/steamGamesService";
import "../../../assets/styles/style.css"
import "../../../assets/styles/game-card.css"
import {useTranslation} from "react-i18next";
import {CategoryIGDB} from "../../../utils/Enums";
import Tooltip from "@mui/joy/Tooltip";
import {Checkbox, Chip, Link} from "@mui/joy";
import PaginationComponent from "../../PaginationComponent";

interface ImportGamesListProps {
    importGames: ImportedSteamGame[];
    onSwitchChange: (event: number[]) => void;
    gamesPerPage?: number;
}

function ImportGamesList({importGames, onSwitchChange, gamesPerPage = 15}: ImportGamesListProps) {
    const { t } = useTranslation();

    const [gameStates, setGameStates] = useState(
        Array.isArray(importGames) ? importGames.map(game => ({ ...game, isChecked: game.isChecked ?? false })) : []
    );

    const handleSwitchChange = (gameId) => {
        const updatedStates = gameStates.map(game =>
            game.id === gameId ? { ...game, isChecked: !game.isChecked } : game
        );
        setGameStates(updatedStates);
        onSwitchChange(updatedStates.filter(game => game.isChecked).map(game => game.id));
    };

    const [currentPage, setCurrentPage] = useState<number>(1);

    const totalPages = Math.ceil(gameStates.length / gamesPerPage);

    const indexOfLastGame = currentPage * gamesPerPage;
    const indexOfFirstGame = indexOfLastGame - gamesPerPage;
    const currentGames = gameStates.slice(indexOfFirstGame, indexOfLastGame);

    const renderUserGames = () => {
        console.log(importGames);
        console.log("Array " + Array.isArray(importGames));

        if (Array.isArray(importGames)) {
            return (
                <Container className="justify-content-center align-items-center import-games-list">
                   <Row style={{justifyContent: 'center'}}>
                       {currentGames.filter(game => game.cover != null).map((game, index: number) => (
                           <Col
                               key={index}
                               xs={6} sm={4} md={3} lg={2}
                               className="mb-4 d-flex justify-content-center"
                               style={{width:'12rem'}}
                           >
                               <Card data-bs-theme='dark' style={{ width: '9.5rem', height: '19rem' }} className='user-game-list-game-card text-center' border='light'>
                                   <Card.Img className='game__cover' variant='top' src={game.cover?.replace('t_thumb', 't_cover_big') || ''} />
                                   <Card.Body className='game__body'>
                                       <Card.Title className="user-game-list-game-card__title text-center">
                                           <Link
                                               href={`/games/${game.id}`}
                                               style={{
                                               textDecoration: 'none',
                                               color: 'inherit',
                                               cursor: 'pointer'}}
                                           >
                                               {game.name}
                                           </Link>
                                       </Card.Title>
                                       {/*<Chip style={{width:'200%'}}*/}
                                       {/*      onClick={() => ""}*/}
                                       {/*>*/}
                                       {/*    {game.game_type != null ? t(CategoryIGDB[game.game_type.id]) : null}*/}
                                       {/*</Chip>*/}

                                       <Chip
                                           sx={{
                                               width: '100px', // или любая нужная ширина
                                               minWidth: '100px',
                                               justifyContent: 'center'
                                           }}
                                       >
                                           <Checkbox
                                               variant="outlined"
                                               disableIcon
                                               overlay
                                               label={game.isChecked ? t('selected') : t('select')}
                                               checked={game.isChecked}
                                               onChange={() => handleSwitchChange(game.id)}
                                           />
                                       </Chip>
                               {/*        <Link
                                           overlay
                                           href={`/games/${game.id}`}
                                           underline="none"
                                           sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}
                                       >
                                       </Link>*/}
                                   </Card.Body>
                               </Card>
                           </Col>
                       ))}

                       <PaginationComponent
                           currentPage={currentPage}
                           totalPages={totalPages}
                           onPageChange={setCurrentPage}
                       />
                   </Row>
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