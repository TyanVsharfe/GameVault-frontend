import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import {Button, Stack} from "react-bootstrap";
import UserGameInfo from "./UserGameInfo";
import Notes from "../Notes";
import FranchiseGames from "./FranchiseGames";
import {useParams} from "react-router-dom";

function FranchiseInfo() {
    const [franchiseData, setFranchiseData] = useState(null);
    const [gameStatus, setGameStatus] = useState(false);
    const seriesTitle = useParams<{ id: string }>();

    useEffect(() => {
        const fetchData = async () => {
            try {
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
    }, [franchiseData, seriesTitle]);

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
