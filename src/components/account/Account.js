import React, {useEffect, useState} from "react";
import Container from "react-bootstrap/Container";
import {Stack} from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import {ImportSteamGames} from "../../api/ImportSteamGames";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";

function Account() {
    const [ show, setShow ] = useState(false);
    const [ steamId, setSteamId ] = useState(false);
    const [ userStatsInfo, setUserStatsInfo ] = useState([]);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const steamIdInputChange = (e) => setSteamId(e.target.value);

    useEffect(() => {
        getUserStats();
    }, []);

    const getUserStats = async () => {
        const response = await fetch('api/statistics', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const data = await response.json();
        console.log(data);
        setUserStatsInfo(data);
    };

    return (
        <>
            <Container style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
                <Nav variant="tabs" className="justify-content-center" defaultActiveKey="/account" style={{width: "50%"}}>
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
                        <h1>Account info</h1>
                    </Stack>
                    <br/>
                    <Stack className=".d-flex justify-content-center align-items-center">
                        <Row style={{justifyContent: "flex-start"}}>
                            <Card data-bs-theme="dark" style={{ width: '18rem' }}>
                                <Card.Header>User Statistics</Card.Header>
                                <Card.Body>
                                    <Card.Title>Total games {userStatsInfo.totalGames}</Card.Title>
                                    <Card.Text>
                                        <Stack>
                                            <br/>
                                            <Button>Completed {userStatsInfo.completedGames}</Button> <br/>
                                            <Button variant="success">Playing {userStatsInfo.playingGames}</Button> <br/>
                                            <Button variant="warning">Planned {userStatsInfo.plannedGames}</Button> <br/>
                                            <Button variant="danger">Abandoned {userStatsInfo.abandonedGames}</Button> <br/>
                                            <Button variant="info">None status {userStatsInfo.noneStatusGames}</Button> <br/>
                                        </Stack>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Row>
                    </Stack>
                </Container>
            </Container>

            <Modal show={show} centered={true} onHide={handleClose}
                   dialogClassName="modal-90w"
                   aria-labelledby="example-custom-modal-styling-title">
                <Modal.Header closeButton>
                    <Modal.Title>Import games from Steam</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Label>Enter Steam id:</Form.Label>
                        <Form.Control type="email" onChange={steamIdInputChange}/>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="outline-primary" onClick={handleClose}>Close</Button>
                    <Button variant="primary" onClick={() => {
                        handleClose();
                        ImportSteamGames(steamId);
                    }}>Save changes</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Account;