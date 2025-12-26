import React from "react";
import {Card, Col} from "react-bootstrap";
import RatingBadge from "../badge/RatingBadge";
import DlcBadge from "../badge/DlcBadge";
import {Box, Chip, Divider, Link, Tooltip, Typography} from "@mui/joy";
import { statusColors } from "../../../utils/Utils";
import {CategoryIGDB} from "../../../utils/Enums";
import IgdbGameTypeBadge from "../badge/IgdbGameTypeBadge";
import "../../../assets/styles/game-card.css"
import Container from "react-bootstrap/Container";
import {useTheme} from "next-themes";
import {IgdbGame} from "../../../types/igdb.game.types";

interface IgdbGameCardProps {
    game: IgdbGame;
    t: (key: string) => string;
}

const IgdbGameCard: React.FC<IgdbGameCardProps> = ({ game, t }) => {
    const { theme } = useTheme();
    const coverUrl = game.cover?.url.replace("t_thumb", "t_cover_big");

    return (
        <Col
            xs={6}
            sm={4}
            md={3}
            lg={2}
            className="mb-4 d-flex justify-content-center user-game-list-col"
        >
            <Card
                style={{
                    backgroundColor: "rgba(30, 30, 30, 0.4)",
                    overflow: "hidden",
                    border: "0px",
                }}
                className={`user-game-list-game-card position-relative ${theme === 'light' ? 'bg-dark text-white' : 'text-light'}`}
            >

                {/*<IgdbGameTypeBadge*/}
                {/*    gameType={game.game_type.id}*/}
                {/*    t={t}*/}
                {/*/>*/}

                <div className="game-card__img-wrapper">
                    <div
                        className="blur-top"
                        style={{
                            backgroundImage: `url(${coverUrl})`
                        }}
                    />
                    <Card.Img
                        variant="top"
                        src={coverUrl}
                        alt={game.name}
                        className="game-card__img"
                    />
                </div>

                <Card.Body className='game__body'>
                    <Card.Title className="user-game-list-game-card__title text-center"
                                style={{
                                    display: '-webkit-box',
                                    overflow: 'hidden',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                    >
                        {game.name}
                    </Card.Title>
                    <Box
                        sx={{
                            px: 1.5,
                            borderRadius: "1rem",
                            background: "rgba(255,255,255,0.15)",
                            border: "1px solid rgba(255,255,255,0.25)",
                            backdropFilter: "blur(10px)",
                            WebkitBackdropFilter: "blur(10px)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                            zIndex: 2,
                        }}
                    >
                        <Typography
                            level="body-md"
                            sx={{
                                color: "#fff",
                                fontWeight: 700,
                                fontSize: "0.95rem",
                                textShadow: "0 1px 2px rgba(0,0,0,0.4)",
                            }}
                        >
                            {t(`type_main_game`)}
                        </Typography>
                    </Box>
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
                    <Divider style={{margin: '0.4rem'}} component="div" role="presentation"/>
                    <Container style={{textAlign: "center"}}>
                        {game.first_release_date
                            ? new Date(game.first_release_date * 1000).toLocaleDateString()
                            : game.release_dates && game.release_dates[0].y}
                    </Container>
                </Card.Body>
            </Card>
        </Col>
    );
};

export default IgdbGameCard;