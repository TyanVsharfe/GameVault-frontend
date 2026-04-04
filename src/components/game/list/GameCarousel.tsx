import {Link} from "react-router-dom";
import React from "react";
import {AggregatedRelease} from "../../../types/igdb.game.types";
import {PlatformBadge} from "../badge/PlatformBadge";
import IgdbGameTypeBadge from "../badge/IgdbGameTypeBadge";
import {useTranslation} from "react-i18next";
import {AspectRatio, Button, Card, CardContent, CardOverflow, Chip, Typography} from "@mui/joy";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

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

                              // sx={{
                              //     width: "10rem",
                              //     height: "15.5rem",
                              //     display: "grid",
                              //     gap: "0.2rem"
                              // }}
                        >
                            {releaseGame?.coverUrl && (
                                <CardOverflow sx={{ flex: "0 0 auto", padding: 0, alignItems: "center"}}>
                                    <AspectRatio ratio="3/4" className="game-card__img-wrapper"
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
                                <Typography style={{marginBottom: '0.5rem'}}>
                                    <Link to={`/games/${releaseGame.gameId}`}
                                          style={{textDecoration: 'none', color: 'inherit'}}>
                                        {releaseGame?.gameName || 'Название неизвестно'}
                                    </Link>
                                </Typography>
                                <CardContent style={{padding: '0', flex: 1, overflow: 'auto', alignItems: "center"}}>
                                    {releaseGame?.platforms.slice(0, 4).map((platform, index) =>
                                        PlatformBadge(platform.abbreviation?.replace(' ', '-'), index))
                                    }
                                    {releaseGame?.platforms.length > 4 && (
                                        <Chip style={{marginBottom: '0.4rem', marginRight: '0.3rem'}}>
                                            +{releaseGame.platforms.length - 4}
                                        </Chip>
                                    )}
                                </CardContent>
                                <div className="text-muted"
                                             style={{background: 'none', border: 'none', padding: '0.5rem 0 0 0'}}>
                                    {releaseGame?.earliestRelease?.human}
                                </div>
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