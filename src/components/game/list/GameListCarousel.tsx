import Button from "react-bootstrap/Button";
import {IgdbGame, ReleaseGame} from "../../../services/igdbGamesService";
import Card from "react-bootstrap/Card";
import {Link} from "react-router-dom";
import React from "react";

export interface GameListProps {
    games: ReleaseGame[];
    carouselRef: React.RefObject<HTMLDivElement>;
    width: number
}

const GameListCarousel: React.FC<GameListProps> = ({ games, carouselRef, width }) => {

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
                {games.map((releaseGame: ReleaseGame, index: number) => (
                    <Card key={index} className="carousel-game-card">
                        {releaseGame.game.cover?.url && (
                            <Card.Img
                                variant="top"
                                src={releaseGame.game.cover?.url?.replace('t_thumb', 't_cover_big') || ''}
                                alt={releaseGame.game.name}
                            />
                        )}
                        <Card.Body style={{maxWidth: '210px'}}>
                            <Card.Title>
                                <Card.Title>
                                    <Link to={`/games/${releaseGame.id}`}
                                          style={{textDecoration: 'none', color: 'inherit'}}>
                                        {releaseGame.game.name || 'Название неизвестно'}
                                    </Link>
                                </Card.Title>
                            </Card.Title>
                            <Card.Text>
                                {releaseGame?.involved_companies && (
                                    releaseGame.involved_companies.map((company) =>
                                        company.publisher ?
                                            <div key={company.company.name}>{company.company.name}</div> : null
                                    )
                                )}
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer className="text-muted">
                            {releaseGame.human}
                        </Card.Footer>
                    </Card>
                ))}
            </div>

            <Button variant="light" className="carousel-control right" onClick={() => handleScrollRight(carouselRef)}>
                <i className="bi bi-chevron-compact-right" style={{marginLeft: '2px'}}></i>
            </Button>
        </div>
    );
};

export default GameListCarousel;