import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import {Link} from "react-router-dom";
import React from "react";
import {AggregatedRelease} from "../../../types/igdb.game.types";
import {PlatformBadge} from "../badge/PlatformBadge";
import IgdbGameTypeBadge from "../badge/IgdbGameTypeBadge";
import {useTranslation} from "react-i18next";
import {Chip} from "@mui/joy";

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
                <i className="bi bi-chevron-compact-left" style={{marginLeft: '2px'}}></i>
            </Button>

            <div className="carousel-items" style={{width: `${width}rem`}} ref={carouselRef}>
                {games.filter((releaseGame: AggregatedRelease) => releaseGame?.coverUrl != undefined)
                    .map((releaseGame: AggregatedRelease, index: number) => (
                        <Card key={index} className="carousel-game-card">
                            {releaseGame?.coverUrl && (
                                <div style={{position: 'relative', overflow: 'hidden', height: '16.5rem'}}>
                                    <Card.Img
                                        variant="top"
                                        src={releaseGame?.coverUrl?.replace('t_thumb', 't_cover_big') || ''}
                                        alt={releaseGame?.gameName}
                                        style={{
                                            height: '100%',
                                            objectFit: 'cover',
                                            objectPosition: 'top',
                                        }}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        height: '1rem',
                                        background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.7))'
                                    }}/>
                                    <IgdbGameTypeBadge
                                        gameType={releaseGame.gameType}
                                        t={t}
                                    />
                                </div>
                            )}
                            <div style={{flex: 1, display: 'flex', flexDirection: 'column', padding: '1rem'}}>
                                <Card.Title style={{marginBottom: '0.5rem'}}>
                                    <Link to={`/games/${releaseGame.gameId}`}
                                          style={{textDecoration: 'none', color: 'inherit'}}>
                                        {releaseGame?.gameName || 'Название неизвестно'}
                                    </Link>
                                </Card.Title>
                                <Card.Body style={{padding: '0', flex: 1, overflow: 'auto'}}>
                                    {releaseGame?.platforms.slice(0, 4).map((platform, index) =>
                                        PlatformBadge(platform.abbreviation?.replace(' ', '-'), index))
                                    }
                                    {releaseGame?.platforms.length > 4 && (
                                        <Chip style={{marginBottom: '0.4rem', marginRight: '0.3rem'}}>
                                            +{releaseGame.platforms.length - 4}
                                        </Chip>
                                    )}
                                </Card.Body>
                                <Card.Footer className="text-muted"
                                             style={{background: 'none', border: 'none', padding: '0.5rem 0 0 0'}}>
                                    {releaseGame?.earliestRelease?.human}
                                </Card.Footer>
                            </div>
                        </Card>
                    ))}
            </div>

            <Button variant="light" className="carousel-control right" onClick={() => handleScrollRight(carouselRef)}>
                <i className="bi bi-chevron-compact-right" style={{marginLeft: '2px'}}></i>
            </Button>
        </div>
    );
};

export default GameCarousel;