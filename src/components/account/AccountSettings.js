import React, {useEffect, useState} from "react";
import Container from "react-bootstrap/Container";
import {Stack, Toast, ToastContainer} from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import {addImportedSteamGames, ImportSteamGames} from "../../api/ImportSteamGames";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import ImportGamesList from "../ImportGamesList";
import "../../assets/styles/account.css"

function AccountSettings() {
    const [ show, setShow ] = useState(false);
    const [ showToast, setShowToast ] = useState(false);
    const [ showImport, setShowImport ] = useState(false);

    const [ steamId, setSteamId ] = useState(false);
    const [ importSteamGames, setImportSteamGames] = useState([]);
    const [checkedGameIds, setCheckedGameIds] = useState([]);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleCloseImport = () => setShowImport(false);
    const handleShowImport = () => setShowImport(true);

    const handleCloseToast = () => setShowToast(false);
    const handleShowToast = () => setShowToast(true);

    const steamIdInputChange = (e) => setSteamId(e.target.value);

    const handleSwitchChange = (checkedIds) => {
        setCheckedGameIds(checkedIds);
    };

    useEffect(() => {
        console.log("Updated importSteamGames:", importSteamGames);
        console.log("Data length " + importSteamGames.length);
    }, [importSteamGames]);

    const handleImportGames = () => {
        ImportSteamGames(steamId)
            .then(data => {
                console.log("Data received" + data);
                setImportSteamGames(data);
                //handleShowImport();
            })
    };

    return (
        <>
            <Container style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
                <Nav variant="tabs" className="justify-content-center" defaultActiveKey="/account/settings" style={{width: "50%"}}>
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
                        <h1>Settings</h1>
                    </Stack>
                    <br/>
                    <Stack className=".d-flex justify-content-center align-items-center">
                        <Row style={{justifyContent: "flex-start", gap: "10px"}}>
                            <Button onClick={handleShow}>Import games from Steam</Button>

                            <Button variant="primary" onClick={() => {
                                handleShowImport()
                            }}>Show import games</Button>
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
                    <Button variant="outline-primary" onClick={handleClose}>Cancel</Button>
                    <Button variant="primary" onClick={() => {
                        handleImportGames();
                        handleClose();
                    }}>Import</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showImport}
                   size={"lg"}
                   centered={true}
                   onHide={handleCloseImport}
                   // fullscreen={true}
                   dialogClassName="modal-90w"
                   aria-labelledby="example-custom-modal-styling-title">
                <Modal.Header closeButton>
                    <Modal.Title>Imported games from Steam</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Container>
                        <h2>Find games: {importSteamGames.length}</h2>
                    </Container>
                    <ImportGamesList importGames={importSteamGames} onSwitchChange={handleSwitchChange} />
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="outline-primary" onClick={handleCloseImport}>Cancel</Button>
                    <Button variant="primary" onClick={() => {
                        addImportedSteamGames(importSteamGames.filter(game => checkedGameIds.includes(game.id))).then();
                        handleCloseImport();
                        handleShowToast();
                    }}>Import</Button>
                </Modal.Footer>
            </Modal>

           <ToastContainer position="bottom-end">
               <Toast onClose={handleCloseToast}
                      show={showToast}
                      delay={4500}
                      autohide
                      // bg="dark"
                      animation={true}>
                   <Toast.Header>
                       <strong className="me-auto">GameVault</strong>
                       <small>Import Steam games</small>
                   </Toast.Header>
                   <Toast.Body>Games are imported</Toast.Body>
               </Toast>
           </ToastContainer>
        </>
    );
}

export default AccountSettings;