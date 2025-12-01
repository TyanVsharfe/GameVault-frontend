import React from 'react';
import { Card, Col } from 'react-bootstrap';
import { Link, Tooltip } from '@mui/joy';
import RatingBadge from "../badge/RatingBadge";
import DlcBadge from "../badge/DlcBadge";
import {UserGame} from "../../../services/userGamesService";
import {useTheme} from "next-themes";

interface UserGameCardProps {
    game: UserGame;
    statusColors: Record<string, string>;
    t: (key: string) => string;
}

const UserGameCard: React.FC<UserGameCardProps> = ({ game, statusColors, t }) => {
    const { theme } = useTheme();
    const isDlcOrExpansion = ["DLC", "EXPANSION"].includes(game?.game?.category);
    const hasRating = game.userRating != null;
    const coverUrl = game.game.coverUrl.replace("t_thumb", "t_cover_big");

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
                className={`user-game-list-game-card user-game-list-game-card-background position-relative ${theme === 'light' ? 'bg-dark text-white' : 'text-light'}`}
            >
                {hasRating && <RatingBadge rating={game.userRating} />}

                {isDlcOrExpansion && <DlcBadge />}

                <div className="game-card__img-wrapper">
                    {(isDlcOrExpansion || hasRating) && (
                        <div
                            className="blur-top"
                            style={{
                                backgroundImage: `url(${coverUrl})`
                            }}
                        />
                    )}
                    <Card.Img
                        variant="top"
                        src={coverUrl}
                        alt={game.game.title}
                        className="game-card__img"
                    />
                    {hasRating && <RatingBadge rating={game.userRating} />}
                </div>

                <Card.Body className="d-flex flex-column align-items-center justify-content-between">
                    <Tooltip title={game.game.title} arrow variant="plain" placement="top">
                        <Card.Title className="user-game-list-game-card__title text-center">
                            {game.game.title}
                        </Card.Title>
                    </Tooltip>

                    {(game.status && game.status !== 'None') ? (
                        <div
                            style={{
                                backgroundColor: statusColors[game.status],
                                display: "flex",
                                justifyContent: "center",
                                border: "1px solid rgba(255,255,255,0.05)",
                                boxShadow: "0 0 6px rgba(0,0,0,0.3)",
                                backdropFilter: "blur(4px)",
                                width: "95%",
                                borderRadius: "1rem",
                                fontSize: "0.9rem"
                            }}
                            className="mb-2 text-uppercase"
                        >
                            {t(`status_${game.status.toLowerCase()}`)}
                        </div>
                    ) : (
                        <div
                            style={{
                                backgroundColor: statusColors[game.status],
                                display: "flex",
                                justifyContent: "center",
                                border: "1px solid rgba(255,255,255,0.05)",
                                boxShadow: "0 0 6px rgba(0,0,0,0.3)",
                                backdropFilter: "blur(4px)",
                                width: "95%",
                                borderRadius: "1rem",
                                fontSize: "0.9rem"
                            }}
                            className="mb-2 text-uppercase"
                        >
                            {t('new_badge')}
                        </div>
                    )}

                    <Link
                        overlay
                        href={`/games/${game.game.igdbId}`}
                        underline="none"
                        sx={{display: 'flex', flexDirection: 'column', alignItems: 'start'}}
                    />
                </Card.Body>
            </Card>
        </Col>
    );
};

export default UserGameCard;