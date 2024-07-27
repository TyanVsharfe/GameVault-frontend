import React, {useEffect, useState} from "react";
import Container from "react-bootstrap/Container";
import {Stack} from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import {ImportSteamGames} from "../../api/ImportSteamGames";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

function AccountSettings() {
    const [ show, setShow ] = useState(false);
    const [ steamId, setSteamId ] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const steamIdInputChange = (e) => setSteamId(e.target.value);

    useEffect(() => {
    }, []);

    return (
        <>
            <Container style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
                <Nav variant="tabs" className="justify-content-center" defaultActiveKey="/account/settings" style={{width: "50%"}}>
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
                        <h2>Settings</h2>
                    </Stack>
                    <br/>
                    <Stack className=".d-flex justify-content-center align-items-center">
                        <Row style={{justifyContent: "flex-start"}}>
                            <Button onClick={handleShow}>Import games from Steam</Button>
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

export default AccountSettings;