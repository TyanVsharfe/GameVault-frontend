import React, {useEffect, useState} from "react";
import Container from "react-bootstrap/Container";
import {Stack} from "react-bootstrap";
import Row from "react-bootstrap/Row";
import UserGames from "./UserGames";

function Account() {
    const [userGames, setUserGames] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = () => {
            handleUserGames();
            const results = JSON.parse(localStorage.getItem("user_game_list"));
            const loading = localStorage.getItem("loading");
            const isLoaded = Boolean(loading);

            setUserGames(results);
            setIsLoading(isLoaded);
        };

        fetchData();
    }, []);

    const handleUserGames = async () => {
        localStorage.removeItem('game_list');
        setIsLoading(true);
        localStorage.setItem('loading', true);
        const gameName = document.getElementById('gameNameInput').value;
        console.log("Game name - " + gameName)
        try {
            const response = await fetch('http://localhost:8080/api/games', {
                method: 'GET',
                headers: {
                    'Content-Type': 'text/plain'
                },
            });
            console.log(response);
            const data = await response.json();

            console.log("Data " + data);
            //console.log("SearchResults до set " + searchResults);
            setUserGames(data);
            localStorage.setItem('user_game_list', JSON.stringify(data));
            console.log("SearchResults после set " + userGames);
        } catch (error) {
            console.error('Ошибка при выполнении запроса:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="main">
            <nav className="account-nav">
                <h1>Account</h1>
{/*                <a className="" href="">Profile</a>
                <a className="" href="">Games</a>
                <a className="" href=""></a>*/}
            </nav>
            <div id="user-game-list"></div>
            <Container>
                <Stack className=".d-flex justify-content-center align-items-center">
                    <h2>Search result</h2>
                    <Row className="flex-wrap" style={{ display: 'flex', alignItems: 'flex-end' }} gap="4">
                        <UserGames userGames={userGames}/>
                    </Row>
                </Stack>
            </Container>
        </div>
    );
}

export default Account;