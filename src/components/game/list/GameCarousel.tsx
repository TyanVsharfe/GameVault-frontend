import {Link} from "react-router-dom";
import React from "react";
import {AggregatedRelease} from "../../../types/igdb.game.types";
import {PlatformBadge} from "../badge/PlatformBadge";
import IgdbGameTypeBadge from "../badge/IgdbGameTypeBadge";
import {useTranslation} from "react-i18next";
import {AspectRatio, Button, Card, CardContent, CardOverflow, Chip, IconButton, Stack, Typography} from "@mui/joy";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import AddIcon from '@mui/icons-material/Add';
import {userGameService} from "../../../api/services/userGamesService";
import {enumStatus} from "../../../utils/Enums";
import BookmarkIcon from "@mui/icons-material/Bookmark";

export interface GameListProps {
    games: AggregatedRelease[];
    carouselRef: React.RefObject<HTMLDivElement>;
    width: number
}

const GameCarousel: React.FC<GameListProps> = ({ games, carouselRef, width }) => {
    const { t } = useTranslation();

    const handleScrollLeft = (ref: React.RefObject<HTMLDivElement>) => {
        if (ref.current) {
            ref.current.scrollBy({ left: -300, behavior: 'smooth' });
        }
    };

    const handleScrollRight = (ref: React.RefObject<HTMLDivElement>) => {
        if (ref.current) {
            ref.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };

    return (
        <div className="carousel-container">
            <Button variant="light" className="carousel-control left" onClick={() => handleScrollLeft(carouselRef)}>
                <ChevronLeftIcon/>
                {/*<i className="bi bi-chevron-compact-left" style={{marginLeft: '2px', width: '10rem', height: '30rem'}}></i>*/}
            </Button>

            <div className="carousel-items" style={{width: `${width}rem`, margin: '0 0.5rem'}} ref={carouselRef}>
                {games.filter((releaseGame: AggregatedRelease) => releaseGame?.coverUrl != undefined)
                    .map((releaseGame: AggregatedRelease, index: number) => (
                        <Card key={index}
                              className="carousel-game-card"
                              style={{
                                  overflow: "hidden",
                                  paddingBottom: '0.25rem'
                                  // border: "0px",
                              }}

                              sx={{
                                  height: "29rem",
                              }}
                        >
                            {releaseGame?.coverUrl && (
                                <CardOverflow sx={{ flex: "0 0 auto", padding: 0, alignItems: "center"}}>
                                    <AspectRatio ratio="3/4"
                                                 sx={{
                                                     width: "100%",
                                                     padding: 0
                                                 }}
                                    >
                                        <IgdbGameTypeBadge
                                            gameType={releaseGame.gameType}
                                            t={t}
                                        />
                                        {releaseGame?.coverUrl ? (
                                            <img
                                                src={releaseGame?.coverUrl?.replace('t_thumb', 't_cover_big') || ''}
                                                alt={releaseGame.gameName}
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
                                                {releaseGame.gameName}
                                            </div>
                                        )}
                                    </AspectRatio>
                                </CardOverflow>
                            )}
                            <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                                <Typography level="title-md" style={{display: 'flex', marginBottom: '0.5rem', alignItems: 'flex-start', height: '3rem'}}>
                                    <Link to={`/games/${releaseGame.gameId}`}
                                          style={{textDecoration: 'none', color: 'inherit'}}>
                                        {releaseGame?.gameName || 'Название неизвестно'}
                                    </Link>
                                </Typography>
                                <CardContent style={{display: 'flow', padding: '0', flex: 1, overflow: 'auto'}}>
                                    {releaseGame?.platforms.slice(0, 3).map((platform, index) =>
                                        PlatformBadge(platform.abbreviation?.replace(' ', '-'), index))
                                    }
                                    {releaseGame?.platforms.length > 3 && (
                                        <Chip style={{marginBottom: '0.4rem', marginRight: '0.3rem'}}>
                                            +{releaseGame.platforms.length - 3}
                                        </Chip>
                                    )}
                                </CardContent>
                                <Stack direction="row" sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                    <div className="text-muted"
                                         style={{alignItems: 'start', background: 'none', border: 'none', padding: '0.5rem 0 0 0'}}>
                                        {releaseGame?.earliestRelease?.human}
                                    </div>
                                    <IconButton
                                        color="neutral"
                                        size="sm"
                                        sx={{
                                            zIndex: 10,
                                        }}
                                        onClick={(e) => {
                                        }}
                                    >
                                        <AddIcon/>
                                    </IconButton>
                                </Stack>
                            </div>
                        </Card>
                    ))}
            </div>

            <Button variant="light" className="carousel-control right" onClick={() => handleScrollRight(carouselRef)}>
                <ChevronRightIcon/>
            </Button>
        </div>
    );
};

export default GameCarousel;