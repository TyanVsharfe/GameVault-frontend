import React, {useEffect, useRef, useState} from "react";
import Container from "react-bootstrap/Container";
import ReleaseGames from "../components/ReleaseGames";
import {Alert, Spinner} from "react-bootstrap";
import GameListCarousel from "../components/game/list/GameListCarousel";
import {getComingSoonGames} from "../services/igdbGamesService";
import "../assets/styles/home-page.css"

function MainPage() {
    const [releaseGames, setReleaseGames] = useState([]);

    const [loading, setLoading] = useState(false);
    const carouselRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchReleaseGames();
    }, []);

    const fetchReleaseGames = async () => {
        setLoading(true);
        try {
            // const response = await fetch('/api/igdb/games/release-dates', {
            //     method: 'GET'
            // });

            const gameReleases = await getComingSoonGames();
            setReleaseGames(gameReleases);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching release games:', error);
            setLoading(false);
        }
    };

    const renderCarousel = (data: any, loading: boolean, carouselRef: React.RefObject<HTMLDivElement>) => {
        if (loading) {
            return (
                <Container style={{ display: "flex", justifyContent: "center", paddingBottom: '20px' }}>
                    <Spinner animation="border" variant="primary" />
                </Container>
            );
        }

        if (!data || data.length === 0) {
            return (
                <Container style={{ textAlign: "center", maxWidth: "500px" }}>
                    <Alert>Игры не найдены</Alert>
                </Container>
            );
        }

        return (
            <GameListCarousel games={data} carouselRef={carouselRef} />
            // <ReleaseGames releaseGames={data}/>
        );
    };

    return (
        <Container style={{textAlign: "center"}}>
            <h1>Main</h1>
            <h2>Release dates of the games</h2>
            <Container>
                {/*<ReleaseGames releaseGames={releaseGames}/>*/}
                {renderCarousel(releaseGames, loading, carouselRef)}
            </Container>
        </Container>
    );
}

export default MainPage;