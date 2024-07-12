import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import {Dropdown, Stack} from "react-bootstrap";
import {deleteGame} from "../api/DeleteGame";
import {addRating} from "../api/AddRating";
import {addStatus} from "../api/AddStatus";
import {enumStatus} from "../utils/Enums"

function AddedGame() {
    const [ show, setShow ] = useState(false);
    const [gameStatus, setGameStatus] = useState(false);

    const [ graphicsRating, setGraphicsRating ] = useState(5);
    const [ storyRating, setStoryRating ] = useState(5);
    const [ gameplayRating, setGameplayRating ] = useState(5);

    const graphicsSliderChange = (e) => {
        setGraphicsRating(e.target.value);
    };

    const storySliderChange = (e) => {
        setStoryRating(e.target.value);
    };

    const gameplaySliderChange = (e) => {
        setGameplayRating(e.target.value);
    };

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Stack gap={3} style={{alignItems: 'center'}}>
                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        Change status
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => addStatus(enumStatus.Completed)}>
                            Completed
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => addStatus(enumStatus.Playing)}>
                            Playing
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => addStatus(enumStatus.Planned)}>
                            Planned
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => addStatus(enumStatus.Abandoned)}>
                            Abandoned
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <Button variant={"primary"} type={"button"} onClick={handleShow}>Change rating</Button>
                <Button variant={"danger"} type={"button"} onClick={() => {deleteGame().then(r => setGameStatus(false))}}>Delete game</Button>
            </Stack>

            <Modal show={show} centered={true} onHide={handleClose}
                   dialogClassName="modal-90w"
                   aria-labelledby="example-custom-modal-styling-title">
                <Modal.Header closeButton>
                    <Modal.Title>Set rating</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Label>Graphics: {graphicsRating}</Form.Label>
                        <Form.Range value={graphicsRating} max={10} onChange={graphicsSliderChange}/>

                        <Form.Label>Story: {storyRating}</Form.Label>
                        <Form.Range value={storyRating} max={10} onChange={storySliderChange}/>

                        <Form.Label>Gameplay: {gameplayRating}</Form.Label>
                        <Form.Range value={gameplayRating} max={10} onChange={gameplaySliderChange}/>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="outline-primary" onClick={handleClose}>Close</Button>
                    <Button variant="primary" onClick={() => {
                        handleClose();
                        addRating(graphicsRating, storyRating, gameplayRating);
                    }}>Save changes</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default AddedGame;