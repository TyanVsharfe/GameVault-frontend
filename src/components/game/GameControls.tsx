import React, {useContext, useEffect, useState} from 'react';
import Form from 'react-bootstrap/Form';
import {enumStatus} from "../../utils/Enums"
import {
    deleteUserGame,
    updateGameRating,
    updateGameStatus,
    updateUserGameModeRating, updateUserGameModeStatus,
    UserGame,
    UserMode
} from "../../services/userGamesService";
import {useParams} from "react-router-dom";
import "../../assets/styles/game-card.css"
import {useGameContext} from "./GameProdiver";
import {useTranslation} from "react-i18next";

import Select, {selectClasses} from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import {
    Button, Chip,
    FormControl,
    FormHelperText,
    FormLabel,
    Modal,
    ModalClose,
    ModalDialog, Stack,
    Switch,
    Tab,
    TabList,
    TabPanel,
    Tabs
} from "@mui/joy";
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import {GameMode} from "../../services/igdbGamesService";
import {statusColors} from "../../utils/Utils";

export interface GameControlsProps {
    gameModes: UserMode[] | GameMode[];
    isOverallRating: boolean;
    isOverallStatus: boolean;
}

function isUserMode(mode: UserMode | GameMode): mode is UserMode {
    return (mode as UserMode).status !== undefined;
}

