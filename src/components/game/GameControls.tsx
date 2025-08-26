import React, {useContext, useState} from 'react';
// import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import {Dropdown, Stack} from "react-bootstrap";
import {enumStatus} from "../../utils/Enums"
import {deleteUserGame, updateGameRating, updateGameStatus} from "../../services/userGamesService";
import {useParams} from "react-router-dom";
import "../../assets/styles/game-card.css"
import {useGameContext} from "./GameProdiver";
import {useTranslation} from "react-i18next";

import Select, {selectClasses} from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import {Button} from "@mui/joy";
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';

function GameControls() {
    const { t } = useTranslation();

    const { setUserRating, setGameStatus } = useGameContext();
    const igdbId = useParams<{ id: string }>();
    const [ show, setShow ] = useState(false);
    const [ graphicsRating, setGraphicsRating ] = useState(5);
    const [ storyRating, setStoryRating ] = useState(5);
    const [ gameplayRating, setGameplayRating ] = useState(5);

    const graphicsSliderChange = (e) => setGraphicsRating(e.target.value);

    const storySliderChange = (e) => setStoryRating(e.target.value);

    const gameplaySliderChange = (e) => setGameplayRating(e.target.value);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Stack gap={3} style={{alignItems: 'center'}}>
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
                    <Option value={t('status_completed')} onClick={() => updateGameStatus(igdbId.id, enumStatus.Completed).then(() => setGameStatus("Completed"))}>
                        {t('status_completed')}
                    </Option>
                    <Option value={t('status_playing')} onClick={() => updateGameStatus(igdbId.id, enumStatus.Playing).then(() => setGameStatus("Playing"))}>
                        {t('status_playing')}
                    </Option>
                    <Option value={t('status_planned')} onClick={() => updateGameStatus(igdbId.id, enumStatus.Planned).then(() => setGameStatus("Planned"))}>
                        {t('status_planned')}
                    </Option>
                    <Option value={t('status_abandoned')} onClick={() => updateGameStatus(igdbId.id, enumStatus.Abandoned).then(() => setGameStatus("Abandoned"))}>
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

            <Modal show={show} centered={true} onHide={handleClose}
                   dialogClassName="modal-90w"
                   aria-labelledby="example-custom-modal-styling-title">
                <Modal.Header closeButton>
                    <Modal.Title>{t('set_rating')}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Label>{t('graphics')}: {graphicsRating}</Form.Label>
                        <Form.Range value={graphicsRating} max={10} onChange={graphicsSliderChange}/>

                        <Form.Label>{t('story')}: {storyRating}</Form.Label>
                        <Form.Range value={storyRating} max={10} onChange={storySliderChange}/>

                        <Form.Label>{t('gameplay')}: {gameplayRating}</Form.Label>
                        <Form.Range value={gameplayRating} max={10} onChange={gameplaySliderChange}/>
                    </Form>
                </Modal.Body>

                <Modal.Footer style={{justifyContent: 'space-between'}}>
                    <Button onClick={handleClose}>
                        {t('cancel')}
                    </Button>
                    <Button onClick={(rat) => {
                        handleClose();
                        updateGameRating(igdbId.id, graphicsRating, storyRating, gameplayRating).then(rat => setUserRating(rat));
                    }}>
                        {t('save_changes')}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default GameControls;