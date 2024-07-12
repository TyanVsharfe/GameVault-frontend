import React, {useEffect, useState} from 'react';
import Card from "react-bootstrap/Card";
import {GetGame} from "../api/GetGame";

function UserGameInfo() {
    const [userRating, setUserRating] = useState(undefined);
    const [gameStatus, setGameStatus] = useState(undefined);

    useEffect(() => {
        GetGame().then(data => {
            if (data && data.userRating !== null)
                setUserRating(data.userRating)
            if (data && data.status !== null)
                setGameStatus(data.status)
        })
    }, []);

    return (
        <Card data-bs-theme="dark" style={{width: '15rem'}} className="text-center" border="light">
            <Card.Header>User Game Information</Card.Header>
            <Card.Body>
                <Card.Title>Status: {gameStatus}</Card.Title>
                <Card.Text>
                    <br/>
                    <p>Graphics</p>
                    <p>Story</p>
                    <p>Gameplay</p>
                </Card.Text>
            </Card.Body>
            <Card.Footer>Final rating: {userRating === undefined ? "no rating" : userRating}</Card.Footer>
        </Card>
    );
}

export default UserGameInfo;