const GameControls: React.FC<GameControlsProps> = ({ gameModes, isOverallRating, isOverallStatus }) => {
    const { t } = useTranslation();

    const { userRating, setUserRating, gameStatus, setGameStatus } = useGameContext();
    const igdbId = useParams<{ id: string }>();
    const [ show, setShow ] = useState(false);
    const [ activeEdit, setActiveEdit] = useState(0);
    const [ currentMode, setCurrentMode ] = useState("");
    const [ graphicsRating, setGraphicsRating ] = useState(5);
    const [ storyRating, setStoryRating ] = useState(5);
    const [ gameplayRating, setGameplayRating ] = useState(5);
    const [ resetUserRating, setResetUserRating ] = useState(false);

    const [ checkedOverallRating, setCheckedOverallRating ] = React.useState<boolean>(false);
    const [ checkedOverallStatus, setCheckedOverallStatus ] = React.useState<boolean>(false);

    const graphicsSliderChange = (e) => setGraphicsRating(e.target.value);

    const storySliderChange = (e) => setStoryRating(e.target.value);

    const gameplaySliderChange = (e) => setGameplayRating(e.target.value);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        setCheckedOverallRating(isOverallRating);
        setCheckedOverallStatus(isOverallStatus);
        if (gameModes.length === 1) {
            setCurrentMode(isUserMode(gameModes[0]) ? gameModes[0].mode : gameModes[0].name);
            setCheckedOverallRating(true);
        }
    }, [gameModes]);

    return (
        <>
            <Stack gap={2} style={{alignItems: 'center'}}>
                <Select className="game__button"
                        placeholder={t('change_status')}
                        indicator={<KeyboardArrowDown />}
                        sx={{
                            [`& .${selectClasses.indicator}`]: {
                                transition: '0.2s',
                                [`&.${selectClasses.expanded}`]: {
                                    transform: 'rotate(-180deg)',
                                },
                            },
                        }}>
                    <Option value={t('status_completed')} onClick={() => updateGameStatus(igdbId.id, enumStatus.Completed).then(() => setGameStatus("completed"))}>
                        {t('status_completed')}
                    </Option>
                    <Option value={t('status_playing')} onClick={() => updateGameStatus(igdbId.id, enumStatus.Playing).then(() => setGameStatus("playing"))}>
                        {t('status_playing')}
                    </Option>
                    <Option value={t('status_planned')} onClick={() => updateGameStatus(igdbId.id, enumStatus.Planned).then(() => setGameStatus("planned"))}>
                        {t('status_planned')}
                    </Option>
                    <Option value={t('status_abandoned')} onClick={() => updateGameStatus(igdbId.id, enumStatus.Abandoned).then(() => setGameStatus("abandoned"))}>
                        {t('status_abandoned')}
                    </Option>
                </Select>
                <Button className="game__button" onClick={handleShow}>
                    {t('change_rating')}
                </Button>
                <Button className="game__button" onClick={() => {deleteUserGame(igdbId.id).then(() => window.location.reload())}}>
                    {t('delete_game')}
                </Button>
            </Stack>

            <Modal open={show} layout="center" onClose={handleClose}
            >
                <ModalDialog style={{display: 'flex', gap: '1rem', width: '55%', height: '55%'}}>
                    <div style={{display: 'flex', flexDirection: 'horizontal', gap: '1rem'}}>
                        {t('set_rating')}
                        <Tabs value={activeEdit} onChange={(e, newValue) => setActiveEdit(newValue)}>
                            <TabList>
                                <Tab
                                    variant="plain"
                                    color="neutral" >
                                    Рейтинг
                                </Tab>
                                <Tab
                                    variant="plain"
                                    color="neutral" >
                                    Статус
                                </Tab>
                            </TabList>
                        </Tabs>
                    </div>
                    <ModalClose/>

                    {gameModes.length > 1 && (
                        <FormControl
                            orientation="horizontal"
                            sx={{width: 375, justifyContent: 'space-between'}}
                        >
                            <div>
                                <FormLabel>Общая оценка для {activeEdit === 0 ? `игр` : `статуса`}</FormLabel>
                                <FormHelperText>Поставить общее значение для {activeEdit === 0 ? `игры` : `статуса`}</FormHelperText>
                            </div>
                            <Switch
                                checked={activeEdit === 0 ? checkedOverallRating : checkedOverallStatus}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                    activeEdit === 0
                                        ? setCheckedOverallRating(event.target.checked)
                                        : setCheckedOverallStatus(event.target.checked)
                                }
                                color={activeEdit === 0
                                    ? checkedOverallRating ? 'success' : 'neutral'
                                    : checkedOverallStatus ? 'success' : 'neutral'}
                                variant={activeEdit === 0
                                    ? checkedOverallRating ? 'solid' : 'outlined'
                                    : checkedOverallStatus ? 'solid' : 'outlined'}
                                endDecorator={activeEdit === 0
                                    ? checkedOverallRating ? 'On' : 'Off'
                                    : checkedOverallStatus ? 'On' : 'Off'}
                                slotProps={{
                                    endDecorator: {
                                        sx: {
                                            minWidth: 24,
                                        },
                                    },
                                }}
                            />
                        </FormControl>
                    )}

                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        height: '100%'
                    }}>
                        {((!checkedOverallRating && activeEdit === 0) || (!checkedOverallStatus && activeEdit === 1)) &&
                            (
                                <Select
                                    value={currentMode}
                                    placeholder={t('select_mode')}
                                    onChange={(event, newValue) => setCurrentMode(newValue)}
                                    sx={{minWidth: 120, marginTop: 0}}
                                >
                                    {isUserMode(gameModes[0]) ?
                                        (gameModes as UserMode[]).map((mode) => (
                                            <Option key={mode.id} value={mode.mode}>
                                                {t(`${mode.mode.replace('-', '_')}`)}
                                            </Option>
                                        )) : (gameModes as GameMode[]).map((mode) => (
                                            <Option key={mode.id} value={mode.slug}>
                                                {t(`${mode.slug.replace('-', '_')}`)}
                                            </Option>
                                        ))
                                    }
                                </Select>
                            )
                        }
                        <div style={{display: 'flex', marginTop: '0.5rem', gap: '1rem'}}>
                            <h4>{activeEdit === 0 ? `Текущая оценка:` : `Текущий статус:`}</h4>
                            <h4>
                                {activeEdit === 0
                                    ? checkedOverallRating
                                        ? userRating
                                        : gameModes.find(mode => mode.mode === currentMode)?.userRating ?? t('none_score')
                                    : checkedOverallStatus
                                        ? <Chip size='lg' variant='solid' style={{backgroundColor: statusColors[gameStatus]}}
                                                        sx={{
                                                            fontSize: '1rem',
                                                            padding: '0.2rem 1rem',
                                                        }}>
                                            {t(`status_${gameStatus?.toLowerCase()}`)}
                                          </Chip>
                                    : <Chip size='lg' variant='solid' style={{backgroundColor: statusColors[gameStatus]}}
                                            sx={{
                                                fontSize: '1.15rem',
                                            }}>
                                            {t(`status_${gameModes.find(mode => mode.mode === currentMode)?.status ?? 'none'}`).toLowerCase()}
                                        </Chip>
                                }
                            </h4>
                        </div>

                        {activeEdit == 0 && (
                            <>
                                <Form>
                                    <Form.Label>{t('graphics')}: {graphicsRating}</Form.Label>
                                    <Form.Range value={graphicsRating} max={10} onChange={graphicsSliderChange}/>

                                    <Form.Label>{t('story')}: {storyRating}</Form.Label>
                                    <Form.Range value={storyRating} max={10} onChange={storySliderChange}/>

                                    <Form.Label>{t('gameplay')}: {gameplayRating}</Form.Label>
                                    <Form.Range value={gameplayRating} max={10} onChange={gameplaySliderChange}/>
                                </Form>

                                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                    <Button onClick={handleClose}>
                                        {t('cancel')}
                                    </Button>
                                    <div style={{display: 'flex', gap: '1rem'}}>
                                        <Button onClick={() => {
                                            handleClose();
                                            updateGameRating({
                                                igdbId: igdbId?.id,
                                                resetUserRating: true
                                            }).then(() => setUserRating(undefined));
                                        }} color="danger">
                                            {t('reset_rating')}
                                        </Button>
                                        <Button onClick={() => {
                                            handleClose();
                                            checkedOverallRating
                                                ? (updateGameRating({
                                                    igdbId: igdbId?.id,
                                                    graphics: graphicsRating,
                                                    story: storyRating,
                                                    gameplay: gameplayRating,
                                                    resetUserRating: resetUserRating
                                                }).then(rat => setUserRating(rat)))
                                                : (updateUserGameModeRating(currentMode, false,
                                                    {
                                                        igdbId: igdbId?.id,
                                                        graphics: graphicsRating,
                                                        story: storyRating,
                                                        gameplay: gameplayRating,
                                                    }).then(rat => setUserRating(rat)));
                                        }}>
                                            {t('save_changes')}
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}

                        {activeEdit === 1 && (
                            <>
                                <Stack gap={3} style={{alignItems: 'center'}}>
                                    <Select className="game__button"
                                            placeholder={t('change_status')}
                                            indicator={<KeyboardArrowDown/>}
                                            sx={{
                                                [`& .${selectClasses.indicator}`]: {
                                                    transition: '0.2s',
                                                    [`&.${selectClasses.expanded}`]: {
                                                        transform: 'rotate(-180deg)',
                                                    },
                                                },
                                            }}>
                                        <Option value={t('status_completed')}
                                                onClick={() => checkedOverallStatus
                                                    ? updateGameStatus(igdbId?.id, enumStatus.Completed).then(() => setGameStatus("completed"))
                                                    : updateUserGameModeStatus(igdbId?.id, currentMode, enumStatus.Completed).then(() => setGameStatus("completed"))}>
                                            {t('status_completed')}
                                        </Option>
                                        <Option value={t('status_playing')}
                                                onClick={() => checkedOverallStatus
                                                    ? updateGameStatus(igdbId?.id, enumStatus.Playing).then(() => setGameStatus("playing"))
                                                    : updateUserGameModeStatus(igdbId?.id, currentMode, enumStatus.Playing).then(() => setGameStatus("playing"))}>
                                            {t('status_playing')}
                                        </Option>
                                        <Option value={t('status_planned')}
                                                onClick={() => checkedOverallStatus
                                                    ? updateGameStatus(igdbId?.id, enumStatus.Planned).then(() => setGameStatus("planned"))
                                                    : updateUserGameModeStatus(igdbId?.id, currentMode, enumStatus.Planned).then(() => setGameStatus("planned"))}>
                                            {t('status_planned')}
                                        </Option>
                                        <Option value={t('status_abandoned')}
                                                onClick={() => checkedOverallStatus
                                                    ? updateGameStatus(igdbId?.id, enumStatus.Abandoned).then(() => setGameStatus("abandoned"))
                                                    : updateUserGameModeStatus(igdbId?.id, currentMode, enumStatus.Abandoned).then(() => setGameStatus("abandoned"))}>
                                            {t('status_abandoned')}
                                        </Option>
                                    </Select>
                                </Stack>
                                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                    <Button onClick={handleClose}>
                                        {t('cancel')}
                                    </Button>
                                    <div style={{display: 'flex', gap: '1rem'}}>
                                        <Button onClick={() => {
                                            handleClose();
                                            updateGameStatus(igdbId?.id, "none").then(() => setGameStatus("none"));
                                        }} color="danger">
                                            {t('reset_status')}
                                        </Button>
                                        <Button onClick={() => {handleClose()}}>
                                            {t('save_changes')}
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </ModalDialog>
            </Modal>
        </>
    );
}

export default GameControls;