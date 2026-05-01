import React from "react";
import {AspectRatio, Card, CardContent, CardOverflow, IconButton, Link, Stack, Tooltip, Typography} from "@mui/joy";
import RatingBadge from "../badge/RatingBadge";
import DlcBadge from "../badge/DlcBadge";
import {Box, Chip, Divider} from "@mui/joy";
import {statusColors, statusColorsHard} from "../../../utils/Utils";
import {CategoryIGDB, getCategoryName} from "../../../utils/Enums";
import IgdbGameTypeBadge from "../badge/IgdbGameTypeBadge";
import "../../../assets/styles/game-card.css"
import {useTheme} from "next-themes";
import {IgdbGame} from "../../../types/igdb.game.types";
import {userGameListService} from "../../../api/services/userGameListService";
import RemoveIcon from "@mui/icons-material/Remove";
import {PlatformBadge} from "../badge/PlatformBadge";
import {EnrichedGameSearch} from "../../../api/services/enrichedGamesService";
import { EnrichedGameCardProps } from "../../../types/gameCard";
import GameCover from "../GameCover";

const EnrichedGameCardLarge: React.FC<EnrichedGameCardProps> = ({ game, t, onStatusChange }) => {
    const { theme } = useTheme();
    const coverUrl = game.cover?.url.replace("t_thumb", "t_cover_big");

    return (
        <Card
            variant="black"
            style={{
                color: 'white',
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
                <AspectRatio
                    ratio="3/4"
                    className="game-card__img-wrapper"
                    sx={{
                        width: "7rem",
                        borderRadius: "0.6rem",
                        position: 'relative',
                        zIndex: 10,
                        overflow: 'hidden',
                    }}
                >
                    <Box sx={{ position: 'absolute', inset: 0, zIndex: 1 }}>
                        <GameCover coverUrl={coverUrl} gameName={game.name}/>
                    </Box>

                    {(game.userData && game.userData.status !== 'None') && (
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '1.25rem',
                                color: "white",
                                backgroundColor: statusColorsHard[game.userData.status],
                                opacity: 0.9,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                fontSize: "0.8rem",
                                zIndex: 2,
                                pointerEvents: 'none'
                            }}
                            className="text-uppercase"
                        >
                            <Typography
                                level="title-md"
                                style={{
                                    color: "white",
                                    backgroundColor: statusColors[game.userData.status],
                                    display: "flex",
                                    justifyContent: "center",
                                    boxShadow: "0 0 6px rgba(0,0,0,0.3)",
                                    backdropFilter: "blur(4px)",
                                    height: "1.25rem",
                                    width: "100%",
                                    alignItems: "center",
                                    fontSize: "0.8rem",
                                    margin: 0,
                                    padding: 0,
                                    zIndex: 10
                                }}
                            >
                                {t(`status_${game.userData.status.toLowerCase()}`)}
                            </Typography>
                        </Box>
                    )}

                    <Link
                        overlay
                        component="a"
                        href={`/games/${game.id}`}
                        underline="none"
                        sx={{
                            zIndex: 5,
                            display: 'block',
                            position: 'absolute',
                            inset: 0,
                            cursor: 'pointer'
                        }}
                    />
                </AspectRatio>

                <div style={{width: "12.2rem", display: "flex", justifyContent: "flex-start", flexDirection: "column", marginLeft: '0.25rem'}}>
                    <Typography level='title-md' className="text-center"
                         style={{
                             textAlign: 'center',
                             display: '-webkit-box',
                             overflow: 'hidden',
                             WebkitLineClamp: 2,
                             WebkitBoxOrient: 'vertical',
                             justifyContent: 'start',
                             alignItems: 'flex-start',
                             // margin: '0 0.25rem',
                             height: "3rem",
                             color: "white"
                         }}
                    >
                        {game.name}
                    </Typography>
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
                        {game?.firstReleaseDate
                            ? new Date(game?.firstReleaseDate * 1000).getFullYear()
                            : game?.firstReleaseDate && game?.firstReleaseDate[0]?.y}
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
                                {t(`${getCategoryName(game?.gameType?.id)}`)}
                            </Typography>
                        </Box>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default EnrichedGameCardLarge;