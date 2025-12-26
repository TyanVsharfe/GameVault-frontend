import React, {useEffect, useState} from "react";
import Container from "react-bootstrap/Container";
import {Stack} from "react-bootstrap";
import Row from "react-bootstrap/Row";
import {ImportedSteamGame, steamGamesService} from "../../api/services/steamGamesService";
import Form from "react-bootstrap/Form";
import ImportGamesList from "../../components/game/list/ImportGamesList";
import "../../assets/styles/account.css"
import {useTranslation} from "react-i18next";
import AccountTabs from "../../components/nav/AccountTabs";
import {Box, Button, Modal, ModalClose, ModalDialog} from "@mui/joy";
import ModalOverflow from '@mui/joy/ModalOverflow';
import {Toast} from "../../components/toast/Toast";

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
        console.log("Updated importSteamGames:", importedSteamGames);
        console.log("Data length " + importedSteamGames.length);
    }, [importedSteamGames]);

    const handleImportGames = () => {
        setIsLoading(true);
        steamGamesService.importSteamGames(steamId)
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
                <AccountTabs/>

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

            <Modal open={show}
                   layout="center"
                   onClose={handleClose}
                   // dialogClassName="modal-90w"
                   // aria-labelledby="example-custom-modal-styling-title"
            >
                <ModalDialog
                    style={{display: 'flex', gap: '1rem', width: '40rem', minWidth: '22rem'}}
                >
                    <div>
                        <h3>{t('import_games_from_steam')}</h3>
                        <ModalClose/>
                    </div>

                    <div>
                        <Form>
                            <Form.Label>{t('enter_steam_id')}:</Form.Label>
                            <Form.Control type="email" onChange={steamIdInputChange}/>
                        </Form>
                    </div>

                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <div style={{width: '30%'}}>
                            <Button fullWidth
                                    onClick={handleClose}
                            >
                                {t('cancel')}
                            </Button>
                        </div>
                        <div style={{width: '30%'}}>
                            <Button fullWidth
                                    onClick={() => {
                                        handleImportGames();
                                    }}>
                                {isLoading ? t('loading') : t('import')}
                            </Button>
                        </div>
                    </div>
                </ModalDialog>
            </Modal>

            <Modal
                open={showImport}
                onClose={handleCloseImport}
                sx={{
                    overflow: 'auto',
                }}
            >
                <ModalOverflow>
                    <ModalDialog
                        style={{display: 'flex', gap: '1rem', width: '75%', height: '93%'}}
                    >
                        <div style={{display: "flex", justifyContent: "space-between"}}>
                            <h3 style={{paddingLeft: "2rem"}}>{t('imported_games_from_steam')}: {importedSteamGames.length}</h3>
                            {/*<h3 style={{paddingRight: "2rem"}}>Выбрано: {checkedGameIds.length}</h3>*/}
                        </div>
                        <ModalClose/>

                        <div>
                            {isLoading ? (
                                <div className="d-flex justify-content-center align-items-center"
                                     style={{minHeight: '200px', width: '150%'}}>
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">{t('loading')}</span>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {/*<Container>*/}
                                    {/*    <h2>{t('found_games')}: </h2>*/}
                                    {/*</Container>*/}
                                    <ImportGamesList importGames={importedSteamGames}
                                                     onSwitchChange={handleSwitchChange}/>
                                    <Box sx={{
                                        position: 'sticky',
                                        bottom: 0,
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        gap: 20,
                                        flexShrink: 0,
                                    }}>
                                        <div style={{width: '30vh'}}>
                                            <Button fullWidth
                                                    onClick={handleCloseImport}
                                            >
                                                {t('cancel')}
                                            </Button>
                                        </div>
                                        <div style={{width: '30vh'}}>
                                            <Button fullWidth
                                                    disabled={checkedGameIds.length === 0}
                                                    onClick={() => {
                                                        steamGamesService.addImportedSteamGames(steamId, importedSteamGames.filter(
                                                            game => checkedGameIds.includes(game.id))
                                                            .map(game => game.id)).then();
                                                        handleCloseImport();
                                                        handleShowToast();
                                                    }}>
                                                {t('import')} ({checkedGameIds.length})
                                            </Button>
                                        </div>
                                    </Box>
                                </>
                            )}
                        </div>
                    </ModalDialog>
                </ModalOverflow>
            </Modal>

            <Toast
                module="Import Steam games"
                message="Games are imported."
                isSuccess={true}
                open={showToast}
            />
        </>
    );
}

export default UserSettingsPage;