import React from "react";
import {AspectRatio, Card, CardContent, CardOverflow, IconButton, Link, Stack, Tooltip, Typography} from "@mui/joy";
import RatingBadge from "../badge/RatingBadge";
import DlcBadge from "../badge/DlcBadge";
import {Box, Chip, Divider} from "@mui/joy";
import { statusColors } from "../../../utils/Utils";
import {CategoryIGDB, getCategoryName} from "../../../utils/Enums";
import IgdbGameTypeBadge from "../badge/IgdbGameTypeBadge";
import "../../../assets/styles/game-card.css"
import {useTheme} from "next-themes";
import {IgdbGame} from "../../../types/igdb.game.types";
import {userGameListService} from "../../../api/services/userGameListService";
import RemoveIcon from "@mui/icons-material/Remove";
import {PlatformBadge} from "../badge/PlatformBadge";

interface IgdbGameCardProps {
    game: IgdbGame;
    t: (key: string) => string;
}

const IgdbGameCardLarge: React.FC<IgdbGameCardProps> = ({ game, t }) => {
    const { theme } = useTheme();
    const coverUrl = game.cover?.url.replace("t_thumb", "t_cover_big");

    return (
        <Card
            style={{
                backgroundColor: "rgba(30, 30, 30, 0.4)",
                overflow: "hidden",
                border: "0px",
            }}
            sx={{
                width: "20.5rem",
                height: "14rem",
                display: "grid",
                gap: "0.2rem"
            }}
            className={`user-game-list-game-card position-relative ${theme === 'light' ? 'bg-dark text-white' : 'text-light'}`}
        >

            {/*<IgdbGameTypeBadge*/}
            {/*    gameType={game.game_type.id}*/}
            {/*    t={t}*/}
            {/*/>*/}

            <div style={{display: "flex", flexDirection: "row", margin: "auto"}}>
                <AspectRatio ratio="3/4" className="game-card__img-wrapper"
                             sx={{
                                 width: "7rem",
                             }}
                >
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
                            className="game-card__img"
                            style={{objectPosition: 'top'}}
                        />
                    ) : (
                        <div>
                            No Cover
                        </div>
                    )}
                    <Link
                        overlay
                        href={`/games/${game.id}`}
                        underline="none"
                        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}
                    >
                    </Link>
                </AspectRatio>
                <div style={{width: "12.5rem", display: "flex", justifyContent: "flex-start", flexDirection: "column"}}>
                    <div className="text-center"
                         style={{
                             display: '-webkit-box',
                             overflow: 'hidden',
                             WebkitLineClamp: 2,
                             WebkitBoxOrient: 'vertical',
                             justifyContent: 'center',
                             alignItems: 'center',
                             margin: '0 0.4rem',
                             height: "3rem",
                         }}
                    >
                        {game.name}
                    </div>
                    <Divider style={{margin: '0.4rem'}} component="div" role="presentation"/>
                    <div style={{margin: "0 1rem", height: "5rem", textAlign: "center", padding: "0 0.5rem"}}>
                        {game?.platforms?.slice(0, 4).map((platform, index) =>
                            PlatformBadge(platform.abbreviation?.replace(' ', '-'), index, true))
                        }
                        {game?.platforms?.length > 4 && (
                            <Chip style={{marginBottom: '0.4rem', marginRight: '0.3rem', fontSize: '0.8rem'}}>
                                +{game.platforms.length - 4}
                            </Chip>
                        )}
                    </div>
                    <Divider style={{margin: '0.4rem'}} component="div" role="presentation"/>
                </div>
            </div>

            <CardContent style={{textAlign: "center", display: 'flex', flexDirection: 'row'}}>
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <div style={{width: '7rem', alignItems: 'center', display: 'flex', justifyContent: 'center'}}>
                        {game.first_release_date
                            ? new Date(game.first_release_date * 1000).getFullYear()
                            : game.release_dates && game.release_dates[0].y}
                    </div>
                    <div style={{width: '12rem', height: "100%", textAlign: "center"}}>
                        <Box
                            sx={{
                                // position: "absolute",
                                // top: 8,
                                // left: 8,
                                px: 1.5,
                                mx: '1rem',
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
                                {t(`${getCategoryName(game.game_type.id)}`)}
                            </Typography>
                        </Box>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default IgdbGameCardLarge;