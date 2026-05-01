import React, {useEffect, useRef, useState} from "react";
import GameCarousel from "../components/game/list/GameCarousel";
import {igdbGamesService} from "../api/services/igdbGamesService";
import "../assets/styles/home-page.css"
import {Card, CircularProgress, Stack} from "@mui/joy";
import {useTranslation} from "react-i18next";

function MainPage() {
    const { t } = useTranslation();
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

            const gameReleases = await igdbGamesService.getComingSoonGames();
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
                <div style={{ display: "flex", justifyContent: "center", paddingBottom: '20px' }}>
                    <CircularProgress/>
                </div>
            );
        }

        if (!data || data.length === 0) {
            return (
                <div style={{ textAlign: "center", maxWidth: "500px" }}>
                    <Card>{t('not_found')}</Card>
                </div>
            );
        }

        return (
            <GameCarousel games={data} carouselRef={carouselRef} />
            // <ReleaseGames releaseGames={data}/>
        );
    };

    return (
        <div style={{textAlign: "center"}}>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                    width: "100%",
                    maxWidth: '75rem',
                    margin: "auto",
                    padding: '0 3rem'
                }}
            >
                <h1>{t('release_calendar')}</h1>
                <h5>{t('release_calendar_description')}.</h5>
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    maxWidth: '75rem',
                    margin: "auto",
                }}
            >
                {/*<ReleaseGames releaseGames={releaseGames}/>*/}
                {renderCarousel(releaseGames, loading, carouselRef)}
            </div>
        </div>
    );
}

export default MainPage;