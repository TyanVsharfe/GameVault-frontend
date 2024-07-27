import React, {useEffect, useState} from "react";
import Container from "react-bootstrap/Container";
import {Stack} from "react-bootstrap";
import Row from "react-bootstrap/Row";
import UserGames from "../game/UserGames";
import Nav from "react-bootstrap/Nav";

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

        try {

            const responseUserIgdbIds = await fetch('http://localhost:8080/api/games/ids', {
                method: 'GET',
                headers: {
                    'Content-Type': 'text/plain'
                },
            });

            const IgdbIds = await responseUserIgdbIds.text();

            const response = await fetch('http://localhost:8080/api/igdb/games/ids', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: IgdbIds
            });

            //console.log(response);
            const data = await response.json();

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
        <Container style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
            <Nav variant="tabs" className="justify-content-center" defaultActiveKey="/account" style={{width: "50%"}}>
                <Nav.Item>
                    <Nav.Link href="/account">My games</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="/account/settings">Settings</Nav.Link>
                </Nav.Item>
            </Nav>

            <Container>
                <Stack className=".d-flex justify-content-center align-items-center">
                    <h1>Account</h1>
                    <h2>User games</h2>
                </Stack>
                <Stack className=".d-flex justify-content-center align-items-center">
                    <Row style={{justifyContent: "flex-start", flexWrap: "wrap"}}>
                        <UserGames userGames={userGames}/>
                    </Row>
                </Stack>
            </Container>
        </Container>
    );
}

export default Account;