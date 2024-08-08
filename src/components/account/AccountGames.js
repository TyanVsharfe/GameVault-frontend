import React, {useEffect, useState} from "react";
import Container from "react-bootstrap/Container";
import {Stack} from "react-bootstrap";
import UserGames from "../game/UserGames";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import "../../assets/styles/account.css"

function AccountGames() {
    const [userGames, setUserGames] = useState([]);
    const [filterStatus, setFilterStatus] = useState("");
    const [activeFilterButtonIndex, setActiveFilterButton] = useState(0);


    useEffect(() => {
        fetchData();
    }, [filterStatus]);

    const fetchData = () => {
        handleUserGames();
        const results = JSON.parse(localStorage.getItem("user_game_list"));
        const loading = localStorage.getItem("loading");
        const isLoaded = Boolean(loading);

        setUserGames(results);
    };

    const handleUserGames = async () => {
        localStorage.removeItem('game_list');
        localStorage.setItem('loading', true);


        try {

            const responseUserIgdbIds = await fetch(`/api/games/ids?status=${filterStatus}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'text/plain'
                }
            });

            const IgdbIds = await responseUserIgdbIds.text();
            console.log("IgdbIds " + IgdbIds);

            const response = await fetch('/api/igdb/games/ids', {
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
        } catch (error) {
            console.error('Error when executing the request:', error);
        }
    };

    return (
        <Container style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
            <Nav variant="tabs" className="justify-content-center" defaultActiveKey="/account/games" style={{width: "50%"}}>
                <Nav.Item>
                    <Nav.Link href="/account">Account info</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="/account/games">My games</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="/account/settings">Settings</Nav.Link>
                </Nav.Item>
            </Nav>

            <Container>
                <Stack className=".d-flex justify-content-center align-items-center">
                    <h1>User games</h1>
                    <Stack direction="horizontal" className=".d-flex justify-content-md-center align-items-center" gap={4}>
                        <Button variant="outline-primary" disabled={activeFilterButtonIndex === 0} onClick={() => {
                            setActiveFilterButton(0)
                            setFilterStatus("")
                        }}>All games</Button>
                        <Button variant="outline-primary" disabled={activeFilterButtonIndex === 1} onClick={() => {
                            setActiveFilterButton(1)
                            setFilterStatus("Completed")
                        }}>Completed</Button>
                        <Button variant="outline-primary" disabled={activeFilterButtonIndex === 2} onClick={() => {
                            setActiveFilterButton(2)
                            setFilterStatus("Playing")
                        }}>Playing</Button>
                        <Button variant="outline-primary" disabled={activeFilterButtonIndex === 3} onClick={() => {
                            setActiveFilterButton(3)
                            setFilterStatus("Planned")
                        }}>Planned</Button>
                        <Button variant="outline-primary" disabled={activeFilterButtonIndex === 4} onClick={() => {
                            setActiveFilterButton(4)
                            setFilterStatus("Abandoned")
                        }}>Abandoned</Button>
                        <Button variant="outline-primary" disabled={activeFilterButtonIndex === 5} onClick={() => {
                            setActiveFilterButton(5)
                            setFilterStatus("None")
                        }}>Without status</Button>
                    </Stack>
                </Stack>
                <br/>
                {/*<Container className="justify-content-center align-items-center games-list">*/}
                {/*    <UserGames userGames={userGames}/>*/}
                {/*</Container>*/}
                <UserGames userGames={userGames}/>
            </Container>
        </Container>
    );
}

export default AccountGames;