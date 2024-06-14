import React, { useState, useEffect } from "react";
import {Dropdown, Button, Stack} from "react-bootstrap";
import { addGame } from "../utils/AddGame"

function CheckGameStatus({ id }) {  // Pass `id` as a prop

    const [gameStatus, setGameStatus] = useState(false); // Track status for conditional rendering

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("Id check - " + id);
                console.log(`/api/checkEntity/${id}`);

                const response = await fetch(`/api/checkEntity/${id}`);

                if (response.ok) {
                    const result = await response.json();
                    console.log(result);
                    setGameStatus(result);
                } else {
                    console.error('Ошибка при проверке сущности:', response.status);
                    // Вероятно, вам нужно что-то вернуть в случае ошибки
                    return null;
                }

                if (!response.ok) {
                    throw new Error(`Ошибка при проверке сущности: ${response.status}`);
                }
            } catch (error) {
                console.error(error);
                // Optionally handle errors by displaying a message or providing a retry mechanism
            }
        };

        fetchData();
    }, [id]); // Re-run effect when `id` changes

    return (
        <>
            {gameStatus ? (
                <Stack gap={3} style={{alignItems: 'center'}}>
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            Change status
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item href="#/action-1" disabled={gameStatus === "Completed"}>
                                Completed
                            </Dropdown.Item>
                            <Dropdown.Item href="#/action-2" disabled={gameStatus === "Playing"}>
                                Playing
                            </Dropdown.Item>
                            <Dropdown.Item href="#/action-3" disabled={gameStatus === "Planned"}>
                                Planned
                            </Dropdown.Item>
                            <Dropdown.Item href="#/action-3" disabled={gameStatus === "Abandoned"}>
                                Abandoned
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Button variant={"primary"} type={"button"} onClick={() => {addGame(); setGameStatus(false)}}>Change rating</Button>
                    <Button variant={"danger"} type={"button"} onClick={() => {addGame(); setGameStatus(false)}}>Delete game</Button>
                </Stack>
            ) : (
                <Button type={"button"} onClick={() => {addGame(); setGameStatus(true)}}>Add game</Button>
            )}
        </>
    );
}

export default CheckGameStatus
