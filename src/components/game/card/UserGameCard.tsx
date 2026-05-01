import React, {useEffect, useRef, useState} from 'react';
import {AspectRatio, Card, CardContent, CardOverflow, Link, Stack, Tooltip, Typography} from '@mui/joy';
import RatingBadge from "../badge/RatingBadge";
import DlcBadge from "../badge/DlcBadge";
import {useTheme} from "next-themes";
import {UserGame} from "../../../types/user.game.types";
import {statusColors} from "../../../utils/Utils";

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
                    height: "auto",
                    width: "100%",
                    gap: 0,
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "0.6rem",
                }}
                variant="plain"
                className={`user-game-list-game-card user-game-list-game-card-background position-relative ${theme === 'light' ? 'bg-dark text-white' : 'text-light'}`}
            >
                <CardOverflow sx={{ flex: "0 0 auto" }}>
                    <AspectRatio ratio="3/4" className="game-card__img-wrapper">
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
                        display: "flex"
                    }}
                >
                    <CardContent
                        style={{
                            display: "flex",
                            flex: 1,
                            flexDirection: "column",
                            padding: 0,
                            margin: 0,
                            alignItems: "stretch"
                        }}
                    >
                        <Typography
                            level="title-sm"
                            sx={{
                                position: "absolute",
                                bottom: 8,
                                left: 8,
                                right: 8,
                                height: '1.25rem',

                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                zIndex: 5,

                                backgroundColor: statusColors[game.status],
                                color: "white",

                                padding: "4px 10px",
                                borderRadius: "999px",
                                fontSize: "0.85rem",
                                fontWeight: 700,
                                backdropFilter: "blur(4px)",
                                boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
                                textAlign: "center",
                                maxWidth: "calc(100% - 16px)",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                        >
                            {t(`status_${game.status.toLowerCase()}`)}
                        </Typography>
                    </CardContent>
                </CardOverflow>
            </Card>
        </Stack>
    );
};

export default UserGameCard;