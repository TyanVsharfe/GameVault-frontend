import React, {useEffect, useState} from "react";
import Container from "react-bootstrap/Container";
import {Stack, Toast, ToastContainer} from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import {addImportedSteamGames, ImportedSteamGame, importSteamGames} from "../../services/steamGamesService";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import ImportGamesList from "../../components/game/list/ImportGamesList";
import "../../assets/styles/account.css"
import AccountNav from "../../components/AccountNav";
import {useTranslation} from "react-i18next";

function UserSettingsPage() {
    const { t } = useTranslation();

    const [ show, setShow ] = useState(false);
    const [ showToast, setShowToast ] = useState(false);
    const [ showImport, setShowImport ] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [ steamId, setSteamId ] = useState("");
    const [ importedSteamGames, setImportedSteamGames] = useState<ImportedSteamGame[]>([]);
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
        setIsLoading(true);
        importSteamGames(steamId)
            .then(data => {
                setImportedSteamGames(data);
                setIsLoading(false);
                handleShowImport();
                handleClose();
            })
            .catch(() => {
                setIsLoading(false);
            });
    };

    return (
        <>
            <Container style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
                <AccountNav />

                <Container>
                    <Stack className=".d-flex justify-content-center align-items-center">
                        <h1>{t('settings')}</h1>
                    </Stack>
                    <br/>
                    <Stack className=".d-flex justify-content-center align-items-center">
                        <Row style={{justifyContent: "flex-start", gap: "10px"}}>
                            <Button onClick={handleShow}>{t('import_games_from_steam')}</Button>

                            {/*<Button variant="primary" onClick={() => {*/}
                            {/*    handleShowImport()*/}
                            {/*}}>Show import games</Button>*/}
                        </Row>
                    </Stack>
                </Container>
            </Container>

            <Modal show={show} centered={true} onHide={handleClose}
                   dialogClassName="modal-90w"
                   aria-labelledby="example-custom-modal-styling-title">
                <Modal.Header closeButton>
                    <Modal.Title>{t('import_games_from_steam')}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Label>{t('enter_steam_id')}:</Form.Label>
                        <Form.Control type="email" onChange={steamIdInputChange}/>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="outline-primary" onClick={handleClose}>
                        {t('cancel')}
                    </Button>
                    <Button variant="primary" onClick={() => {
                        handleImportGames();
                    }}>
                        {isLoading ? t('loading') : t('import')}
                    </Button>
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
                    <Modal.Title>{t('imported_games_from_steam')}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {isLoading ? (
                        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">{t('loading')}</span>
                            </div>
                        </div>
                    ) : (
                        <>
                            <Container>
                                <h2>{t('found_games')}: {importedSteamGames.length}</h2>
                            </Container>
                            <ImportGamesList importGames={importedSteamGames} onSwitchChange={handleSwitchChange} />
                        </>
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="outline-primary" onClick={handleCloseImport}>{t('cancel')}</Button>
                    <Button variant="primary" onClick={() => {
                        addImportedSteamGames(steamId, importedSteamGames.filter(game => checkedGameIds.includes(game.id)).map(game => game.id)).then();
                        handleCloseImport();
                        handleShowToast();
                    }}>{t('import')}</Button>
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

export default UserSettingsPage;