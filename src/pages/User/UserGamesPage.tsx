import React, {useEffect, useState} from "react";
import Container from "react-bootstrap/Container";
import {Alert, Stack} from "react-bootstrap";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import "../../assets/styles/account.css"
import GameList from "../../components/game/GameList";
import {getUserGames, UserGame} from "../../services/userGamesService";
import UserGameList from "../../components/game/list/UserGameList";
import AccountNav from "../../components/AccountNav";
import {useTranslation} from "react-i18next";

function UserGamesPage() {
    const { t } = useTranslation();

    const [displayedGames, setDisplayedGames] = useState<UserGame[]>([]);
    const [filterStatus, setFilterStatus] = useState("");
    const [activeFilterButtonIndex, setActiveFilterButton] = useState(0);


    useEffect(() => {
        fetchData();
    }, [filterStatus]);

    const fetchData = () => {
        getUserGames(filterStatus).then((data) => {setDisplayedGames(data)});
    };

    const renderUserGames = () => {
        // const gamesResults = displayedGames.map((userGame) => userGame.game);


        if (Array.isArray(displayedGames) && displayedGames.length > 0) {
            return (
                <UserGameList games={displayedGames} gamesPerPage={20}/>
            )
        }
        else {
            return (
                <Container style={{textAlign: "center", maxWidth: "500px"}}>
                    <Alert>{t('not_found')}</Alert>
                </Container>
            )
        }
    };

    return (
        <Container style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
            <AccountNav />

            <Container>
                <Stack className=".d-flex justify-content-center align-items-center">
                    <h1>{t('user_games')}</h1>
                    <Stack direction="horizontal" className=".d-flex justify-content-md-center align-items-center" gap={4}>
                        <Button variant="outline-primary" disabled={activeFilterButtonIndex === 0} onClick={() => {
                            setActiveFilterButton(0)
                            setFilterStatus("")
                        }}>{t('all_games')}</Button>
                        <Button variant="outline-primary" disabled={activeFilterButtonIndex === 1} onClick={() => {
                            setActiveFilterButton(1)
                            setFilterStatus("Completed")
                        }}>{t('status_completed')}</Button>
                        <Button variant="outline-primary" disabled={activeFilterButtonIndex === 2} onClick={() => {
                            setActiveFilterButton(2)
                            setFilterStatus("Playing")
                        }}>{t('status_playing')}</Button>
                        <Button variant="outline-primary" disabled={activeFilterButtonIndex === 3} onClick={() => {
                            setActiveFilterButton(3)
                            setFilterStatus("Planned")
                        }}>{t('status_planned')}</Button>
                        <Button variant="outline-primary" disabled={activeFilterButtonIndex === 4} onClick={() => {
                            setActiveFilterButton(4)
                            setFilterStatus("Abandoned")
                        }}>{t('status_abandoned')}</Button>
                        <Button variant="outline-primary" disabled={activeFilterButtonIndex === 5} onClick={() => {
                            setActiveFilterButton(5)
                            setFilterStatus("None")
                        }}>{t('status_none')}</Button>
                    </Stack>
                </Stack>
                <br/>
                {renderUserGames()}
            </Container>
        </Container>
    );
}

export default UserGamesPage;