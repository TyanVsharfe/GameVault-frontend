import React, {useEffect, useRef, useState} from 'react';
import {AspectRatio, Box, Card, CardContent, CardOverflow, Link, Stack, Tooltip, Typography} from '@mui/joy';
import RatingBadge from "../badge/RatingBadge";
import DlcBadge from "../badge/DlcBadge";
import {useTheme} from "next-themes";
import {UserGame} from "../../../types/user.game.types";
import {statusColors} from "../../../utils/Utils";

export interface UserGameCardProps {
    game: UserGame;
    statusColors: Record<string, string>;
    t: (key: string) => string;
}

const UserGameCardSmall: React.FC<UserGameCardProps> = ({game, statusColors, t}) => {
    const {theme} = useTheme();
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

        return {ref, isOverflow};
    }

    const {ref, isOverflow} = useOverflow<HTMLParagraphElement>();

    return (
        <Card
            style={{
                overflow: "hidden",
                border: "0px",
                height: "auto",
                width: "100%",
                gap: "0",
                display: "flex",
                flexDirection: "column",
                borderRadius: "0.6rem",
            }}
            variant="plain"
            className={`user-game-list-game-card user-game-list-game-card-background position-relative ${theme === 'light' ? 'bg-dark text-white' : 'text-light'}`}
        >
            <CardOverflow sx={{flex: "0 0 auto"}}>
                <AspectRatio ratio="3/4" className="game-card__img-wrapper">
                    {hasRating && <RatingBadge rating={game.userRating} size="small"/>}
                    {isDlcOrExpansion && <DlcBadge size="small"/>}

                    {(isDlcOrExpansion || hasRating) && (
                        <div
                            className="blur-top"
                            style={{
                                backgroundImage: `url(${coverUrl})`,
                                objectPosition: 'top',

                                position: 'absolute',
                                top: '-8px',
                                left: '-8px',
                                width: 'calc(100% + 16px)',
                                height: '40px',
                                backgroundSize: 'cover',
                                backgroundPosition: 'top',
                                filter: 'blur(8px)',
                                opacity: '0.6',
                                pointerEvents: 'none',
                                zIndex: '1',
                                backgroundColor: 'rgba(0,0,0,0.45)',
                                backgroundBlendMode: 'darken',
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

                    <Box
                        className="status-bar"
                        sx={{
                            position: "absolute",
                            bottom: 0,
                            width: "100%",
                            height: "0.65rem",
                            backgroundColor: statusColors[game.status],
                            opacity: 1,
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
                        zIndex: 0,
                        flex: 1,
                        flexDirection: "column",
                        padding: 0,
                        margin: "0",
                        alignItems: "stretch",
                        backgroundColor: statusColors[game.status]
                    }}
                >

                </CardContent>
            </CardOverflow>
        </Card>
    );
};

export default UserGameCardSmall;