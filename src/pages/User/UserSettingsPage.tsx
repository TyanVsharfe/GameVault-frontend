import React, {useEffect, useState} from "react";
import {ImportedSteamGame, steamGamesService} from "../../api/services/steamGamesService";
import ImportGamesList from "../../components/game/list/ImportGamesList";
import "../../assets/styles/account.css"
import {useTranslation} from "react-i18next";
import AccountTabs from "../../components/nav/AccountTabs";
import {Box, Button, Input, Modal, ModalClose, ModalDialog, Stack, Typography} from "@mui/joy";
import ModalOverflow from '@mui/joy/ModalOverflow';
import {Toast} from "../../components/toast/Toast";
import {UserProfile, userProfileService} from "../../api/services/userProfileService";
import FormLabel from "@mui/joy/FormLabel";

function UserSettingsPage() {
    const { t } = useTranslation();

    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

    const [ show, setShow ] = useState(false);
    const [ showToast, setShowToast ] = useState(false);
    const [ showImport, setShowImport ] = useState(false);
    const [ isLoading, setIsLoading ] = useState(false);

    const [ isEditSteam, setIsEditSteam ] = useState(false);

    const [ steamId, setSteamId ] = useState<string>("");
    const [ importedSteamGames, setImportedSteamGames] = useState<ImportedSteamGame[]>([]);
    const [ checkedGameIds, setCheckedGameIds ] = useState([]);

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

    useEffect(() => {
        userProfileService.getProfile().then(data => {
            setUserProfile(data)
            setSteamId(data.steamId)
        });
    }, []);

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

    const handleSaveSteamSettings = () => {
        userProfileService.editSteamInfo({steamId: steamId}).then(data => {setSteamId(data.steamId)});
    };

    return (
        <>
            <Box style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
                <AccountTabs/>

                <Box>
                    <Stack className=".d-flex justify-content-center align-items-center">
                        <h1>{t('settings')}</h1>
                    </Stack>
                    <Stack className=".d-flex justify-content-center align-items-center" sx={{width: "100%"}}>
                        <Stack style={{justifyContent: "flex-start", gap: "1rem"}}>
                            <Stack
                                direction="row"
                                sx={{gap: "0.5rem", padding: "0"}}
                            >
                                <Stack sx={{ marginRight: "1rem" }}>
                                    {isEditSteam ? (
                                        <>
                                            <Input
                                                placeholder="Enter Steam Id"
                                                value={steamId}
                                                onChange={steamIdInputChange}
                                                sx={{ width: "11.25rem" }}
                                            />
                                            <Typography
                                                level="body-xs"
                                                sx={{ alignSelf: "flex-end", color: "hsl(09698 80% 30%)" }}
                                            >
                                                {(steamId?.length < 17 || steamId?.length > 17) && "Steam id must be 17 chars"}
                                            </Typography>
                                        </>
                                    ) : (
                                        <Input
                                            disabled
                                            value={steamId || userProfile?.steamId || ""}
                                            placeholder="No steam id"
                                            sx={{ width: "11.25rem" }}
                                        />
                                    )}
                                </Stack>
                                <Button
                                    sx={{ height: "2rem", fontSize: "1rem", fontWeight: "normal" }}
                                    onClick={() => setIsEditSteam(!isEditSteam)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    sx={{
                                        height: "2rem",
                                        fontSize: '1rem',
                                        fontWeight: 'normal'
                                    }}
                                    onClick={handleSaveSteamSettings}
                                >
                                    Save
                                </Button>
                            </Stack>
                            {/*<Button onClick={handleShow}*/}
                            {/*        sx={{*/}
                            {/*            width: '18rem',*/}
                            {/*            fontSize: '1rem',*/}
                            {/*            fontWeight: 'normal'*/}
                            {/*        }}*/}
                            {/*>*/}
                            {/*    {t('import_games_from_steam')}*/}
                            {/*</Button>*/}

                            <Button fullWidth
                                    onClick={() => {
                                        handleImportGames();
                                    }}>
                                {isLoading ? t('loading') : t('import_games_from_steam')}
                            </Button>

                            {/*<Button variant="primary" onClick={() => {*/}
                            {/*    handleShowImport()*/}
                            {/*}}>Show import games</Button>*/}
                        </Stack>
                    </Stack>
                </Box>
            </Box>

            <Modal open={show}
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
                        <form>
                            <FormLabel>{t('enter_steam_id')}:</FormLabel>
                            <Input type="email" onChange={steamIdInputChange}/>
                        </form>
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
                        style={{display: 'flex', gap: '1rem', width: '75%', height: '90%'}}
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
                                    <div style={{height: "42rem"}}>
                                        <ImportGamesList importGames={importedSteamGames}
                                                         onSwitchChange={handleSwitchChange}/>
                                    </div>
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
                onClose={() => setShowToast(false)}
            />
        </>
    );
}

export default UserSettingsPage;