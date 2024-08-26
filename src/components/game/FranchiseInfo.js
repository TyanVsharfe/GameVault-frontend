import "../../assets/styles/game-page.css"

import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import {Button, Stack} from "react-bootstrap";
import UserGameInfo from "./UserGameInfo";
import {getGameId} from "../../utils/GetGameId";
import {checkEntity} from "../../api/CheckEntity";
import UpdateGame from "./UpdateGame";
import {addGame} from "../../api/Game/AddGame";
import Notes from "../Notes";
import {GameProvider} from "../GameContext";
import FranchiseGames from "./FranchiseGames";

function FranchiseInfo() {
    const [franchiseData, setFranchiseData] = useState(null);
    const [gameStatus, setGameStatus] = useState(false);
    const [id, setID] = useState(getGameId);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const seriesTitle = getGameId();
                setID(seriesTitle);
                console.log("Title " + id);

                const response = await fetch(`/api/igdb/series/${seriesTitle}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const data = await response.json();
                const keyStorage = `/series/${seriesTitle}`;
                localStorage.setItem(keyStorage, JSON.stringify(data));
                setFranchiseData(data[0]);
                console.log("Franchise " + franchiseData);
            } catch (error) {
                console.error('Error fetching game data:', error);
            }
        };

        fetchData();
    }, [franchiseData, id]);

    return (
        <Stack className=".d-flex justify-content-center align-items-center" style={{paddingTop: "20px"}} gap={5}>
            {franchiseData != null ? (
                    <>
                        <h2 style={{textAlign: "center"}}>Franchise: {franchiseData.name}</h2>
                        <FranchiseGames franchiseGames={franchiseData.games}/>
                    </>
                ) :
                <></>}
            {gameStatus ? (<Notes/>) : <></>}
        </Stack>
    );
}

export default FranchiseInfo;
