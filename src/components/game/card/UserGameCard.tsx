import React, {useEffect, useRef, useState} from 'react';
import {AspectRatio, Card, CardContent, CardOverflow, Link, Stack, Tooltip, Typography} from '@mui/joy';
import RatingBadge from "../badge/RatingBadge";
import DlcBadge from "../badge/DlcBadge";
import {useTheme} from "next-themes";
import {UserGame} from "../../../types/user.game.types";

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

    function useOverflow<T extends HTMLElement>() {
        const ref = useRef<T>(null);
        const [isOverflow, setIsOverflow] = useState(false);

        useEffect(() => {
            const el = ref.current;
            if (!el) return;

            const check = () => {
                setIsOverflow(el.scrollHeight > el.clientHeight);
            };

            check();

            const ro = new ResizeObserver(check);
            ro.observe(el);

            return () => ro.disconnect();
        }, []);

        return { ref, isOverflow };
    }

    const { ref, isOverflow } = useOverflow<HTMLParagraphElement>();

    return (
        <Stack
            direction="column"
            sx={{
                justifyContent: "center",
                alignItems: "center",
                paddingBottom: "0"
            }}
            className="mb-4 d-flex justify-content-center user-game-list-col"
        >
            <Card
                style={{
                    overflow: "hidden",
                    border: "0px",
                    height: "15.75rem",
                    width: "11rem",
                    gap: "0",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "0.6rem",
                }}
                variant="plain"
                className={`user-game-list-game-card user-game-list-game-card-background position-relative ${theme === 'light' ? 'bg-dark text-white' : 'text-light'}`}
            >
                <CardOverflow sx={{ flex: "0 0 auto" }}>
                    <AspectRatio ratio="3/3.9" className="game-card__img-wrapper">
                        {hasRating && <RatingBadge rating={game.userRating} />}
                        {isDlcOrExpansion && <DlcBadge />}

                        {(isDlcOrExpansion || hasRating) && (
                            <div
                                className="blur-top"
                                style={{
                                    backgroundImage: `url(${coverUrl})`,
                                    objectPosition: 'top'
                                }}
                            />
                        )}
                        <img
                            src={coverUrl}
                            alt={game.game.title}
                            // className="game-card__img"
                            style={{
                                objectFit: 'cover',
                                width: '100%',
                            }}
                        />
                    </AspectRatio>

                    <Link
                        overlay
                        href={`/games/${game.game.igdbId}`}
                        underline="none"
                        sx={{display: 'flex', flexDirection: 'column', alignItems: 'start'}}
                    />
                </CardOverflow>

                <CardOverflow
                    sx={{
                        flex: 1,
                        padding: 0,
                        display: "flex",
                    }}
                >
                    <CardContent
                        style={{
                            display: "flex",
                            flex: 1,
                            flexDirection: "column",
                            padding: 0,
                            margin: "0",
                            alignItems: "stretch"
                        }}
                    >
                        {/*<div*/}
                        {/*    style={{*/}
                        {/*        height: "3rem",*/}
                        {/*        marginBottom: "0.5vh",*/}
                        {/*        width: "100%",*/}
                        {/*        display: "flex",*/}
                        {/*        justifyContent: "center",*/}
                        {/*        textAlign: "center",*/}
                        {/*        alignItems: "center"*/}
                        {/*    }}*/}
                        {/*>*/}
                        {/*    <Tooltip*/}
                        {/*        ref={ref}*/}
                        {/*        title={game.game.title} arrow*/}
                        {/*        variant="plain" placement="top"*/}
                        {/*        disableHoverListener={!isOverflow}*/}
                        {/*    >*/}
                        {/*        <Typography*/}
                        {/*            textColor="common.white"*/}
                        {/*            level="body-md"*/}
                        {/*            sx={{*/}
                        {/*                width: '8.5rem',*/}
                        {/*                overflow: 'hidden',*/}
                        {/*                display: '-webkit-box',*/}
                        {/*                WebkitLineClamp: 2,*/}
                        {/*                WebkitBoxOrient: 'vertical',*/}
                        {/*                cursor: isOverflow ? 'pointer' : 'default',*/}
                        {/*            }}*/}
                        {/*        >*/}
                        {/*            {game.game.title}*/}
                        {/*        </Typography>*/}
                        {/*    </Tooltip>*/}
                        {/*</div>*/}

                        {(game.status && game.status !== 'None') && (
                            <div
                                style={{
                                    color: "white",
                                    backgroundColor: statusColors[game.status],
                                    display: "flex",
                                    justifyContent: "center",
                                    border: "1px solid rgba(255,255,255,0.05)",
                                    boxShadow: "0 0 6px rgba(0,0,0,0.3)",
                                    backdropFilter: "blur(4px)",
                                    width: "100%",
                                    alignItems: "center",
                                    flex: 1,
                                    // paddingBottom: '10%',
                                    // borderRadius: "1rem",
                                    fontSize: "0.9rem",
                                }}
                                className="text-uppercase"
                            >
                                {t(`status_${game.status.toLowerCase()}`)}
                            </div>
                        )}
                        <Link
                            overlay
                            href={`/games/${game.game.igdbId}`}
                            underline="none"
                            sx={{display: 'flex', flexDirection: 'column', alignItems: 'start'}}
                        />
                    </CardContent>
                </CardOverflow>
            </Card>
        </Stack>
    );
};

export default UserGameCard;