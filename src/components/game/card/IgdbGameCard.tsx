import React from "react";
import {AspectRatio, Card, CardContent, Box, Chip, Divider, Link, Tooltip, Typography, CardOverflow} from "@mui/joy";
import { statusColors } from "../../../utils/Utils";
import {CategoryIGDB, getCategoryName} from "../../../utils/Enums";
import IgdbGameTypeBadge from "../badge/IgdbGameTypeBadge";
import "../../../assets/styles/game-card.css"
import {useTheme} from "next-themes";
import {IgdbGame} from "../../../types/igdb.game.types";

export interface IgdbGameCardProps {
    game: IgdbGame;
    t: (key: string) => string;
}

const IgdbGameCard: React.FC<IgdbGameCardProps> = ({ game, t }) => {
    const { theme } = useTheme();
    const coverUrl = game.cover?.url.replace("t_thumb", "t_cover_big");

    return (
        <Card
            style={{
                overflow: "hidden",
                border: "0px",
            }}

            sx={{
                width: "10rem",
                height: "15.5rem",
                display: "grid",
                gap: "0.2rem"
            }}
            className={`user-game-list-game-card user-game-list-game-card-background position-relative ${theme === 'light' ? 'bg-dark text-white' : 'text-light'}`}
        >
            <CardOverflow sx={{ flex: "0 0 auto" }}>
                <AspectRatio ratio="3/4" className="game-card__img-wrapper"
                             sx={{
                                 width: "10rem",
                             }}
                >
                    <IgdbGameTypeBadge
                        gameType={game?.game_type?.id}
                        t={t}
                    />
                    {/*<div*/}
                    {/*    className="blur-top"*/}
                    {/*    style={{*/}
                    {/*        backgroundImage: `url(${coverUrl})`*/}
                    {/*    }}*/}
                    {/*/>*/}
                    {coverUrl ? (
                        <img
                            src={coverUrl}
                            alt={game.name}
                            style={{
                                objectPosition: 'top',
                                objectFit: 'cover',
                                width: '100%',
                            }}
                        />
                    ) : (
                        <div style={{
                            textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '13.5rem'
                        }}>
                            {game.name}
                        </div>
                    )}
                </AspectRatio>
            </CardOverflow>

            <CardOverflow sx={{padding: '0 0'}}>
                <CardContent sx={{paddingTop: '0'}}>
                    <div style={{textAlign: "center", color: "white"}}>
                        {game.first_release_date
                            ? new Date(game.first_release_date * 1000).getFullYear()
                            : game.release_dates && game.release_dates[0].y}
                    </div>
                </CardContent>
            </CardOverflow>
            <Link
                overlay
                href={`/games/${game.id}`}
                underline="none"
                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}
            >
            </Link>
        </Card>
    );
};

export default IgdbGameCard;