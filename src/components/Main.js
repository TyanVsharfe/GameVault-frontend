import React, {useEffect, useState} from "react";
import Container from "react-bootstrap/Container";
import ReleaseGames from "./ReleaseGames";
import UserGames from "./game/UserGames";


function Main() {
    const [releaseGames, setReleaseGames] = useState([]);

    useEffect(() => {
        fetchReleaseGames();
    }, []);

    const fetchReleaseGames = async () => {
        try {
            const response = await fetch('/api/igdb/games/release_dates', {
                method: 'POST'
            });

            const data = await response.json();
            setReleaseGames(data);
        } catch (error) {
            console.error('Error fetching release games:', error);
        }
    };

    return (
        <Container style={{textAlign: "center"}}>
            <h1>Main</h1>
            <h2>Release dates of the games</h2>
            <Container>
                <ReleaseGames releaseGames={releaseGames}/>
            </Container>
        </Container>
    );
}

export default Main;