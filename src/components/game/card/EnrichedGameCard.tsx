import React, {useState} from 'react';
import {
    AspectRatio,
    Box,
    Card,
    CardContent,
    CardOverflow,
    IconButton,
    Link,
    Stack,
    Tooltip,
    Typography
} from '@mui/joy';
import RatingBadge from "../badge/RatingBadge";
import {useTheme} from "next-themes";
import {statusColors} from "../../../utils/Utils";
import BookmarkIcon from '@mui/icons-material/Bookmark';
import {userGameService} from "../../../api/services/userGamesService";
import {enumStatus, getCategoryName} from "../../../utils/Enums";
import {Toast} from "../../toast/Toast";
import { EnrichedGameCardProps } from "../../../types/gameCard";
import GameCover from "../GameCover";

export const EnrichedGameCard: React.FC<EnrichedGameCardProps> = ({ game, t, onStatusChange }) => {
    const { theme } = useTheme();
    const isDlcOrExpansion = ["DLC", "EXPANSION"].includes(game?.gameType?.type);
    const hasRating = game?.userData?.userRating != null;
    const coverUrl = game.cover?.url?.replace("t_thumb", "t_cover_big");

    const [hovered, setHovered] = useState(false);
    const [showToast, setShowToast] = useState(false);

    return (
        <Stack
            direction="column"
            sx={{
                justifyContent: "center",
                alignItems: "center",
                paddingBottom: "0",
            }}
            className="mb-4 d-flex justify-content-center user-game-list-col"
        >
            <Card
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                sx={{
                    overflow: "hidden",
                    border: "0",
                    height: "14.75rem",
                    width: "10rem",
                    gap: "0",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "0.6rem",
                }}
                variant="plain"
                className={`user-game-list-game-card user-game-list-game-card-background position-relative ${theme === 'light' ? 'bg-dark text-white' : 'text-light'}`}
            >
                <CardOverflow sx={{ flex: "0 0 auto" }}>
                    <AspectRatio ratio="3/4" className="game-card__img-wrapper">
                        <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
                            <GameCover coverUrl={coverUrl} gameName={game.name}/>
                        </div>

                        {(isDlcOrExpansion || hasRating) && (
                            <div
                                className="blur-top"
                                style={{
                                    backgroundImage: `url(${coverUrl})`,
                                    objectPosition: 'top',
                                    zIndex: '2',
                                    pointerEvents: 'none'
                                }}
                            />
                        )}
                        <div style={{zIndex: '3'}}>
                            {hasRating && <RatingBadge rating={game?.userData?.userRating} />}
                        </div>

                        <Box
                            sx={{
                                position: "absolute",
                                top: 5,
                                left: 5,
                                px: 1.5,

                                borderRadius: "1rem",
                                backgroundColor: "rgba(0,0,0,0.35)",
                                backdropFilter: "blur(4px)",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.4)",

                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                textAlign: "center",
                                zIndex: 3,
                            }}
                        >
                            <Typography
                                level="body-md"
                                sx={{
                                    color: "#fff",
                                    fontWeight: 700,
                                    fontSize: `0.95rem`,
                                    textShadow: "0 1px 2px rgba(0,0,0,0.4)",
                                }}
                            >
                                {t(`${getCategoryName(game?.gameType?.id)}_short`)}
                            </Typography>
                        </Box>

                        {game?.userData == null && hovered && (
                            <IconButton
                                color="neutral"
                                size="sm"
                                sx={{
                                    position: "absolute",
                                    top: 5,
                                    right: 5,
                                    zIndex: 10,

                                    backgroundColor: "rgba(0,0,0,0.35)",
                                    backdropFilter: "blur(4px)",
                                    boxShadow: "0 2px 6px rgba(0,0,0,0.4)",

                                    transition: "transform 120ms ease, background-color 120ms ease, box-shadow 120ms ease",

                                    "&::before": {
                                        display: "none",
                                    },

                                    "&:hover": {
                                        transform: "scale(1.15)",
                                        backgroundColor: "rgba(0,0,0,0.55)",
                                        boxShadow: "0 4px 10px rgba(0,0,0,0.6)",
                                    },

                                    "&:active": {
                                        transform: "scale(1.05)",
                                        backgroundColor: "rgba(0,0,0,0.7)",
                                    },

                                    "&:focus-visible": {
                                        outline: "none",
                                    },
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    userGameService.addUserGame(game?.id?.toString()).then(() => {
                                        userGameService.updateGameStatus(game?.id?.toString(), enumStatus.Planned)
                                            .then(() => {
                                                onStatusChange(game?.id, enumStatus.Planned.toLowerCase())
                                                setShowToast(true);
                                            });
                                    })
                                }}
                            >
                                <BookmarkIcon sx={{color: "white"}}/>
                            </IconButton>
                        )}

                        {(game.userData && game.userData.status !== 'None') && (
                            <Typography
                                level="title-md"
                                style={{
                                    position: "absolute",
                                    top: '12.1rem',
                                    color: "white",
                                    backgroundColor: statusColors[game.userData.status],
                                    display: "flex",
                                    justifyContent: "center",
                                    boxShadow: "0 0 6px rgba(0,0,0,0.3)",
                                    backdropFilter: "blur(4px)",
                                    height: "1.25rem",
                                    width: "100%",
                                    alignItems: "center",
                                    // paddingBottom: '10%',
                                    // borderRadius: "1rem",
                                    fontSize: "0.8rem",
                                    margin: 0,
                                    padding: 0,
                                    zIndex: 10
                                }}
                                className="text-uppercase"
                            >
                                {t(`status_${game.userData.status.toLowerCase()}`)}
                            </Typography>
                        )}
                    </AspectRatio>
                    <Link
                        overlay
                        href={`/games/${game.id}`}
                        underline="none"
                        sx={{display: 'flex', flexDirection: 'column', alignItems: 'start', zIndex: '5'}}
                    />
                </CardOverflow>

                {/*<CardOverflow*/}
                {/*    sx={{*/}
                {/*        flex: 1,*/}
                {/*        padding: 0,*/}
                {/*        display: "flex",*/}
                {/*    }}*/}
                {/*>*/}
                {/*    <CardContent*/}
                {/*        style={{*/}
                {/*            display: "flex",*/}
                {/*            gap: "0",*/}
                {/*            flexDirection: "row",*/}
                {/*            justifyContent: "center",*/}
                {/*            padding: 0,*/}
                {/*            margin: 0,*/}
                {/*            alignItems: "center",*/}
                {/*            textAlign: "center",*/}
                {/*            verticalAlign: "middle"*/}
                {/*        }}*/}
                {/*    >*/}
                {/*        {(game.userData && game.userData.status !== 'None') && (*/}
                {/*            <Typography*/}
                {/*                level="title-sm"*/}
                {/*                style={{*/}
                {/*                    color: "white",*/}
                {/*                    backgroundColor: statusColors[game.userData.status],*/}
                {/*                    display: "flex",*/}
                {/*                    justifyContent: "center",*/}
                {/*                    boxShadow: "0 0 6px rgba(0,0,0,0.3)",*/}
                {/*                    //borderRadius: '0 0.25rem 0.25rem 0',*/}
                {/*                    backdropFilter: "blur(4px)",*/}
                {/*                    height: "100%",*/}
                {/*                    width: "80%",*/}
                {/*                    alignItems: "center",*/}
                {/*                    //flex: 1,*/}
                {/*                    // paddingBottom: '10%',*/}
                {/*                    // borderRadius: "1rem",*/}
                {/*                    fontSize: "0.8rem",*/}
                {/*                    margin: 0,*/}
                {/*                    padding: 0*/}
                {/*                }}*/}
                {/*                className="text-uppercase"*/}
                {/*            >*/}
                {/*                {t(`status_${game.userData.status.toLowerCase()}`)}*/}
                {/*            </Typography>*/}
                {/*        )}*/}
                {/*        <div*/}
                {/*            style={{display: "flex", justifyContent: "center", alignItems: "center", width: "50%", height: "100%", textAlign: "center", color: "white"}}>*/}
                {/*            {*/}
                {/*                (() => {*/}
                {/*                    const year = game.firstReleaseDate*/}
                {/*                        ? new Date(game.firstReleaseDate * 1000).getFullYear()*/}
                {/*                        : game.releaseDates && game.releaseDates[0].y*/}
                {/*                    return year == 0 ? 'None' : year;*/}
                {/*                })()*/}
                {/*            }*/}
                {/*        </div>*/}
                {/*    </CardContent>*/}
                {/*</CardOverflow>*/}
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
                            gap: "0",
                            flexDirection: "column",
                            justifyContent: "center",
                            padding: 0,
                            margin: 0,
                            alignItems: "center",
                            textAlign: "center",
                            verticalAlign: "middle"
                        }}
                    >
                        <div
                            style={{display: "flex", justifyContent: "center", alignItems: "center",
                                width: "50%", height: "100%", textAlign: "center", color: "white"}}>
                            {
                                (() => {
                                    const year = game.firstReleaseDate
                                        ? new Date(game.firstReleaseDate * 1000).getFullYear()
                                        : game.releaseDates && game.releaseDates[0].y
                                    return year == 0 ? 'None' : year;
                                })()
                            }
                        </div>
                    </CardContent>
                </CardOverflow>
            </Card>
            <Toast module={t('search')} message="Game succesfully added" isSuccess={true} open={showToast} onClose={() => setShowToast(false)}/>
        </Stack>
    );
};