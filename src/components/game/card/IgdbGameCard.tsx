import React from "react";
import {Card, Col} from "react-bootstrap";
import RatingBadge from "../badge/RatingBadge";
import DlcBadge from "../badge/DlcBadge";
import {Chip, Divider, Link, Tooltip} from "@mui/joy";
import { statusColors } from "../../../utils/Utils";
import {IgdbGame} from "../../../services/igdbGamesService";
import {CategoryIGDB} from "../../../utils/Enums";
import IgdbGameTypeBadge from "../badge/IgdbGameTypeBadge";
import "../../../assets/styles/game-card.css"
import Container from "react-bootstrap/Container";
import {useTheme} from "next-themes";

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

                <IgdbGameTypeBadge
                    gameType={game.game_type.id}
                    t={t}
                />

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
                    <Card.Title className="user-game-list-game-card__title text-center">
                        {game.name}
                    </Card.Title>
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